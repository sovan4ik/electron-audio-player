import { useState, useEffect, useRef } from "react";
import { useTracks } from "./useTracks";
import { useLikes } from "./useLikes";
import { useAppSettings } from "@/hooks/useContext";
import { getSmartShuffledTracks } from "@/utils/getSmartShuffledTracks";
import { Track, PlayMode } from "@/types";

export function usePlaybackQueues() {
  const { tracks, isTracksReady } = useTracks();
  const { liked, genreStats } = useLikes();
  const { lastPlayed, playMode } = useAppSettings();

  const [currentQueue, setCurrentQueue] = useState<Track[]>([]);
  const primaryQueueRef = useRef<Track[] | null>(null);

  
  useEffect(() => {
    if (!isTracksReady || tracks.length === 0 || primaryQueueRef.current)
      return;

    const lastPlayedTrack = tracks.find((t) => t.file === lastPlayed?.file);
    const others = tracks.filter((t) => t.file !== lastPlayed?.file);

    primaryQueueRef.current = [
      ...(lastPlayedTrack ? [lastPlayedTrack] : []),
      ...others,
    ];
  }, [tracks, isTracksReady, lastPlayed]);

  
  useEffect(() => {
    if (!isTracksReady || !primaryQueueRef.current) return;

    let queue: Track[] = [];

    switch (playMode) {
      case PlayMode.Normal:
        queue = [...primaryQueueRef.current];
        break;

      case PlayMode.Shuffle: {
        const others = primaryQueueRef.current.slice(1);
        queue = [
          primaryQueueRef.current[0],
          ...others.sort(() => Math.random() - 0.5),
        ];
        break;
      }

      case PlayMode.SmartShuffle: {
        const others = primaryQueueRef.current.slice(1);
        queue = [
          primaryQueueRef.current[0],
          ...getSmartShuffledTracks(others, liked, genreStats),
        ];
        break;
      }

      default:
        queue = [...primaryQueueRef.current];
        break;
    }

    setCurrentQueue(queue);
  }, [playMode, isTracksReady, liked, genreStats]);

  const getNext = (current: Track | null): Track | null => {
    if (!current) return currentQueue[0] || null;
    const index = currentQueue.findIndex((t) => t.file === current?.file);
    return currentQueue[index + 1] || null;
  };

  const getPrev = (current: Track | null): Track | null => {
    if (!current) return null;
    const index = currentQueue.findIndex((t) => t.file === current?.file);
    return currentQueue[index - 1] || null;
  };

  return {
    currentQueue,
    getNext,
    getPrev,
    primaryQueue: primaryQueueRef.current || [],
  };
}
