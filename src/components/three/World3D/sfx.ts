// Tiny WebAudio synth for the 3D game. The context is created lazily on the first
// sound, which always follows a key press, so browsers allow it to start.
let ctx: AudioContext | null = null;

export function tone({
  freq,
  to = freq,
  type = 'triangle',
  dur = 0.16,
  vol = 0.1,
}: {
  freq: number;
  to?: number;
  type?: OscillatorType;
  dur?: number;
  vol?: number;
}) {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(to, ctx.currentTime + dur * 0.6);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur + 0.02);
  } catch {
    // no audio — fine
  }
}

export const sfx = {
  eat: (points: number) => tone({ freq: 420 + points * 120, to: (420 + points * 120) * 1.8 }),
  beep: (go = false) => tone({ freq: go ? 880 : 440, type: 'square', dur: go ? 0.28 : 0.12, vol: 0.05 }),
  wrap: () => tone({ freq: 300, to: 900, type: 'sine', dur: 0.14, vol: 0.05 }),
  die: () => tone({ freq: 380, to: 60, type: 'sawtooth', dur: 0.6, vol: 0.08 }),
};

export function closeAudio() {
  ctx?.close().catch(() => undefined);
  ctx = null;
}
