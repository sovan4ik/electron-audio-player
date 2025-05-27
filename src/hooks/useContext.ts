import { useContext } from "react";
import { AppSettingsContext } from "@/contexts/AppSettingsProvider";
import { AudioPlayerContext } from "@/contexts/AudioPlayerProvider";
import { TrackStatsContext } from "@/contexts/TrackStatsProvider";
import { AudioAnalyserContext } from "@/contexts/AudioAnalyserProvider";
import { SearchContext } from "@/contexts/SearchProvider";
import { TrackFlagsContext } from "@/contexts/TrackFlagsProvider";

export const useAppSettings = () => {
  const ctx = useContext(AppSettingsContext);
  if (!ctx)
    throw new Error("useAppSettings must be used within <AppSettingsProvider>");
  return ctx;
};

export const useAudioPlayer = () => {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx)
    throw new Error("useAudioPlayer must be used within <AudioPlayerProvider>");
  return ctx;
};

export const useTrackStats = () => {
  const ctx = useContext(TrackStatsContext);
  if (!ctx)
    throw new Error("useTrackStats must be used within <TrackStatsProvider>");
  return ctx;
};

export const useAudioAnalyser = () => {
  const ctx = useContext(AudioAnalyserContext);
  if (!ctx)
    throw new Error(
      "useAudioAnalyserContext must be used within <AudioAnalyserProvider>"
    );
  return ctx;
};

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx)
    throw new Error("useSearchContext must be used within SearchProvider");
  return ctx;
}

export function useTrackFlags() {
  const ctx = useContext(TrackFlagsContext);
  if (!ctx)
    throw new Error("useTrackFlags must be used within TrackFlagsProvider");
  return ctx;
}
