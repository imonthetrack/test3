import React from 'react';
import { HARDWARE_COMPONENTS } from '../data/hardwareComponents';
import { Cpu, Monitor, CloudDrizzle, Wind, Thermometer, Zap, Fan, Sparkles, Sun, Volume2, Power, Cable, X, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface ComponentInspectorProps {
  selectedComponent: string | null;
  onClose: () => void;
  onSelectComponent: (id: string) => void;
  currentPm: number;
  currentCo2: number;
  currentTemp: number;
  currentRh: number;
  isFanActive: boolean;
  isFilterActive: boolean;
  level: number;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Cpu,
  Monitor,
  CloudDrizzle,
  Wind,
  Thermometer,
  Zap,
  Fan,
  Sparkles,
  Sun,
  Volume2,
  Power,
  Cable,
};

export const ComponentInspector: React.FC<ComponentInspectorProps> = ({
  selectedComponent,
  onClose,
  onSelectComponent,
  currentPm,
  currentCo2,
  currentTemp,
  currentRh,
  isFanActive,
  isFilterActive,
  level,
}) => {
  if (!selectedComponent) return null;

  const comp = HARDWARE_COMPONENTS[selectedComponent];
  if (!comp) return null;

  const IconComponent = ICON_MAP[comp.icon] || Info;

  // Derive dynamic live data relevant to component
  let dynamicStatusText = comp.status;
  if (comp.id === 'pm') {
    dynamicStatusText = `Laser Reading: ${currentPm} µg/m³ (${level === 0 ? 'Normal' : level === 1 ? 'Meningkat' : 'Tinggi'})`;
  } else if (comp.id === 'co2') {
    dynamicStatusText = `NDIR Optical: ${currentCo2} ppm (${currentCo2 > 800 ? 'Perlu Ventilasi' : 'Segar'})`;
  } else if (comp.id === 'dht') {
    dynamicStatusText = `Suhu: ${currentTemp.toFixed(1)}°C · Kelembapan: ${Math.round(currentRh)}%`;
  } else if (comp.id === 'fan') {
    dynamicStatusText = isFanActive ? '🌀 SEDANG BERPUTAR (Relay IN1 Aktif)' : '⏸ Siaga / OFF (Menunggu CO₂ > 800)';
  } else if (comp.id === 'filter') {
    dynamicStatusText = isFilterActive ? '🫧 MENYARING PARTIKEL (Relay IN2 Aktif)' : '⏸ Siaga / OFF (Menunggu PM > 15.5)';
  } else if (comp.id === 'led') {
    dynamicStatusText = level === 0 ? '🟢 Hijau Menyala (Udara Baik)' : level === 1 ? '🟡 Kuning Menyala (Waspada)' : '🔴 Merah Berkedip (Bahaya)';
  }

  return (
    <div className="bg-slate-900/95 border border-teal-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-xl relative transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold tracking-wider uppercase text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                Hardware Component
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Pinout
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 font-sans mt-0.5">{comp.name}</h3>
            <p className="text-xs text-slate-400">{comp.subtitle}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          aria-label="Tutup inspeksi komponen"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4">
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
          <span className="text-teal-400/80 font-mono font-semibold block mb-1">🔌 KONEKSI PIN & PROTOKOL:</span>
          <p className="text-slate-200 font-mono leading-relaxed">{comp.pins}</p>
        </div>
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
          <span className="text-cyan-400/80 font-mono font-semibold block mb-1">⚙️ SPESIFIKASI TEKNIS:</span>
          <p className="text-slate-300 leading-relaxed">{comp.specs}</p>
        </div>
      </div>

      {/* Role & Telemetry */}
      <div className="space-y-3 mb-4">
        <div className="bg-teal-950/20 border border-teal-500/20 rounded-xl p-3 text-xs">
          <span className="text-teal-300 font-semibold block mb-1">🎯 Peran Dalam Sistem SIAGA-UDARA AI:</span>
          <p className="text-slate-300 leading-relaxed">{comp.role}</p>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">Status Pembacaan Saat Ini:</span>
          <span className="text-xs font-mono font-semibold text-teal-300 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/30">
            {dynamicStatusText}
          </span>
        </div>
      </div>

      {/* Quick Component Switcher Pills */}
      <div className="pt-2 border-t border-slate-800/80">
        <span className="text-[11px] text-slate-400 block mb-2 font-mono">Pilih komponen lain untuk diinspeksi:</span>
        <div className="flex flex-wrap gap-1.5">
          {Object.values(HARDWARE_COMPONENTS).map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectComponent(item.id)}
              className={`text-[11px] px-2.5 py-1 rounded-lg transition-all duration-200 font-mono ${
                selectedComponent === item.id
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              }`}
            >
              {item.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
