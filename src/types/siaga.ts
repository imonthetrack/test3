export type LocationType = 'Lapangan' | 'Kelas';
export type ScenarioType = 'Normal' | 'Kabut asap' | 'Kelas penuh';
export type QualityLevel = 0 | 1 | 2; // 0: Baik, 1: Sedang, 2: Tidak Sehat
export type ThemeType = 'teal' | 'navy' | 'light';

export interface SensorReading {
  pm: number;      // PM2.5 (ug/m3)
  pm10: number;    // PM10 (ug/m3)
  co2: number;     // CO2 (ppm)
  t: number;       // Suhu (deg C)
  rh: number;      // Kelembapan (%)
  h: { pm: number; co2: number }[]; // Riwayat 24 titik
}

export interface TelemetryLogEntry {
  id: string;
  time: string;
  location: LocationType;
  pm: number;
  pm10: number;
  co2: number;
  t: string;
  rh: number;
  level: QualityLevel;
}

export interface ClassificationResult {
  lv: QualityLevel;
  src: 'PM2.5' | 'CO₂';
}

export interface DeviceState {
  lv: QualityLevel;
  fan: boolean;
  fil: boolean;
  pm: number;
  co2: number;
  src: 'PM2.5' | 'CO₂';
  fr: number; // Frame counter for LCD animation
}

export interface HardwareComponentMeta {
  id: string;
  name: string;
  subtitle: string;
  pins: string;
  specs: string;
  role: string;
  status: string;
  statusType: 'ok' | 'warn' | 'bad' | 'info';
  icon: string;
}
