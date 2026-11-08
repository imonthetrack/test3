/**
 * Web Audio API synthesizer for SIAGA-UDARA AI Buzzer
 * Matches the original audio mechanics with enhanced reliability and volume control
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;
  private alarmTimer: number | null = null;
  private currentLevel: number = 0;
  private onRingCallback: ((duration: number) => void) | null = null;

  constructor() {
    // Initialized lazily on first user interaction
  }

  public setRingCallback(cb: (duration: number) => void) {
    this.onRingCallback = cb;
  }

  public unlock(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state !== 'running') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleSound(): boolean {
    this.isEnabled = !this.isEnabled;
    if (this.isEnabled) {
      this.unlock();
      this.beep(880, 0, 0.1, 0.05); // test beep
    } else {
      this.stopAlarm();
    }
    return this.isEnabled;
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public beep(frequency: number, delaySec: number, durationSec: number, gainVol = 0.09): void {
    if (!this.isEnabled || !this.ctx || this.ctx.state !== 'running') return;

    try {
      const startTime = this.ctx.currentTime + delaySec;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.value = frequency;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(gainVol, startTime + 0.01);
      gain.gain.setValueAtTime(gainVol, startTime + durationSec - 0.02);
      gain.gain.linearRampToValueAtTime(0, startTime + durationSec);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + durationSec + 0.02);
    } catch {
      // AudioContext could be blocked by browser policy
    }
  }

  public playAlarmOnce(level: number): number {
    if (level === 1) {
      // Waspada: 2x 880Hz beeps
      this.beep(880, 0.0, 0.12);
      this.beep(880, 0.2, 0.12);
      if (this.onRingCallback) this.onRingCallback(450);
      return 6000; // interval in ms until next warning beep
    } else if (level === 2) {
      // Bahaya: High-low urgent alarm (1400Hz and 900Hz)
      this.beep(1400, 0.0, 0.16, 0.12);
      this.beep(900, 0.22, 0.16, 0.12);
      this.beep(1400, 0.44, 0.16, 0.12);
      this.beep(900, 0.66, 0.16, 0.12);
      if (this.onRingCallback) this.onRingCallback(900);
      return 2400; // repeat quickly for urgent alert
    }
    return 10000;
  }

  public syncAlarm(level: number): void {
    const prevLevel = this.currentLevel;
    this.currentLevel = level;

    if (level === 0) {
      this.stopAlarm();
      return;
    }

    if (prevLevel !== level || this.alarmTimer === null) {
      this.stopAlarm();
      const loop = () => {
        if (!this.isEnabled || this.currentLevel === 0) return;
        const nextDelay = this.playAlarmOnce(this.currentLevel);
        this.alarmTimer = window.setTimeout(loop, nextDelay);
      };
      loop();
    }
  }

  public stopAlarm(): void {
    if (this.alarmTimer !== null) {
      clearTimeout(this.alarmTimer);
      this.alarmTimer = null;
    }
  }
}

export const soundEngine = new SoundEngine();
