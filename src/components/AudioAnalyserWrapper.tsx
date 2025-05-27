import { useAudioPlayer } from "@/hooks/useContext";
import { AudioAnalyserProvider } from "@/contexts/AudioAnalyserProvider";
import { ReactNode } from "react";

export const AudioAnalyserWrapper = ({ children }: { children: ReactNode }) => {
  const player = useAudioPlayer();
  if (!player || !player.analyserRef) return null;

  return (
    <AudioAnalyserProvider analyserRef={player.analyserRef}>
      {children}
    </AudioAnalyserProvider>
  );
};
