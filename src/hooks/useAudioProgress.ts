import { useEffect, useState } from "react";

export function useAudioProgress(audioRef: React.RefObject<HTMLAudioElement>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => setProgress(audio.currentTime);
    audio.addEventListener("timeupdate", update);

    return () => {
      audio.removeEventListener("timeupdate", update);
    };
  }, [audioRef]);

  return progress;
}
