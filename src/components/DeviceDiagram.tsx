import React, { useEffect, useRef, useMemo } from 'react';
import { DeviceState } from '../types/siaga';
import { DEVICE_SVG_RAW } from '../data/deviceSvg';

interface DeviceDiagramProps {
  deviceState: DeviceState;
  isBuzzerRinging: boolean;
  selectedComponent: string | null;
  onSelectComponent: (id: string | null) => void;
}

const LABEL_MAP: Record<string, string> = {
  'LCD 16×2 I²C': 'lcd',
  'PM2.5 · PM10': 'pm',
  'Sensor CO₂ (NDIR)': 'co2',
  'ESP32 DevKit': 'esp32',
  'Suhu · RH': 'dht',
  'Relay 2 kanal': 'relay',
  'Kipas ventilasi': 'fan',
  'LED indikator': 'led',
  'Power': 'power',
  'USB 5V': 'usb',
  'Buzzer': 'buzzer',
  'Filtrasi udara': 'filter',
};

export const DeviceDiagram: React.FC<DeviceDiagramProps> = ({
  deviceState,
  isBuzzerRinging,
  selectedComponent,
  onSelectComponent,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isSvgInitializedRef = useRef(false);

  // Compute LCD display frames based on state
  const lcdFrames = useMemo(() => {
    const { lv, pm, co2, src } = deviceState;
    const pmCo2Line: [string, string] = [`PM2.5:${pm} ug/m3`, `CO2: ${co2} ppm`];

    if (lv === 0) {
      return [
        ['SIAGA-UDARA AI', 'Udara: BAIK'],
        pmCo2Line,
        ['Sistem Optimal', 'Sensor Siaga'],
      ];
    }
    if (lv === 1) {
      return [
        ['! WASPADA !', 'Udara: SEDANG'],
        pmCo2Line,
        ['Sirkulasi Aktif', 'Pantau Ruang'],
      ];
    }
    return [
      ['!! PERINGATAN !!', 'Udara TDK SEHAT'],
      pmCo2Line,
      src === 'CO₂'
        ? ['Buka ventilasi!', 'Kipas menyala']
        : ['Pakai masker,', 'Batasi aktivitas'],
    ];
  }, [deviceState]);

  // Inject SVG markup on mount
  useEffect(() => {
    if (!containerRef.current || isSvgInitializedRef.current) return;

    containerRef.current.innerHTML = DEVICE_SVG_RAW;
    isSvgInitializedRef.current = true;

    // Attach interactive click listeners to labels
    const labels = containerRef.current.querySelectorAll('.lb');
    labels.forEach((g) => {
      const textElem = g.querySelector('text');
      const text = textElem?.textContent?.trim() || '';
      const compId = LABEL_MAP[text];

      if (compId) {
        g.setAttribute('role', 'button');
        g.setAttribute('tabindex', '0');
        g.setAttribute('data-comp-id', compId);
        (g as HTMLElement).style.cursor = 'pointer';
        (g as HTMLElement).style.transition = 'transform 0.2s ease, filter 0.2s ease';

        g.addEventListener('click', () => {
          onSelectComponent(compId);
        });

        g.addEventListener('mouseenter', () => {
          (g as HTMLElement).style.transform = 'scale(1.06)';
          (g as HTMLElement).style.filter = 'drop-shadow(0 0 6px rgba(143,216,192,0.8))';
        });

        g.addEventListener('mouseleave', () => {
          (g as HTMLElement).style.transform = '';
          (g as HTMLElement).style.filter = '';
        });
      }
    });
  }, [onSelectComponent]);

  // Synchronize state with SVG DOM elements
  useEffect(() => {
    if (!containerRef.current) return;
    const root = containerRef.current;

    // 1. LCD text
    const curFrame = lcdFrames[deviceState.fr % lcdFrames.length];
    const lcd1 = root.querySelector('#lcd1');
    const lcd2 = root.querySelector('#lcd2');
    const lcdCur = root.querySelector('#lcdCur');
    const lcdTint = root.querySelector('#lcdTint');

    if (lcd1) lcd1.textContent = curFrame[0];
    if (lcd2) lcd2.textContent = curFrame[1];
    if (lcdCur) {
      lcdCur.setAttribute('x', String(44 + curFrame[1].length * 8.5 + 1));
    }
    if (lcdTint) {
      lcdTint.setAttribute('opacity', deviceState.lv === 1 ? '0.22' : '0');
      lcdTint.classList.toggle('al', deviceState.lv === 2);
    }

    // 2. LEDs
    const ledG = root.querySelector('#ledG');
    const ledGg = root.querySelector('#ledGg') as HTMLElement | null;
    const ledY = root.querySelector('#ledY');
    const ledYg = root.querySelector('#ledYg') as HTMLElement | null;
    const ledR = root.querySelector('#ledR');
    const ledRg = root.querySelector('#ledRg') as HTMLElement | null;

    if (ledG) ledG.setAttribute('fill-opacity', deviceState.lv === 0 ? '1' : '0.28');
    if (ledGg) ledGg.style.display = deviceState.lv === 0 ? '' : 'none';

    if (ledY) ledY.setAttribute('fill-opacity', deviceState.lv === 1 ? '1' : '0.28');
    if (ledYg) ledYg.style.display = deviceState.lv === 1 ? '' : 'none';

    if (ledR) {
      ledR.setAttribute('fill-opacity', deviceState.lv === 2 ? '1' : '0.28');
      ledR.classList.toggle('bk', deviceState.lv === 2);
    }
    if (ledRg) {
      ledRg.style.display = deviceState.lv === 2 ? '' : 'none';
      ledRg.classList.toggle('bk', deviceState.lv === 2);
    }

    // 3. Relays
    const relayLed = root.querySelector('#relayLed');
    if (relayLed) {
      relayLed.setAttribute('fill', deviceState.fan ? '#ff6b5e' : '#5a2a2a');
      relayLed.classList.toggle('led', deviceState.fan);
    }

    const relayLed2 = root.querySelector('#relayLed2');
    if (relayLed2) {
      relayLed2.setAttribute('fill', deviceState.fil ? '#ff6b5e' : '#5a2a2a');
      relayLed2.classList.toggle('led', deviceState.fil);
    }

    // 4. Kipas Ventilasi
    const fanBl = root.querySelector('#fanBl');
    if (fanBl) {
      fanBl.classList.toggle('off', !deviceState.fan);
    }

    // 5. Filtrasi Udara HEPA
    const puri = root.querySelector('#puri');
    const puriBl = root.querySelector('#puriBl');
    const puriLed = root.querySelector('#puriLed');
    if (puri) puri.classList.toggle('on', deviceState.fil);
    if (puriBl) puriBl.classList.toggle('off', !deviceState.fil);
    if (puriLed) puriLed.setAttribute('fill', deviceState.fil ? '#5fd18a' : '#5a2a2a');

    // 6. Buzzer
    const bz = root.querySelector('#bz');
    if (bz) {
      bz.classList.toggle('ring', isBuzzerRinging);
    }

    // 7. Active Component Selection Highlight
    const labels = root.querySelectorAll('.lb');
    labels.forEach((g) => {
      const compId = g.getAttribute('data-comp-id');
      const rect = g.querySelector('rect');
      if (rect) {
        if (selectedComponent && compId === selectedComponent) {
          rect.setAttribute('stroke', '#86f2f9');
          rect.setAttribute('stroke-width', '2');
          rect.setAttribute('fill-opacity', '1');
        } else {
          rect.setAttribute('stroke', '#8fd8c0');
          rect.setAttribute('stroke-width', '1');
          rect.setAttribute('fill-opacity', '0.9');
        }
      }
    });
  }, [deviceState, isBuzzerRinging, selectedComponent, lcdFrames]);

  return (
    <div className="relative w-full max-w-[560px] mx-auto select-none">
      <div
        ref={containerRef}
        className="w-full h-auto drop-shadow-2xl transition-all duration-300 [&>svg]:w-full [&>svg]:h-auto"
      />
    </div>
  );
};
