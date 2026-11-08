import { useState, useEffect, useRef, useCallback } from 'react';
import {
  LocationType,
  ScenarioType,
  QualityLevel,
  SensorReading,
  TelemetryLogEntry,
  ClassificationResult,
  DeviceState,
} from '../types/siaga';
import { soundEngine } from '../utils/audio';

// Target convergence points for scenarios [PM2.5, CO2]
export const SCENARIO_TARGETS: Record<ScenarioType, Record<LocationType, [number, number]>> = {
  'Normal': {
    'Lapangan': [25, 450],
    'Kelas': [20, 700],
  },
  'Kabut asap': {
    'Lapangan': [95, 470],
    'Kelas': [62, 760],
  },
  'Kelas penuh': {
    'Lapangan': [28, 450],
    'Kelas': [24, 1700],
  },
};

export const LEVEL_NAMES: Record<QualityLevel, string> = {
  0: 'Baik',
  1: 'Sedang',
  2: 'Tidak Sehat',
};

export const LEVEL_BADGES: Record<QualityLevel, { label: string; color: string; bg: string; border: string }> = {
  0: { label: 'Baik', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  1: { label: 'Sedang', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  2: { label: 'Tidak Sehat', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
};

export const ADVISORY_MESSAGES: Record<QualityLevel, [string, string]> = {
  0: ['Kondisi normal', 'Udara aman. Aktivitas di dalam dan luar ruangan berjalan seperti biasa.'],
  1: ['Waspada kualitas udara', 'Batasi aktivitas berat. Buka ventilasi bila CO₂ tinggi, siapkan masker untuk kelompok sensitif.'],
  2: ['Kurangi aktivitas luar ruangan', 'Pindahkan olahraga ke dalam ruangan, tutup jendela saat PM tinggi, nyalakan filtrasi.'],
};

export function classify(pm: number, co2: number): ClassificationResult {
  const pmLv: QualityLevel = pm <= 15.5 ? 0 : pm <= 55.4 ? 1 : 2;
  const co2Lv: QualityLevel = co2 <= 800 ? 0 : co2 <= 1500 ? 1 : 2;
  return {
    lv: Math.max(pmLv, co2Lv) as QualityLevel,
    src: pmLv >= co2Lv ? 'PM2.5' : 'CO₂',
  };
}

// Linear regression forecast for horizonSteps (each step = 5 minutes, 6 steps = 30 minutes)
export function predict(series: number[], horizonSteps: number): number {
  const n = Math.min(series.length, 8);
  if (n < 3) return series[series.length - 1] ?? 0;

  const subset = series.slice(-n);
  const xMean = (n - 1) / 2;
  const yMean = subset.reduce((acc, v) => acc + v, 0) / n;

  let cov = 0;
  let variance = 0;
  subset.forEach((y, x) => {
    cov += (x - xMean) * (y - yMean);
    variance += (x - xMean) ** 2;
  });

  const slope = variance === 0 ? 0 : cov / variance;
  const lastVal = subset[n - 1];
  return Math.max(0, lastVal + slope * horizonSteps);
}

export function formatClock(totalMinutes: number): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${pad(h)}.${pad(m)}`;
}

export function useSiagaSimulation() {
  const [selectedLoc, setSelectedLoc] = useState<LocationType>('Lapangan');
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>('Normal');
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualPm, setManualPm] = useState(25);
  const [manualCo2, setManualCo2] = useState(450);

  const [simTime, setSimTime] = useState<number>(7 * 60 + 30); // 07:30
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isBuzzerRinging, setIsBuzzerRinging] = useState(false);
  const [lcdFrameIndex, setLcdFrameIndex] = useState(0);

  // Sensor state per location
  const [locationsData, setLocationsData] = useState<Record<LocationType, SensorReading>>({
    Lapangan: {
      pm: 42,
      pm10: 65,
      co2: 510,
      t: 28.5,
      rh: 80,
      h: [
        { pm: 38, co2: 480 },
        { pm: 39, co2: 490 },
        { pm: 41, co2: 500 },
        { pm: 42, co2: 510 },
      ],
    },
    Kelas: {
      pm: 32,
      pm10: 48,
      co2: 780,
      t: 26.8,
      rh: 72,
      h: [
        { pm: 30, co2: 720 },
        { pm: 31, co2: 740 },
        { pm: 31, co2: 760 },
        { pm: 32, co2: 780 },
      ],
    },
  });

  const [logs, setLogs] = useState<TelemetryLogEntry[]>([]);

  // Sound Engine linkage
  useEffect(() => {
    soundEngine.setRingCallback((durationMs) => {
      setIsBuzzerRinging(true);
      setTimeout(() => setIsBuzzerRinging(false), durationMs);
    });
  }, []);

  const toggleSound = useCallback(() => {
    const newState = soundEngine.toggleSound();
    setIsSoundOn(newState);
  }, []);

  // Frame tick for LCD display (every 1.8s)
  useEffect(() => {
    const lcdTimer = setInterval(() => {
      setLcdFrameIndex((prev) => (prev + 1) % 4);
    }, 1800);
    return () => clearInterval(lcdTimer);
  }, []);

  // Main simulation tick (runs every 2.5s)
  useEffect(() => {
    const simTimer = setInterval(() => {
      setSimTime((prevTime) => prevTime + 5);

      setLocationsData((prevData) => {
        const nextData = { ...prevData };
        const newEntries: TelemetryLogEntry[] = [];

        (['Lapangan', 'Kelas'] as LocationType[]).forEach((loc) => {
          const current = nextData[loc];
          const [targetPmBase, targetCo2Base] = SCENARIO_TARGETS[selectedScenario][loc];

          let newPm: number;
          let newCo2: number;

          if (isManualMode && loc === selectedLoc) {
            newPm = manualPm + (Math.random() - 0.5) * 1.5;
            newCo2 = manualCo2 + (Math.random() - 0.5) * 15;
          } else {
            newPm = current.pm + (targetPmBase - current.pm) * 0.18 + (Math.random() - 0.5) * 6;
            newCo2 = current.co2 + (targetCo2Base - current.co2) * 0.18 + (Math.random() - 0.5) * 35;
          }

          newPm = Math.max(3, newPm);
          newCo2 = Math.max(350, newCo2);
          const newPm10 = Math.max(5, newPm * 1.5 + (Math.random() - 0.5) * 4);
          const newT = current.t + (Math.random() - 0.5) * 0.2;
          const newRh = Math.min(99, Math.max(30, current.rh + (Math.random() - 0.5) * 0.6));

          const newHistory = [...current.h, { pm: newPm, co2: newCo2 }];
          if (newHistory.length > 24) newHistory.shift();

          nextData[loc] = {
            pm: newPm,
            pm10: newPm10,
            co2: newCo2,
            t: newT,
            rh: newRh,
            h: newHistory,
          };

          const cls = classify(newPm, newCo2);
          newEntries.unshift({
            id: `${Date.now()}-${loc}`,
            time: formatClock(simTime + 5),
            location: loc,
            pm: Math.round(newPm),
            pm10: Math.round(newPm10),
            co2: Math.round(newCo2),
            t: newT.toFixed(1),
            rh: Math.round(newRh),
            level: cls.lv,
          });
        });

        setLogs((prevLogs) => [...newEntries, ...prevLogs].slice(0, 40));
        return nextData;
      });
    }, 2500);

    return () => clearInterval(simTimer);
  }, [selectedScenario, isManualMode, manualPm, manualCo2, selectedLoc, simTime]);

  // Derived current metrics for the active location
  const activeReading = locationsData[selectedLoc];
  const currentClassification = classify(activeReading.pm, activeReading.co2);

  // Predictions (30 mins = 6 steps ahead)
  const pmHistory = activeReading.h.map((h) => h.pm);
  const co2History = activeReading.h.map((h) => h.co2);
  const predictedPm = predict(pmHistory, 6);
  const predictedCo2 = predict(co2History, 6);
  const predictedClassification = classify(predictedPm, predictedCo2);

  // Overall level (highest between current and 30-min prediction)
  const overallLevel = Math.max(currentClassification.lv, predictedClassification.lv) as QualityLevel;
  const primaryTrigger = currentClassification.lv >= predictedClassification.lv
    ? currentClassification.src
    : predictedClassification.src;

  // Automated Actuators
  const isFanActive = predictedCo2 > 800 || activeReading.co2 > 800;
  const isFilterActive = predictedPm > 15.5 || activeReading.pm > 15.5;

  // Synchronize audio buzzer
  useEffect(() => {
    soundEngine.syncAlarm(overallLevel);
  }, [overallLevel]);

  const deviceState: DeviceState = {
    lv: overallLevel,
    fan: isFanActive,
    fil: isFilterActive,
    pm: Math.round(activeReading.pm),
    co2: Math.round(activeReading.co2),
    src: primaryTrigger,
    fr: lcdFrameIndex,
  };

  return {
    selectedLoc,
    setSelectedLoc,
    selectedScenario,
    setSelectedScenario,
    isManualMode,
    setIsManualMode,
    manualPm,
    setManualPm,
    manualCo2,
    setManualCo2,
    simTime,
    formattedTime: formatClock(simTime),
    locationsData,
    activeReading,
    currentClassification,
    predictedPm,
    predictedCo2,
    predictedClassification,
    overallLevel,
    primaryTrigger,
    isFanActive,
    isFilterActive,
    deviceState,
    logs,
    isSoundOn,
    toggleSound,
    isBuzzerRinging,
  };
}
