import { PlayMode } from "@/types";
import { useEffect, useState, useCallback } from "react";

type LastPlayed = { file: string; position: number } | null;

export function useAppSettings() {
  const [volume, setVolumeState] = useState<number | null>(null);
  const [lastPlayed, setLastPlayedState] = useState<LastPlayed>(null);
  const [playMode, setPlayModeState] = useState<PlayMode>(PlayMode.Normal);
  const isReady = volume !== null;

  useEffect(() => {
    window.electronAPI.loadVolume().then(setVolumeState);
    window.electronAPI.loadLastPlayed().then(setLastPlayedState);
    window.electronAPI.loadPlayMode().then(setPlayModeState);
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    window.electronAPI.saveVolume(v);
  }, []);

  const saveLastPlayed = useCallback(
    (data: { file: string; position: number }) => {
      setLastPlayedState(data);
      window.electronAPI.saveLastPlayed(data);
    },
    []
  );

  const setPlayMode = useCallback((mode: PlayMode) => {
    setPlayModeState(mode);
    window.electronAPI.savePlayMode(mode);
  }, []);

  return {
    volume: volume ?? 0.5,
    setVolume,
    lastPlayed,
    saveLastPlayed,
    playMode,
    setPlayMode,
    isReady,
  };
}
