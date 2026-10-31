// Web Audio API Game Sound Synthesizer (Zero external file dependencies)
// Produces a crisp, satisfying tactical game UI click like Clash of Clans / Steam

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Plays a clean, satisfying game UI click sound.
 */
export function playNavSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Transient click (sharp metallic/tactile attack)
    const oscClick = ctx.createOscillator();
    const gainClick = ctx.createGain();

    oscClick.type = 'triangle';
    oscClick.frequency.setValueAtTime(1100, now);
    oscClick.frequency.exponentialRampToValueAtTime(320, now + 0.04);

    gainClick.gain.setValueAtTime(0.18, now);
    gainClick.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    oscClick.connect(gainClick);
    gainClick.connect(ctx.destination);

    oscClick.start(now);
    oscClick.stop(now + 0.05);

    // 2. Body thud (wooden / tactile button body)
    const oscBody = ctx.createOscillator();
    const gainBody = ctx.createGain();

    oscBody.type = 'sine';
    oscBody.frequency.setValueAtTime(260, now + 0.005);
    oscBody.frequency.exponentialRampToValueAtTime(80, now + 0.06);

    gainBody.gain.setValueAtTime(0.12, now + 0.005);
    gainBody.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    oscBody.connect(gainBody);
    gainBody.connect(ctx.destination);

    oscBody.start(now + 0.005);
    oscBody.stop(now + 0.075);
  } catch {
    // AudioContext blocked or not supported on device
  }
}
