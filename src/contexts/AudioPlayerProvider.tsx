import { createContext } from "react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

export const AudioPlayerContext = createContext<ReturnType<
  typeof useAudioPlayer
> | null>(null);

export const AudioPlayerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const player = useAudioPlayer();

  return (
    <AudioPlayerContext.Provider value={player}>
      {children}
    </AudioPlayerContext.Provider>
  );
};
