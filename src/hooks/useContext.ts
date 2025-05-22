import { useContext } from "react";
import { AppSettingsContext } from "@/contexts/AppSettingsContext";
import { AudioPlayerContext } from "@/contexts/AudioPlayerProvider";
import { TrackStatsContext } from "@/contexts/TrackStatsProvider";

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
