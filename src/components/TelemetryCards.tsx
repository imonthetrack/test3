import React from 'react';
import { SensorReading, QualityLevel } from '../types/siaga';
import { LEVEL_NAMES } from '../hooks/useSiagaSimulation';
import { CloudDrizzle, Wind, Thermometer, Droplets, Clock, MapPin, Activity } from 'lucide-react';

interface TelemetryCardsProps {
  reading: SensorReading;
  selectedLoc: string;
  formattedTime: string;
  level: QualityLevel;
}

export const TelemetryCards: React.FC<TelemetryCardsProps> = ({
  reading,
  selectedLoc,
  formattedTime,
  level,
}) => {
  const pmLv: QualityLevel = reading.pm <= 15.5 ? 0 : reading.pm <= 55.4 ? 1 : 2;
  const pm10Lv: QualityLevel = reading.pm10 <= 50 ? 0 : reading.pm10 <= 150 ? 1 : 2;
  const co2Lv: QualityLevel = reading.co2 <= 800 ? 0 : reading.co2 <= 1500 ? 1 : 2;

  const getStatusBadge = (lv: QualityLevel) => {
    if (lv === 0) {
      return (
        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {LEVEL_NAMES[0]}
        </span>
      );
    }
    if (lv === 1) {
      return (
        <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          {LEVEL_NAMES[1]}
        </span>
      );
    }
    return (
      <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
        {LEVEL_NAMES[2]}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 my-6">
      {/* 1. PM2.5 */}
      <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-lg backdrop-blur-md transition-all duration-300 group">
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
            <CloudDrizzle className="w-4 h-4" />
          </div>
          {getStatusBadge(pmLv)}
        </div>
        <span className="text-xs text-slate-400 font-medium block">PM2.5</span>
        <div className="flex items-baseline gap-1 my-1">
          <span className="text-2xl font-bold font-mono text-slate-100">{Math.round(reading.pm)}</span>
          <span className="text-xs text-slate-400 font-mono">µg/m³</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              pmLv === 0 ? 'bg-emerald-400' : pmLv === 1 ? 'bg-amber-400' : 'bg-rose-500'
            }`}
            style={{ width: `${Math.min(100, (reading.pm / 100) * 100)}%` }}
          />
        </div>
        <span className="text-[10px] text-slate-500 block mt-1 font-mono">Batas Aman: 15.5 µg/m³</span>
      </div>

      {/* 2. PM10 */}
      <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-lg backdrop-blur-md transition-all duration-300 group">
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
            <Wind className="w-4 h-4" />
          </div>
          {getStatusBadge(pm10Lv)}
        </div>
        <span className="text-xs text-slate-400 font-medium block">PM10</span>
        <div className="flex items-baseline gap-1 my-1">
          <span className="text-2xl font-bold font-mono text-slate-100">{Math.round(reading.pm10)}</span>
          <span className="text-xs text-slate-400 font-mono">µg/m³</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              pm10Lv === 0 ? 'bg-emerald-400' : pm10Lv === 1 ? 'bg-amber-400' : 'bg-rose-500'
            }`}
            style={{ width: `${Math.min(100, (reading.pm10 / 150) * 100)}%` }}
          />
        </div>
        <span className="text-[10px] text-slate-500 block mt-1 font-mono">Batas Aman: 50 µg/m³</span>
      </div>

      {/* 3. CO2 */}
      <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-lg backdrop-blur-md transition-all duration-300 group">
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
            <Activity className="w-4 h-4" />
          </div>
          {getStatusBadge(co2Lv)}
        </div>
        <span className="text-xs text-slate-400 font-medium block">CO₂ (NDIR)</span>
        <div className="flex items-baseline gap-1 my-1">
          <span className="text-2xl font-bold font-mono text-slate-100">{Math.round(reading.co2)}</span>
          <span className="text-xs text-slate-400 font-mono">ppm</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              co2Lv === 0 ? 'bg-emerald-400' : co2Lv === 1 ? 'bg-amber-400' : 'bg-rose-500'
            }`}
            style={{ width: `${Math.min(100, (reading.co2 / 2000) * 100)}%` }}
          />
        </div>
        <span className="text-[10px] text-slate-500 block mt-1 font-mono">Ambang Ventilasi: 800 ppm</span>
      </div>

      {/* 4. Suhu */}
      <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-lg backdrop-blur-md transition-all duration-300 group">
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
            <Thermometer className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full font-mono">
            DHT22
          </span>
        </div>
        <span className="text-xs text-slate-400 font-medium block">Suhu Ruang</span>
        <div className="flex items-baseline gap-1 my-1">
          <span className="text-2xl font-bold font-mono text-slate-100">{reading.t.toFixed(1)}</span>
          <span className="text-xs text-slate-400 font-mono">°C</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-orange-400 transition-all duration-500"
            style={{ width: `${Math.min(100, (reading.t / 40) * 100)}%` }}
          />
        </div>
        <span className="text-[10px] text-slate-500 block mt-1 font-mono">Rentang Nyaman: 24–28°C</span>
      </div>

      {/* 5. Kelembapan */}
      <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-lg backdrop-blur-md transition-all duration-300 group">
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
            <Droplets className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full font-mono">
            RH
          </span>
        </div>
        <span className="text-xs text-slate-400 font-medium block">Kelembapan</span>
        <div className="flex items-baseline gap-1 my-1">
          <span className="text-2xl font-bold font-mono text-slate-100">{Math.round(reading.rh)}</span>
          <span className="text-xs text-slate-400 font-mono">%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-400 transition-all duration-500"
            style={{ width: `${Math.min(100, reading.rh)}%` }}
          />
        </div>
        <span className="text-[10px] text-slate-500 block mt-1 font-mono">Kelembapan Udara Tropis</span>
      </div>

      {/* 6. Waktu & Lokasi */}
      <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-lg backdrop-blur-md transition-all duration-300 group">
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
            <MapPin className="w-3 h-3" />
            {selectedLoc}
          </span>
        </div>
        <span className="text-xs text-slate-400 font-medium block">Waktu Operasional</span>
        <div className="flex items-baseline gap-1 my-1">
          <span className="text-2xl font-bold font-mono text-slate-100">{formattedTime}</span>
          <span className="text-xs text-slate-400 font-mono">WITA</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
          <div className="h-full rounded-full bg-teal-400 w-full animate-pulse" />
        </div>
        <span className="text-[10px] text-slate-500 block mt-1 font-mono">SMAN 1 Balikpapan</span>
      </div>
    </div>
  );
};
