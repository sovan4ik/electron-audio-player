import { useState, useEffect, useRef } from "react";
import { useTracks } from "./useTracks";
import { useAppSettings, useTrackFlags } from "@/hooks/useContext";
import { getSmartShuffledTracks } from "@/utils/getSmartShuffledTracks";
import { Track, PlayMode } from "@/types";

export function usePlaybackQueues() {
  const { tracks, isTracksReady } = useTracks();
  const { liked, ignored, genreStats } = useTrackFlags();
  const { lastPlayed, playMode } = useAppSettings();

  const [currentQueue, setCurrentQueue] = useState<Track[]>([]);
  const primaryQueueRef = useRef<Track[] | null>(null);

  // forming primary queue once
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

  // refreshing the queue when changing playMode / likes / genres
  useEffect(() => {
    if (!isTracksReady || !primaryQueueRef.current) return;

    let queue: Track[] = [];

    const baseQueue = primaryQueueRef.current.filter(
      (track) => !ignored.has(track.file)
    );

    switch (playMode) {
      case PlayMode.Normal:
        queue = [...baseQueue];
        break;

      case PlayMode.Shuffle: {
        const [first, ...rest] = baseQueue;
        queue = first ? [first, ...rest.sort(() => Math.random() - 0.5)] : [];
        break;
      }

      case PlayMode.SmartShuffle: {
        const [first, ...rest] = baseQueue;
        queue = first
          ? [first, ...getSmartShuffledTracks(rest, liked, genreStats)]
          : [];
        break;
      }

      default:
        queue = [...baseQueue];
        break;
    }

    setCurrentQueue(queue);
  }, [playMode, isTracksReady, liked, genreStats, ignored]);

  // add a random non-ignored track if the ignore has been updated
  useEffect(() => {
    if (!isTracksReady || !primaryQueueRef.current) return;

    // filter already used tracks
    const currentFiles = new Set(currentQueue.map((t) => t.file));
    const candidates = tracks.filter(
      (t) => !ignored.has(t.file) && !currentFiles.has(t.file)
    );

    if (candidates.length > 0) {
      const random = candidates[Math.floor(Math.random() * candidates.length)];
      setCurrentQueue((prev) => [...prev, random]);
    }
  }, [ignored]); // reacts to change ignored

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
    primaryQueue: primaryQueueRef.current || [],
  };
}
