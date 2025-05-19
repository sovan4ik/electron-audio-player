import { useEffect, useRef, useState } from "react";
import { Track } from "../types";
import { usePlaybackQueues } from "./usePlaybackQueues";
import { useTrackStats } from "./useTrackStats";
import { useTrackStatsContext } from "@/contexts/TrackStatsProvider";

export function useAudioPlayer() {
  const { currentQueue } = usePlaybackQueues();
  const { updateStats } = useTrackStatsContext();

  const audioRef = useRef<HTMLAudioElement>(null);
  const autoStart = false;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [targetVolume, setTargetVolume] = useState<number | null>(null);

  const listenStart = useRef<number | null>(null);
  const playedAlready = useRef<boolean>(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const interval = setInterval(() => {
      if (!audio.paused && !audio.ended) {
        console.log("[STATS] +1s for", currentTrack.file);
        updateStats(currentTrack.file, { totalListenTime: 1 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [audioRef, currentTrack]);

  const finalizeStats = () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const listened =
      listenStart.current !== null
        ? audio.currentTime - listenStart.current
        : 0;

    if (listened > 0) {
      updateStats(currentTrack.file, {
        totalListenTime: Math.floor(listened),
      });
    }

    listenStart.current = null;
    playedAlready.current = false;
  };

  const playTrack = (track: Track, startTime = 0) => {
    finalizeStats();

    const audio = audioRef.current;
    if (!audio || targetVolume === null) return;

    setCurrentTrack(track);
    setIsPlaying(true);

    audio.src = track.file;
    audio.currentTime = startTime;

    audio.onloadedmetadata = () => {
      audio.volume = targetVolume;

      audio.play().then(() => {
        listenStart.current = audio.currentTime;
        if (!playedAlready.current) {
          updateStats(track.file, {
            playCount: 1,
            lastPlayed: Date.now(),
          });
          playedAlready.current = true;
        }
      });
    };
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || targetVolume === null) return;

    if (audio.paused) {
      setIsPlaying(true);
      audio.volume = targetVolume;
      audio.play().then(() => {
        listenStart.current = audio.currentTime;
      });
    } else {
      const ratio = audio.currentTime / (audio.duration || 1);
      if (ratio < 0.1 && currentTrack) {
        updateStats(currentTrack.file, { skipCount: 1 });
      }

      finalizeStats();
      setIsPlaying(false);
      audio.pause();
    }
  };

  const playNext = () => {
    const audio = audioRef.current;
    if (currentTrack && audio) {
      const ratio = audio.currentTime / (audio.duration || 1);
      if (ratio < 0.1) {
        updateStats(currentTrack.file, { skipCount: 1 });
      }
    }

    finalizeStats();

    const index = currentQueue.findIndex((t) => t.file === currentTrack?.file);
    const next = currentQueue[index + 1] || currentQueue[0];
    playTrack(next);
  };

  const playPrev = () => {
    const audio = audioRef.current;
    if (!currentTrack || !audio) return;

    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      listenStart.current = 0;
      return;
    }

    finalizeStats();
    const index = currentQueue.findIndex((t) => t.file === currentTrack.file);
    const prev =
      currentQueue[index - 1] || currentQueue[currentQueue.length - 1];
    playTrack(prev);
  };

  const handleEnded = () => {
    finalizeStats();
    playNext();
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setProgress(audio.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration);
    }
  };

  const updateVolume = (value: number) => {
    setTargetVolume(value);
    const audio = audioRef.current;
    if (audio) audio.volume = value;
  };

  // ✅ Save listen time before window closes
  useEffect(() => {
    const onUnload = () => finalizeStats();
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [currentTrack]);

  return {
    audioRef,
    isPlaying,
    currentTrack,
    progress,
    duration,
    playTrack,
    loadTrack: playTrack,
    togglePlayPause,
    playNext,
    playPrev,
    handleSeek: (p: number) => {
      const audio = audioRef.current;
      if (audio && duration) {
        audio.currentTime = duration * p;
      }
    },
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    targetVolume,
    setTargetVolume: updateVolume,
  };
}
