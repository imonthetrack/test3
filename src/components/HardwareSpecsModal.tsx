import React from 'react';
import { X, Cpu, Zap, Activity, BookOpen, Layers, CheckCircle } from 'lucide-react';

interface HardwareSpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HardwareSpecsModal: React.FC<HardwareSpecsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-teal-500/30 rounded-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto shadow-2xl relative text-slate-100">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-sans">
                Arsitektur Sirkuit & Algoritma Edge AI
              </h3>
              <p className="text-xs text-slate-400 font-mono">Skematik Pinout ESP32 & Rumus Prediksi 30 Menit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs text-slate-300">
          {/* Section 1: Pinout Table */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-teal-400" />
              <h4 className="font-bold text-sm text-slate-100">Tabel Pinout Mikrokontroler ESP32</h4>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left font-mono text-[11px]">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Komponen Periferal</th>
                    <th className="py-2.5 px-3">Pin ESP32</th>
                    <th className="py-2.5 px-3">Protokol Komunikasi</th>
                    <th className="py-2.5 px-3">Tegangan (V)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                  <tr>
                    <td className="py-2 px-3 font-semibold text-white font-sans">LCD 16×2 Display</td>
                    <td className="py-2 px-3 text-teal-300">GPIO 21 (SDA), GPIO 22 (SCL)</td>
                    <td className="py-2 px-3 text-slate-400">I²C Bus (Addr: 0x27)</td>
                    <td className="py-2 px-3 text-slate-400">5.0V DC</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-white font-sans">Sensor Debu PM2.5/PM10</td>
                    <td className="py-2 px-3 text-teal-300">GPIO 16 (RX2), GPIO 17 (TX2)</td>
                    <td className="py-2 px-3 text-slate-400">UART Serial (9600 bps)</td>
                    <td className="py-2 px-3 text-slate-400">5.0V DC</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-white font-sans">Sensor CO₂ NDIR Optical</td>
                    <td className="py-2 px-3 text-teal-300">GPIO 4 (RX1), GPIO 2 (TX1)</td>
                    <td className="py-2 px-3 text-slate-400">UART / PWM DAC</td>
                    <td className="py-2 px-3 text-slate-400">5.0V DC</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-white font-sans">Sensor Suhu & RH (DHT22)</td>
                    <td className="py-2 px-3 text-teal-300">GPIO 32</td>
                    <td className="py-2 px-3 text-slate-400">One-Wire Digital (Pullup 10k)</td>
                    <td className="py-2 px-3 text-slate-400">3.3V DC</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-white font-sans">Relay Kanal 1 (Kipas)</td>
                    <td className="py-2 px-3 text-amber-300">GPIO 18</td>
                    <td className="py-2 px-3 text-slate-400">Digital Output (Active LOW)</td>
                    <td className="py-2 px-3 text-slate-400">5.0V DC</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-white font-sans">Relay Kanal 2 (Filtrasi)</td>
                    <td className="py-2 px-3 text-amber-300">GPIO 19</td>
                    <td className="py-2 px-3 text-slate-400">Digital Output (Active LOW)</td>
                    <td className="py-2 px-3 text-slate-400">5.0V DC</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-white font-sans">Buzzer Peringatan Akustik</td>
                    <td className="py-2 px-3 text-cyan-300">GPIO 23</td>
                    <td className="py-2 px-3 text-slate-400">PWM LEDC Tone (880Hz / 1400Hz)</td>
                    <td className="py-2 px-3 text-slate-400">3.3V DC</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-white font-sans">LED Hijau / Kuning / Merah</td>
                    <td className="py-2 px-3 text-cyan-300">GPIO 25, GPIO 26, GPIO 27</td>
                    <td className="py-2 px-3 text-slate-400">Digital GPIO (Resistor 220Ω)</td>
                    <td className="py-2 px-3 text-slate-400">3.3V DC</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Mathematical Formulation */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h4 className="font-bold text-sm text-slate-100 font-sans">
                Formulasi Matematika Regresi Linier Edge AI (30 Menit Horizon)
              </h4>
            </div>
            <p className="leading-relaxed text-slate-300">
              Alat tidak membutuhkan server cloud berat untuk memprediksi kualitas udara. ESP32 secara otonom
              mengevaluasi jendela data $N$ titik terakhir ($N \le 8$ titik dengan jeda sampling 5 menit):
            </p>

            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg font-mono text-[11px] space-y-1.5 text-teal-300">
              <div>
                <span className="text-slate-400">1. Nilai Rerata Waktu & Polutan:</span>
                <br />
                <code>x̄ = (N - 1) / 2</code> | <code>ȳ = (∑ yᵢ) / N</code>
              </div>
              <div>
                <span className="text-slate-400">2. Kovarian & Varians Kemiringan (Slope / Laju Perubahan):</span>
                <br />
                <code>Cov(x, y) = ∑ (xᵢ - x̄)(yᵢ - ȳ)</code>
                <br />
                <code>Var(x) = ∑ (xᵢ - x̄)²</code>
                <br />
                <code>m = Cov(x, y) / Var(x)</code>
              </div>
              <div>
                <span className="text-slate-400">3. Ekstrapolasi 30 Menit ke Depan (k = 6 langkah @ 5 menit):</span>
                <br />
                <code className="text-yellow-300 font-bold">
                  y_prediksi(t + 30) = y_terakhir + (m × 6)
                </code>
              </div>
            </div>

            <p className="leading-relaxed text-slate-400 text-[11px]">
              Dengan metode kuadrat terkecil (Ordinary Least Squares), beban CPU ESP32 hanya memakan kurang dari 1.2%
              siklus komputasi per sampling, namun memberikan keunggulan krusial: sekolah bertindak <b>30 menit lebih awal</b>{' '}
              sebelum polusi mencapai kadar berbahaya bagi siswa.
            </p>
          </div>

          {/* Section 3: Closed-Loop Automation Logic */}
          <div className="bg-teal-950/20 border border-teal-500/20 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
              <Layers className="w-4 h-4" />
              Logika Otomatisasi Terpadu (Closed-Loop)
            </div>
            <ul className="space-y-1.5 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <b>Kipas Ventilasi ON</b> bila prediksi CO₂ &gt; 800 ppm atau pembacaan aktual &gt; 800 ppm.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <b>Filtrasi Udara HEPA ON</b> bila prediksi PM2.5 &gt; 15.5 µg/m³ atau pembacaan aktual &gt; 15.5 µg/m³.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <b>Alarm Siren Buzzer & Telegram Bot Push</b> aktif otomatis saat status mencapai level 2 (Merah).
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Tutup Skematik
          </button>
        </div>
      </div>
    </div>
  );
};
