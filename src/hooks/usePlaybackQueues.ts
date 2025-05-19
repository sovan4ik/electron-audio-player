// usePlaybackQueues.ts
import { useState, useEffect } from "react";
import { useTracks } from "./useTracks";
import { useLikes } from "./useLikes";
import { useAppSettings } from "./useAppSettings";
import { usePlayMode } from "./usePlayMode";
import { getRankedTrackList } from "@/utils/getRankedTrackList";
import { Track, PlayMode } from "@/types";

export function usePlaybackQueues() {
  const { tracks } = useTracks();
  const { liked, genreStats } = useLikes();
  const { lastPlayed } = useAppSettings();
  const { mode } = usePlayMode();

  const [queues, setQueues] = useState<Record<PlayMode, Track[]>>({
    normal: [],
    shuffle: [],
    smartShuffle: [],
  });

  const [currentQueue, setCurrentQueue] = useState<Track[]>([]);

  useEffect(() => {
    const reorder = (arr: Track[]) => {
      if (!lastPlayed) return arr;
      const idx = arr.findIndex((t) => t.file === lastPlayed.file);
      return idx === -1 ? arr : [arr[idx], ...arr.filter((_, i) => i !== idx)];
    };

    const normal = reorder([...tracks]);
    const shuffle = reorder([...tracks].sort(() => Math.random() - 0.5));
    const smart = reorder(getRankedTrackList(genreStats, liked, tracks));

    const newQueues = { normal, shuffle, smartShuffle: smart };
    setQueues(newQueues);
    setCurrentQueue(newQueues[mode]);
  }, [tracks, liked, genreStats, lastPlayed]);

  useEffect(() => {
    if (queues[mode]) {
      setCurrentQueue(queues[mode]);
    }
  }, [mode, queues]);

  const getNext = (current: Track | null): Track | null => {
    if (!current) return currentQueue[0] || null;
    const index = currentQueue.findIndex((t) => t.file === current.file);
    return currentQueue[index + 1] || null;
  };

  const getPrev = (current: Track | null): Track | null => {
    if (!current) return null;
    const index = currentQueue.findIndex((t) => t.file === current.file);
    return currentQueue[index - 1] || null;
  };

  return {
    currentQueue,
    getNext,
    getPrev,
  };
}
