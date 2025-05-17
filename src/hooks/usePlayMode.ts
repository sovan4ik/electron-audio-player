import { useEffect, useState, useCallback } from "react";
import { PlayMode } from "@/types";

export function usePlayMode() {
  const [mode, setMode] = useState<PlayMode>(PlayMode.Normal);

  useEffect(() => {
    window.electronAPI.loadPlayMode().then(setMode);
  }, []);

  const updateMode = useCallback((newMode: PlayMode) => {
    setMode(newMode);
    window.electronAPI.savePlayMode(newMode);
  }, []);

  return { mode, setMode: updateMode };
}
