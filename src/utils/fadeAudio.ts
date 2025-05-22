export default function fadeAudio(
  audio: HTMLAudioElement,
  from: number,
  to: number,
  duration = 1000
) {
  const steps = 20;
  const stepTime = duration / steps;
  const volumeStep = (to - from) / steps;
  let currentStep = 0;

  const interval = setInterval(() => {
    currentStep++;
    const newVolume = from + volumeStep * currentStep;
    audio.volume = Math.min(Math.max(newVolume, 0), 1);
    if (currentStep >= steps) {
      clearInterval(interval);
    }
  }, stepTime);
}
