import React from 'react';
import { Sliders, RotateCcw, Zap, Info, X } from 'lucide-react';

interface ManualControlDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isManualMode: boolean;
  onToggleManual: () => void;
  manualPm: number;
  setManualPm: (val: number) => void;
  manualCo2: number;
  setManualCo2: (val: number) => void;
  selectedLoc: string;
}

export const ManualControlDrawer: React.FC<ManualControlDrawerProps> = ({
  isOpen,
  onClose,
  isManualMode,
  onToggleManual,
  manualPm,
  setManualPm,
  manualCo2,
  setManualCo2,
  selectedLoc,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-teal-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-sans">
                Simulator Manual Sensor (Injector Mode)
              </h3>
              <p className="text-xs text-slate-400">
                Uji langsung respons aktuator relay, kipas, filtrasi & LCD
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggle Manual Switch */}
        <div className="flex items-center justify-between bg-slate-950/80 border border-slate-800 p-4 rounded-xl mb-5">
          <div>
            <span className="font-bold text-sm text-slate-100 block">Aktifkan Kontrol Manual</span>
            <span className="text-xs text-slate-400">
              Menimpa nilai skenario otomatis pada lokasi: <b className="text-teal-300">{selectedLoc}</b>
            </span>
          </div>
          <button
            onClick={onToggleManual}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isManualMode ? 'bg-teal-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isManualMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Sliders */}
        <div className={`space-y-6 ${!isManualMode ? 'opacity-40 pointer-events-none' : ''}`}>
          {/* PM2.5 Slider */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                Partikel Debu PM2.5:
              </label>
              <span className="font-mono text-base font-bold text-teal-300">
                {manualPm} <span className="text-xs font-normal text-slate-400">µg/m³</span>
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="150"
              step="1"
              value={manualPm}
              onChange={(e) => setManualPm(Number(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>3 (Bersih)</span>
              <span className="text-amber-400">15.5 (Batas Aman WHO)</span>
              <span className="text-rose-400">55.4 (Tidak Sehat)</span>
              <span>150</span>
            </div>
            {manualPm > 15.5 && (
              <p className="text-[11px] text-teal-300 mt-2 font-mono flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Filtrasi Udara HEPA & Relay 2 akan AKTIF (Menyaring debu)
              </p>
            )}
          </div>

          {/* CO2 Slider */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                Karbon Dioksida CO₂:
              </label>
              <span className="font-mono text-base font-bold text-indigo-300">
                {manualCo2} <span className="text-xs font-normal text-slate-400">ppm</span>
              </span>
            </div>
            <input
              type="range"
              min="350"
              max="2200"
              step="25"
              value={manualCo2}
              onChange={(e) => setManualCo2(Number(e.target.value))}
              className="w-full accent-indigo-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>350 (Segar)</span>
              <span className="text-amber-400">800 (Batas Standar Ruang)</span>
              <span className="text-rose-400">1500 (Jenuh/Apek)</span>
              <span>2200</span>
            </div>
            {manualCo2 > 800 && (
              <p className="text-[11px] text-indigo-300 mt-2 font-mono flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Kipas Ventilasi & Relay 1 akan BERPUTAR (Sirkulasi udara)
              </p>
            )}
          </div>
        </div>

        {/* Footer info & reset */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              setManualPm(25);
              setManualCo2(450);
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Nilai Awal
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
