import { useCallback, useEffect, useState } from "react";

export function useIgnore() {
  const [ignored, setIgnored] = useState<Set<string>>(new Set());

  useEffect(() => {
    window.electronAPI.loadIgnored().then((list) => {
      setIgnored(new Set(list));
    });
  }, []);

  const toggleIgnore = useCallback((track: string) => {
    setIgnored((prev) => {
      const copy = new Set(prev);
      if (copy.has(track)) {
        copy.delete(track);
        window.electronAPI.unignoreTrack(track);
      } else {
        copy.add(track);
        window.electronAPI.ignoreTrack(track);
      }
      return copy;
    });
  }, []);

  return {
    ignored,
    toggleIgnore,
  };
}
