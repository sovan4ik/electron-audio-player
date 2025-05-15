import { useEffect, useState, useCallback } from "react";

type LastPlayed = { file: string; position: number } | null;

export function useAppSettings() {
  const [volume, setVolumeState] = useState<number | null>(null);
  const [lastPlayed, setLastPlayedState] = useState<LastPlayed>(null);
  const isReady = volume !== null;

  useEffect(() => {
    window.electronAPI.loadVolume().then(setVolumeState);
    window.electronAPI.loadLastPlayed().then(setLastPlayedState);
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

  return {
    volume: volume ?? 0.5,
    setVolume,
    lastPlayed,
    saveLastPlayed,
    isReady,
  };
}
