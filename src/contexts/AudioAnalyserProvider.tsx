import { createContext } from "react";
import { useAudioAnalyser } from "@/hooks/useAudioAnalyser";

export const AudioAnalyserContext = createContext<ReturnType<
  typeof useAudioAnalyser
> | null>(null);

export const AudioAnalyserProvider = ({
  children,
  analyserRef,
}: {
  children: React.ReactNode;
  analyserRef: React.RefObject<AnalyserNode>;
}) => {
  const analyser = useAudioAnalyser(analyserRef);

  return (
    <AudioAnalyserContext.Provider value={analyser}>
      {children}
    </AudioAnalyserContext.Provider>
  );
};
