import React from 'react';
import { X, Send, ShieldAlert, CheckCircle, Clock, MapPin, AlertTriangle, ExternalLink } from 'lucide-react';
import { QualityLevel } from '../types/siaga';

interface TelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: string;
  formattedTime: string;
  pm: number;
  co2: number;
  predPm: number;
  predCo2: number;
  level: QualityLevel;
  primaryTrigger: string;
}

export const TelegramModal: React.FC<TelegramModalProps> = ({
  isOpen,
  onClose,
  location,
  formattedTime,
  pm,
  co2,
  predPm,
  predCo2,
  level,
  primaryTrigger,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-teal-500/30 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative text-slate-100 animate-scaleUp">
        {/* Telegram Header */}
        <div className="bg-[#17212b] px-5 py-4 border-b border-[#0e1621] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
              <Send className="w-5 h-5 -rotate-12 translate-x-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white">SIAGA-UDARA Bot SMAN 1</h3>
                <CheckCircle className="w-4 h-4 text-sky-400 fill-sky-400/20" />
              </div>
              <p className="text-xs text-sky-300 font-mono">@SiagaUdara_SMAN1Bot · bot</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telegram Chat Area */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto bg-[#0e1621]/90 font-sans">
          <div className="text-center">
            <span className="text-[11px] bg-slate-800/80 text-slate-400 px-3 py-1 rounded-full font-mono">
              Hari ini, {formattedTime} WITA
            </span>
          </div>

          {/* Message Bubble */}
          <div className="bg-[#182533] border border-sky-900/50 rounded-2xl rounded-tl-sm p-4 text-xs shadow-lg space-y-3">
            {/* Alert Banner inside Telegram */}
            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                level === 2
                  ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                  : level === 1
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                  : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
              }`}
            >
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <b className="text-xs uppercase tracking-wide block">
                  {level === 2
                    ? '🔴 PERINGATAN KUALITAS UDARA TIDAK SEHAT'
                    : level === 1
                    ? '🟡 PERINGATAN KUALITAS UDARA SEDANG / WASPADA'
                    : '🟢 LAPORAN KUALITAS UDARA NORMAL & AMAN'}
                </b>
                <span className="text-[11px] opacity-90 block mt-0.5">
                  Dipicu oleh kenaikan {primaryTrigger} di lingkungan sekolah.
                </span>
              </div>
            </div>

            {/* Telemetry Summary */}
            <div className="bg-[#101923] p-3 rounded-xl space-y-1.5 font-mono text-[11px] text-slate-300 border border-slate-800">
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">🏫 Lokasi:</span>
                <b className="text-white">{location} SMAN 1 Balikpapan</b>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">🕒 Waktu Deteksi:</span>
                <span className="text-sky-300">{formattedTime} WITA</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">🌫️ PM2.5 Saat Ini:</span>
                <b className={pm > 55.4 ? 'text-rose-400' : pm > 15.5 ? 'text-amber-400' : 'text-emerald-400'}>
                  {Math.round(pm)} µg/m³
                </b>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">🫁 CO₂ Saat Ini:</span>
                <b className={co2 > 1500 ? 'text-rose-400' : co2 > 800 ? 'text-amber-400' : 'text-emerald-400'}>
                  {Math.round(co2)} ppm
                </b>
              </div>
              <div className="flex justify-between pt-0.5 text-teal-300 font-bold">
                <span>🤖 AI Forecast (+30 mnt):</span>
                <span>
                  PM ≈ {Math.round(predPm)} | CO₂ ≈ {Math.round(predCo2)}
                </span>
              </div>
            </div>

            {/* Automated Actions Activated */}
            <div className="space-y-1 text-slate-300 text-[11px]">
              <b className="text-teal-400 block font-sans">⚡ Aktuator IoT yang Telah Diaktifkan:</b>
              <ul className="list-disc list-inside space-y-0.5 pl-1 text-slate-300">
                <li>Kipas Ventilasi Ruangan (Relay IN1): {co2 > 800 || predCo2 > 800 ? 'Menyala (ON)' : 'Siaga'}</li>
                <li>Unit Filtrasi Udara HEPA (Relay IN2): {pm > 15.5 || predPm > 15.5 ? 'Menyala (ON)' : 'Siaga'}</li>
                <li>LCD & LED Indikator Hardware: Merah Berkedip / Waspada</li>
                <li>Buzzer Peringatan Akustik: Aktif</li>
              </ul>
            </div>

            {/* SOP Protokol Sekolah */}
            <div className="bg-slate-900/90 border border-teal-500/20 p-3 rounded-xl text-[11px] text-slate-300 space-y-1">
              <b className="text-amber-400 block font-sans">📋 Instruksi Tindakan Guru Piket & Sekolah:</b>
              <ol className="list-decimal list-inside space-y-1 text-slate-300">
                <li>Bila di Lapangan: Hentikan kegiatan olahraga luar ruangan dan arahkan siswa masuk ke kelas.</li>
                <li>Bila di Ruang Kelas: Pastikan pintu dan jendela tertutup jika PM tinggi, atau buka ventilasi silang jika CO₂ tinggi.</li>
                <li>Bagikan masker medis/N95 kepada siswa atau guru dengan riwayat asma/alergi debu.</li>
                <li>Laporkan kepada Kepala Sekolah dan Tim Tanggap Darurat Sekolah.</li>
              </ol>
            </div>

            <div className="text-right text-[10px] text-slate-500 font-mono">
              Terkirim via ESP32 Wi-Fi HTTP Gateway · {formattedTime}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#17212b] px-5 py-3 border-t border-[#0e1621] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Tutup Pratinjau
          </button>
        </div>
      </div>
    </div>
  );
};
