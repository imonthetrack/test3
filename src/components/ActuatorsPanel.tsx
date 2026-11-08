import React from 'react';
import { QualityLevel } from '../types/siaga';
import { Fan, Sparkles, Monitor, Volume2, Bell, CheckCircle2, AlertTriangle, AlertCircle, ArrowUpRight } from 'lucide-react';

interface ActuatorsPanelProps {
  isFanActive: boolean;
  isFilterActive: boolean;
  level: QualityLevel;
  primaryTrigger: 'PM2.5' | 'CO₂';
  onOpenTelegram: () => void;
  onOpenHardwareSpecs: () => void;
}

export const ActuatorsPanel: React.FC<ActuatorsPanelProps> = ({
  isFanActive,
  isFilterActive,
  level,
  primaryTrigger,
  onOpenTelegram,
  onOpenHardwareSpecs,
}) => {
  const lcdLedStatus = level === 0 ? 'NORMAL' : level === 1 ? 'WASPADA' : 'PERINGATAN';
  const lcdLedDesc =
    level === 0
      ? 'LCD: Udara BAIK, LED hijau menyala tenang'
      : level === 1
      ? 'LCD: Kuning WASPADA, LED kuning menyala'
      : 'LCD: Merah Berkedip, LED merah berkedip cepat!';

  const buzzerStatus = level === 0 ? 'SIAGA' : level === 1 ? 'BIP' : 'ALARM';
  const buzzerDesc =
    level === 0
      ? 'Senyap, frekuensi siaga udara aman'
      : level === 1
      ? 'Bip pendek ganda 880Hz berkala (tiap 6 dtk)'
      : 'Sirene dual-tone 1400Hz/900Hz darurat!';

  const telegramStatus = level === 2 ? 'TERKIRIM' : 'SIAGA';
  const telegramDesc =
    level === 2
      ? `Push alert dikirim ke Telegram Guru Piket (@SiagaUdara_SMAN1Bot)!`
      : 'Belum ada bahaya merah, bot Telegram siaga';

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-100 font-sans">
              Respons Otomatis Sekolah & Aktuator IoT
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Closed-Loop Automation
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Sistem bereaksi otomatis saat AI mendeteksi lonjakan polutan 30 menit ke depan
          </p>
        </div>

        <button
          onClick={onOpenHardwareSpecs}
          className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1 self-start sm:self-auto hover:underline"
        >
          Lihat Skema Rangkaian Relay & Pinout <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* 1. Kipas Ventilasi */}
        <div
          className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
            isFanActive
              ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-950/30'
              : 'bg-slate-950/60 border-slate-800'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  isFanActive
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Fan className={`w-5 h-5 ${isFanActive ? 'animate-spin' : ''}`} style={{ animationDuration: '2s' }} />
              </div>
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  isFanActive
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isFanActive ? 'ON' : 'OFF'}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-100">Kipas Ventilasi</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {isFanActive
                ? 'Sirkulasi udara aktif menurunkan CO₂ ruangan.'
                : 'CO₂ terkendali (< 800 ppm), kipas dalam mode siaga.'}
            </p>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-3 block pt-2 border-t border-slate-800/80">
            Relay Kanal 1 (GPIO 18)
          </span>
        </div>

        {/* 2. Filtrasi Udara HEPA */}
        <div
          className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
            isFilterActive
              ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-950/30'
              : 'bg-slate-950/60 border-slate-800'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  isFilterActive
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Sparkles className="w-5 h-5" />
              </div>
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  isFilterActive
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isFilterActive ? 'ON' : 'OFF'}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-100">Filtrasi Udara HEPA</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {isFilterActive
                ? 'Menyaring partikel debu halus PM2.5/PM10.'
                : 'Partikel rendah (< 15.5 µg/m³), filtrasi siaga.'}
            </p>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-3 block pt-2 border-t border-slate-800/80">
            Relay Kanal 2 (GPIO 19)
          </span>
        </div>

        {/* 3. LCD & LED Alat */}
        <div
          className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
            level === 2
              ? 'bg-rose-950/20 border-rose-500/40'
              : level === 1
              ? 'bg-amber-950/20 border-amber-500/40'
              : 'bg-slate-950/60 border-slate-800'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  level === 2
                    ? 'bg-rose-500/20 text-rose-400'
                    : level === 1
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                <Monitor className="w-5 h-5" />
              </div>
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  level === 2
                    ? 'bg-rose-500 text-slate-950'
                    : level === 1
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {lcdLedStatus}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-100">LCD & LED Alat</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{lcdLedDesc}</p>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-3 block pt-2 border-t border-slate-800/80">
            I²C (0x27) & GPIO 25/26/27
          </span>
        </div>

        {/* 4. Buzzer Alarm */}
        <div
          className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
            level === 2
              ? 'bg-rose-950/20 border-rose-500/40 animate-pulse'
              : level === 1
              ? 'bg-amber-950/20 border-amber-500/40'
              : 'bg-slate-950/60 border-slate-800'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  level === 2
                    ? 'bg-rose-500/20 text-rose-400'
                    : level === 1
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Volume2 className="w-5 h-5" />
              </div>
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  level === 2
                    ? 'bg-rose-500 text-slate-950'
                    : level === 1
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {buzzerStatus}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-100">Buzzer Alarm</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{buzzerDesc}</p>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-3 block pt-2 border-t border-slate-800/80">
            Piezo PWM (GPIO 23)
          </span>
        </div>

        {/* 5. Notifikasi Guru Piket (Interactive Telegram Trigger) */}
        <div
          onClick={onOpenTelegram}
          className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:scale-[1.02] ${
            level === 2
              ? 'bg-rose-950/30 border-rose-500/60 shadow-lg shadow-rose-950/40'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
          }`}
          role="button"
          tabIndex={0}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  level === 2
                    ? 'bg-rose-500 text-slate-950 shadow-md'
                    : 'bg-blue-500/20 text-blue-400'
                }`}
              >
                <Bell className={`w-5 h-5 ${level === 2 ? 'animate-bounce' : ''}`} />
              </div>
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  level === 2
                    ? 'bg-rose-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {telegramStatus}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1 group-hover:text-teal-300 transition-colors">
              Notifikasi Guru Piket <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{telegramDesc}</p>
          </div>
          <span className="text-[10px] text-cyan-400 font-mono mt-3 block pt-2 border-t border-slate-800/80 group-hover:underline">
            Klik untuk buka preview Telegram Bot
          </span>
        </div>
      </div>
    </div>
  );
};
