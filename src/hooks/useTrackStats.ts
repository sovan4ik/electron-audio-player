import { useEffect, useState } from "react";
import { TrackStats } from "@/types";

export type TracksStatsMap = Record<string, TrackStats>;

export function useTrackStats() {
  const [stats, setStats] = useState<TracksStatsMap>({});

  useEffect(() => {
    const load = async () => {
      const loaded: TracksStatsMap = await window.electronAPI.loadTrackStats();
      setStats(loaded);
    };
    load();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      window.electronAPI.saveTrackStats(stats);
    }, 5000);
    return () => clearInterval(id);
  }, [stats]);

  const updateStats = (file: string, update: Partial<TrackStats>) => {
    setStats((prev) => {
      const current = prev[file] || {
        playCount: 0,
        skipCount: 0,
        liked: false,
        lastPlayed: null,
        totalListenTime: 0,
      };

      const merged: TrackStats = {
        playCount: current.playCount + (update.playCount ?? 0),
        skipCount: current.skipCount + (update.skipCount ?? 0),
        liked: update.liked ?? current.liked,
        lastPlayed: update.lastPlayed ?? current.lastPlayed,
        totalListenTime:
          current.totalListenTime + (update.totalListenTime ?? 0),
      };

      return { ...prev, [file]: merged };
    });
  };

  return { stats, updateStats };
}
