/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSiagaSimulation, ADVISORY_MESSAGES, LEVEL_NAMES } from './hooks/useSiagaSimulation';
import { DeviceDiagram } from './components/DeviceDiagram';
import { ComponentInspector } from './components/ComponentInspector';
import { PredictiveChart } from './components/PredictiveChart';
import { TelemetryCards } from './components/TelemetryCards';
import { ActuatorsPanel } from './components/ActuatorsPanel';
import { LogTable } from './components/LogTable';
import { TelegramModal } from './components/TelegramModal';
import { HardwareSpecsModal } from './components/HardwareSpecsModal';
import { ManualControlDrawer } from './components/ManualControlDrawer';
import { LocationType, ScenarioType, ThemeType } from './types/siaga';
import {
  Volume2,
  VolumeX,
  Sliders,
  Cpu,
  Layers,
  MapPin,
  Flame,
  Users,
  SunMedium,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  Palette,
  ExternalLink,
  ShieldCheck,
  Radio,
} from 'lucide-react';

export default function App() {
  const {
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
    formattedTime,
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
  } = useSiagaSimulation();

  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [isTelegramOpen, setIsTelegramOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [isManualDrawerOpen, setIsManualDrawerOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeType>('teal');

  // Advisory message
  const [advisoryTitle, advisoryBody] = ADVISORY_MESSAGES[overallLevel];

  // Theme container classes
  const themeClasses = {
    teal: 'bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-white',
    navy: 'bg-[#090d16] text-slate-100 selection:bg-indigo-500 selection:text-white',
    light: 'bg-slate-50 text-slate-900 selection:bg-teal-600 selection:text-white',
  }[theme];

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${themeClasses}`}>
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Brand & School Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-500/20 shrink-0">
              <ShieldCheck className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-white font-sans">
                  SIAGA-UDARA AI
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ESP32 Online
                </span>
              </div>
              <p className="text-xs text-slate-400">
                SMAN 1 Balikpapan · Sekolah Model PM & KKA
              </p>
            </div>
          </div>

          {/* Quick Actions & Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Clock */}
            <div className="flex items-center gap-1.5 text-xs font-mono bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
              <span className="text-slate-500">WITA:</span>
              <span className="font-bold text-teal-300">{formattedTime}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all duration-200 ${
                isSoundOn
                  ? 'bg-teal-500/10 border-teal-500/30 text-teal-300 hover:bg-teal-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
              title="Aktifkan/nonaktifkan audio alarm buzzer"
            >
              {isSoundOn ? (
                <>
                  <Volume2 className="w-4 h-4 text-teal-400" />
                  <span>Bunyi ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span>Bunyi OFF</span>
                </>
              )}
            </button>

            {/* Manual Slider Trigger */}
            <button
              onClick={() => setIsManualDrawerOpen(true)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all duration-200 ${
                isManualMode
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Simulator Manual</span>
              {isManualMode && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
            </button>

            {/* Hardware Specs Modal Trigger */}
            <button
              onClick={() => setIsSpecsOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Skema ESP32</span>
            </button>

            {/* Theme Selector */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setTheme('teal')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  theme === 'teal' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Tema Dark Teal (Default)"
              >
                Teal
              </button>
              <button
                onClick={() => setTheme('navy')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  theme === 'navy' ? 'bg-indigo-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Tema Obsidian Navy"
              >
                Navy
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  theme === 'light' ? 'bg-slate-200 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Tema Light Lab"
              >
                Light
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* ================= HERO SHOWCASE SECTION ================= */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90 p-6 md:p-8 lg:p-10 shadow-2xl backdrop-blur-xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Editorial Headline & Copy */}
            <div className="lg:col-span-6 space-y-5">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full">
                <span className="w-4 h-px bg-teal-400" />
                TENTANG ALAT
              </div>

              {/* Master Headline (Matches Exact Screenshot Style) */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-100 leading-[1.18] tracking-tight">
                Penjaga napas sekolah yang melihat{' '}
                <span className="italic font-normal bg-gradient-to-r from-teal-300 via-cyan-200 to-sky-300 bg-clip-text text-transparent">
                  30 menit ke depan.
                </span>
              </h1>

              {/* Description Paragraph */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                <strong className="text-teal-300 font-semibold">SIAGA-UDARA AI</strong> adalah alat pemantau kualitas
                udara cerdas untuk lingkungan sekolah. Ia tidak hanya membaca kondisi udara saat ini, tetapi juga
                mempelajari tren dan membuat prediksi ke depan, sehingga sekolah dapat bertindak lebih dulu sebelum
                udara menjadi tidak sehat bagi siswa dan guru.
              </p>

              {/* Live Status Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-wrap items-center justify-between gap-3 max-w-xl">
                <div>
                  <span className="text-xs text-slate-400 block font-mono">Status Aktif Saat Ini:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-sm font-bold font-sans ${
                        overallLevel === 0
                          ? 'text-emerald-400'
                          : overallLevel === 1
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {overallLevel === 0 ? '🟢 Baik' : overallLevel === 1 ? '🟡 Waspada' : '🔴 Bahaya / Tidak Sehat'}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      (Dipicu {primaryTrigger})
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-mono">Prediksi 30 Mnt:</span>
                  <span className="text-xs font-mono font-bold text-teal-300">
                    PM ≈ {Math.round(predictedPm)} µg/m³ · CO₂ ≈ {Math.round(predictedCo2)} ppm
                  </span>
                </div>
              </div>

              {/* 4 Pillars of SIAGA-UDARA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-teal-500/30 transition-all duration-200">
                  <span className="font-serif italic text-teal-400 font-bold text-base block mb-0.5">01</span>
                  <b className="text-xs text-white block mb-1">Mendeteksi</b>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    PM2.5, PM10, CO₂, suhu, dan kelembapan di lapangan maupun ruang kelas secara real-time.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-teal-500/30 transition-all duration-200">
                  <span className="font-serif italic text-teal-400 font-bold text-base block mb-0.5">02</span>
                  <b className="text-xs text-white block mb-1">Memprediksi</b>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Kecerdasan artifisial membaca tren data dan memperkirakan kondisi 30 menit ke depan.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-teal-500/30 transition-all duration-200">
                  <span className="font-serif italic text-teal-400 font-bold text-base block mb-0.5">03</span>
                  <b className="text-xs text-white block mb-1">Bertindak</b>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Kipas ventilasi dan filtrasi menyala otomatis, LCD dan buzzer pada alat memberi peringatan, guru piket menerima notifikasi.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-teal-500/30 transition-all duration-200">
                  <span className="font-serif italic text-teal-400 font-bold text-base block mb-0.5">04</span>
                  <b className="text-xs text-white block mb-1">Terhubung</b>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Dirancang untuk mikrokontroler ESP32 yang mengirim data sensor lewat Wi-Fi ke dashboard dan Telegram.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Exact Vector Hardware Circuit Diagram */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-2 px-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-mono">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  Rangkaian Hardware Interaktif
                </span>
                <span className="text-[11px] text-slate-500">
                  Klik komponen untuk melihat pinout & spesifikasi
                </span>
              </div>

              {/* The SVG Diagram Matching the Screenshot Exactly */}
              <div className="w-full rounded-2xl bg-slate-950/90 border border-slate-800/90 p-4 shadow-2xl relative overflow-hidden group">
                <DeviceDiagram
                  deviceState={deviceState}
                  isBuzzerRinging={isBuzzerRinging}
                  selectedComponent={selectedComponent}
                  onSelectComponent={(id) => setSelectedComponent(id)}
                />
              </div>

              {/* Component Inspector Card (opens below diagram when a component is clicked) */}
              {selectedComponent && (
                <div className="w-full mt-4 animate-fadeIn">
                  <ComponentInspector
                    selectedComponent={selectedComponent}
                    onClose={() => setSelectedComponent(null)}
                    onSelectComponent={(id) => setSelectedComponent(id)}
                    currentPm={Math.round(activeReading.pm)}
                    currentCo2={Math.round(activeReading.co2)}
                    currentTemp={activeReading.t}
                    currentRh={activeReading.rh}
                    isFanActive={isFanActive}
                    isFilterActive={isFilterActive}
                    level={overallLevel}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ================= CONTROLS: LOKASI & SKENARIO ================= */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Lokasi Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-400" /> Lokasi:
              </span>
              <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800">
                {(['Lapangan', 'Kelas'] as LocationType[]).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setSelectedLoc(loc)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                      selectedLoc === loc
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md shadow-teal-500/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {loc === 'Lapangan' ? '🏟️ Lapangan (Outdoor)' : '🏫 Ruang Kelas (Indoor)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Skenario Simulasi Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider shrink-0">
                Skenario:
              </span>
              <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800">
                {(['Normal', 'Kabut asap', 'Kelas penuh'] as ScenarioType[]).map((sc) => (
                  <button
                    key={sc}
                    onClick={() => {
                      setSelectedScenario(sc);
                      setIsManualMode(false);
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                      selectedScenario === sc && !isManualMode
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md shadow-teal-500/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sc === 'Normal' && '🌱 Normal'}
                    {sc === 'Kabut asap' && '🌫️ Kabut Asap (PM2.5)'}
                    {sc === 'Kelas penuh' && '👥 Kelas Penuh (CO₂)'}
                  </button>
                ))}
              </div>

              {/* Sound Button */}
              <button
                onClick={toggleSound}
                className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              >
                {isSoundOn ? '🔊 Alarm Aktif' : '🔇 Alarm Mati'}
              </button>
            </div>
          </div>
        </section>

        {/* ================= DYNAMIC STATUS ADVISORY BANNER (#band) ================= */}
        <section
          id="band"
          className={`p-6 rounded-2xl border transition-all duration-300 shadow-xl ${
            overallLevel === 0
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
              : overallLevel === 1
              ? 'bg-amber-950/30 border-amber-500/40 text-amber-100'
              : 'bg-rose-950/40 border-rose-500/50 text-rose-100 animate-pulse-subtle'
          }`}
          role="region"
          aria-live="polite"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-2xl">
                  {overallLevel === 0 ? '🟢' : overallLevel === 1 ? '🟡' : '🔴'}
                </span>
                <h2 className="text-xl font-bold font-serif tracking-tight text-white">
                  {advisoryTitle}
                </h2>
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    overallLevel === 0
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : overallLevel === 1
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {LEVEL_NAMES[overallLevel]}
                </span>
              </div>
              <p className="text-sm opacity-90 max-w-3xl leading-relaxed">{advisoryBody}</p>
            </div>

            {/* Quick Metrics Tag */}
            <div className="bg-black/30 border border-white/10 px-4 py-3 rounded-xl shrink-0 font-mono text-xs space-y-1">
              <div>
                <span className="opacity-70">Sekarang: </span>
                <b className="text-white">
                  {LEVEL_NAMES[currentClassification.lv]}
                </b>{' '}
                <span className="text-[11px] opacity-75">(dipicu {currentClassification.src})</span>
              </div>
              <div>
                <span className="opacity-70">Prediksi 30 Mnt: </span>
                <b className="text-teal-300">
                  {LEVEL_NAMES[predictedClassification.lv]}
                </b>
                <span className="text-[11px] opacity-75 block">
                  PM2.5 ≈ {Math.round(predictedPm)} µg/m³ · CO₂ ≈ {Math.round(predictedCo2)} ppm
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TELEMETRY SENSOR CARDS (#vals) ================= */}
        <section>
          <TelemetryCards
            reading={activeReading}
            selectedLoc={selectedLoc}
            formattedTime={formattedTime}
            level={overallLevel}
          />
        </section>

        {/* ================= 30-MINUTE AI PREDICTIVE CHARTS (#c1, #c2) ================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-100 font-sans">
                Grafik Data & Prediksi AI 30 Menit ke Depan
              </h2>
              <p className="text-xs text-slate-400">
                Membandingkan telemetri aktual per 5 menit dengan proyeksi tren kuadrat terkecil
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
              Lokasi Aktif: <b className="text-teal-300">{selectedLoc}</b>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <PredictiveChart
              title="PM2.5 (µg/m³): Data Aktual & Prediksi 30 Menit"
              metricKey="pm"
              unit="µg/m³"
              history={activeReading.h.map((h) => h.pm)}
              thresholds={[15.5, 55.4]}
              thresholdLabels={['Sedang', 'Tidak Sehat']}
            />

            <PredictiveChart
              title="CO₂ (ppm): Data Aktual & Prediksi 30 Menit"
              metricKey="co2"
              unit="ppm"
              history={activeReading.h.map((h) => h.co2)}
              thresholds={[800, 1500]}
              thresholdLabels={['Batas Standar', 'Udara Jenuh']}
            />
          </div>
        </section>

        {/* ================= SCHOOL AUTOMATIC ACTUATORS (#act) ================= */}
        <section>
          <ActuatorsPanel
            isFanActive={isFanActive}
            isFilterActive={isFilterActive}
            level={overallLevel}
            primaryTrigger={primaryTrigger}
            onOpenTelegram={() => setIsTelegramOpen(true)}
            onOpenHardwareSpecs={() => setIsSpecsOpen(true)}
          />
        </section>

        {/* ================= SCHOOL DATASET LOG TABLE (#tb) ================= */}
        <section>
          <LogTable logs={logs} currentLocation={selectedLoc} />
        </section>

        {/* Footer */}
        <footer className="pt-8 pb-12 border-t border-slate-800/80 text-center text-xs text-slate-400 space-y-2">
          <p className="font-semibold text-slate-300 font-sans tracking-wide">
            SMAN 1 BALIKPAPAN — SEKOLAH MODEL PM & KKA
          </p>
          <p className="font-mono text-[11px] text-slate-500">
            Sistem Pemantauan Kualitas Udara Cerdas Berbasis ESP32 IoT & Model Regresi Linier Edge AI
          </p>
          <div className="flex items-center justify-center gap-4 pt-2 text-[11px] text-teal-400/80">
            <button onClick={() => setIsSpecsOpen(true)} className="hover:underline">
              Dokumentasi Skematik
            </button>
            <span>•</span>
            <button onClick={() => setIsTelegramOpen(true)} className="hover:underline">
              Notifikasi Bot Telegram
            </button>
            <span>•</span>
            <button onClick={() => setIsManualDrawerOpen(true)} className="hover:underline">
              Simulator Manual
            </button>
          </div>
        </footer>
      </main>

      {/* Modals & Drawers */}
      <TelegramModal
        isOpen={isTelegramOpen}
        onClose={() => setIsTelegramOpen(false)}
        location={selectedLoc}
        formattedTime={formattedTime}
        pm={activeReading.pm}
        co2={activeReading.co2}
        predPm={predictedPm}
        predCo2={predictedCo2}
        level={overallLevel}
        primaryTrigger={primaryTrigger}
      />

      <HardwareSpecsModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
      />

      <ManualControlDrawer
        isOpen={isManualDrawerOpen}
        onClose={() => setIsManualDrawerOpen(false)}
        isManualMode={isManualMode}
        onToggleManual={() => setIsManualMode(!isManualMode)}
        manualPm={manualPm}
        setManualPm={setManualPm}
        manualCo2={manualCo2}
        setManualCo2={setManualCo2}
        selectedLoc={selectedLoc}
      />
    </div>
  );
}
