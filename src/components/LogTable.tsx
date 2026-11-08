import React, { useState, useMemo } from 'react';
import { TelemetryLogEntry, QualityLevel, LocationType } from '../types/siaga';
import { LEVEL_NAMES } from '../hooks/useSiagaSimulation';
import { Download, Search, Filter, Database, Calendar } from 'lucide-react';

interface LogTableProps {
  logs: TelemetryLogEntry[];
  currentLocation: LocationType;
}

export const LogTable: React.FC<LogTableProps> = ({ logs, currentLocation }) => {
  const [filterLoc, setFilterLoc] = useState<string>('current');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLogs = useMemo(() => {
    return logs.filter((entry) => {
      if (filterLoc === 'current' && entry.location !== currentLocation) return false;
      if (filterLoc !== 'all' && filterLoc !== 'current' && entry.location !== filterLoc) return false;
      if (filterLevel !== 'all' && String(entry.level) !== filterLevel) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          entry.time.toLowerCase().includes(q) ||
          entry.location.toLowerCase().includes(q) ||
          LEVEL_NAMES[entry.level].toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [logs, currentLocation, filterLoc, filterLevel, searchQuery]);

  // Export logs to CSV
  const exportCsv = () => {
    const headers = ['Waktu', 'Lokasi', 'PM2.5 (ug/m3)', 'PM10 (ug/m3)', 'CO2 (ppm)', 'Suhu (C)', 'RH (%)', 'Status'];
    const rows = filteredLogs.map((log) => [
      log.time,
      log.location,
      log.pm,
      log.pm10,
      log.co2,
      log.t,
      log.rh,
      LEVEL_NAMES[log.level],
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `siaga_udara_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md mb-10">
      {/* Table Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-100 font-sans">
              Dataset Sekolah (Log Telemetri ESP32)
            </h3>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              {filteredLogs.length} Entri Tercatat
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Riwayat log data sensor aktual yang dikirimkan node ESP32 setiap 5 menit
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Location filter */}
          <select
            value={filterLoc}
            onChange={(e) => setFilterLoc(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-teal-400"
          >
            <option value="current">Lokasi Terpilih ({currentLocation})</option>
            <option value="all">Semua Lokasi</option>
            <option value="Lapangan">Lapangan</option>
            <option value="Kelas">Kelas</option>
          </select>

          {/* Status filter */}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-teal-400"
          >
            <option value="all">Semua Status</option>
            <option value="0">🟢 Baik</option>
            <option value="1">🟡 Sedang</option>
            <option value="2">🔴 Tidak Sehat</option>
          </select>

          {/* Export CSV button */}
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Ekspor CSV
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-slate-950/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-3.5">Waktu</th>
              <th className="py-3 px-3.5">Lokasi</th>
              <th className="py-3 px-3.5">PM2.5 (µg/m³)</th>
              <th className="py-3 px-3.5">PM10 (µg/m³)</th>
              <th className="py-3 px-3.5">CO₂ (ppm)</th>
              <th className="py-3 px-3.5">Suhu (°C)</th>
              <th className="py-3 px-3.5">RH (%)</th>
              <th className="py-3 px-3.5">Status Udara</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                  Belum ada rekaman log untuk filter yang dipilih.
                </td>
              </tr>
            ) : (
              filteredLogs.slice(0, 15).map((log) => {
                const pmLv: QualityLevel = log.pm <= 15.5 ? 0 : log.pm <= 55.4 ? 1 : 2;
                const co2Lv: QualityLevel = log.co2 <= 800 ? 0 : log.co2 <= 1500 ? 1 : 2;

                return (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3.5 font-bold text-slate-200">{log.time}</td>
                    <td className="py-2.5 px-3.5 font-sans font-medium text-slate-300">
                      {log.location}
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          pmLv === 0
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : pmLv === 1
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {log.pm}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-400">{log.pm10}</td>
                    <td className="py-2.5 px-3.5">
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          co2Lv === 0
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : co2Lv === 1
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {log.co2}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-300">{log.t}</td>
                    <td className="py-2.5 px-3.5 text-slate-300">{log.rh}%</td>
                    <td className="py-2.5 px-3.5 font-sans">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          log.level === 0
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : log.level === 1
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            log.level === 0
                              ? 'bg-emerald-400'
                              : log.level === 1
                              ? 'bg-amber-400'
                              : 'bg-rose-400 animate-pulse'
                          }`}
                        />
                        {LEVEL_NAMES[log.level]}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 font-mono">
        <span>Menampilkan {Math.min(15, filteredLogs.length)} log terbaru</span>
        <span>Format CSV kompatibel dengan Microsoft Excel / Google Sheets</span>
      </div>
    </div>
  );
};
