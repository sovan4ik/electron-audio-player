import { createContext, useContext } from "react";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

const AudioPlayerContext = createContext<ReturnType<
  typeof useAudioPlayer
> | null>(null);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const player = useAudioPlayer();
  return (
    <AudioPlayerContext.Provider value={player}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export function useAudioPlayerContext() {
  const context = useContext(AudioPlayerContext);
  if (!context)
    throw new Error(
      "useAudioPlayerContext must be used within AudioPlayerProvider"
    );
  return context;
}
