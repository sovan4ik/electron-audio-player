import { useEffect, useRef, useState } from "react";
import { Track } from "../types";
import { usePlaybackQueues } from "./usePlaybackQueues";
import { useTrackStats } from "./useContext";
import fadeAudio from "@/utils/fadeAudio";

export function useAudioPlayer() {
  const { currentQueue } = usePlaybackQueues();
  const { stats, updateStats } = useTrackStats();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [targetVolume, setTargetVolume] = useState<number | null>(null);

  const listenStart = useRef<number | null>(null);
  const listenBuffer = useRef<number>(0);
  const refTotalTime = useRef<number>(0);
  const currentIndexRef = useRef<number>(-1);
  const playedAlready = useRef<boolean>(false);

  const [visibleListenTime, setVisibleListenTime] = useState(0);
  const lastRawTime = useRef<number>(0); // protection to prevent playback time from jumping

  useEffect(() => {
    if (!currentTrack) return;
    const s = stats[currentTrack.file];
    if (s && typeof s.totalListenTime === "number") {
      refTotalTime.current = s.totalListenTime;
      lastRawTime.current = s.totalListenTime;
      setVisibleListenTime(s.totalListenTime);
    } else {
      refTotalTime.current = 0;
      lastRawTime.current = 0;
      setVisibleListenTime(0);
    }
  }, [stats, currentTrack]);

  // Tracking time in interval
  useEffect(() => {
    const interval = setInterval(() => {
      const audio = audioRef.current;
      if (!audio || !currentTrack || audio.paused || audio.ended) return;

      const now = Date.now();
      if (listenStart.current !== null) {
        const delta = (now - listenStart.current) / 1000;
        listenBuffer.current += delta;
        listenStart.current = now;

        const total = refTotalTime.current + listenBuffer.current;
        const floored = Math.floor(total);

        // twitch protection
        if (floored !== lastRawTime.current) {
          lastRawTime.current = floored;
          setVisibleListenTime(floored);
        }

        const fullSeconds = Math.floor(listenBuffer.current);
        if (fullSeconds >= 1) {
          updateStats(currentTrack.file, {
            totalListenTime: fullSeconds,
          });
          refTotalTime.current += fullSeconds;
          listenBuffer.current -= fullSeconds;
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [currentTrack]);

  // Track index
  useEffect(() => {
    if (!currentTrack) return;
    const index = currentQueue.findIndex((t) => t.file === currentTrack.file);
    currentIndexRef.current = index;
  }, [currentTrack, currentQueue]);

  const finalizeStats = () => {
    const now = Date.now();
    if (!currentTrack || listenStart.current === null) return;

    const delta = (now - listenStart.current) / 1000;
    listenBuffer.current += delta;

    const fullSeconds = Math.floor(listenBuffer.current);
    if (fullSeconds >= 1) {
      updateStats(currentTrack.file, {
        totalListenTime: fullSeconds,
      });
      refTotalTime.current += fullSeconds;
      listenBuffer.current -= fullSeconds;
    }

    listenStart.current = null;
  };

  const loadTrack = (track: Track, startTime = 0) => {
    finalizeStats();
    const audio = audioRef.current;
    if (!audio || targetVolume === null) return;

    setCurrentTrack(track);
    audio.src = track.file;
    audio.currentTime = startTime;
    audio.volume = targetVolume;
    setIsPlaying(false);
  };

  const playTrack = (track: Track, startTime = 0) => {
    finalizeStats();
    const audio = audioRef.current;
    if (!audio || targetVolume === null) return;

    setCurrentTrack(track);
    setIsPlaying(true);
    audio.src = track.file;
    audio.currentTime = startTime;
    audio.volume = 0;

    audio
      .play()
      .then(() => {
        fadeAudio(audio, 0, targetVolume, 200);
        listenStart.current = Date.now();

        if (!playedAlready.current) {
          updateStats(track.file, {
            playCount: 1,
            lastPlayed: Date.now(),
          });
          playedAlready.current = true;
        }
      })
      .catch((err) => {
        console.warn("Playback failed:", err);
        setIsPlaying(false);
      });
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || targetVolume === null) return;

    if (audio.paused) {
      setIsPlaying(true);
      audio.volume = 0;
      audio.play().then(() => {
        fadeAudio(audio, 0, targetVolume, 200); // fade in
        listenStart.current = Date.now();
      });
    } else {
      fadeAudio(audio, audio.volume, 0, 200); // fade out
      setTimeout(() => {
        finalizeStats();
        audio.pause();
        setIsPlaying(false);
      }, 200);
    }
  };
  const playNext = () => {
    finalizeStats();
    const index = currentIndexRef.current;
    const next = currentQueue[(index + 1) % currentQueue.length];
    playTrack(next);
  };

  const playPrev = () => {
    const audio = audioRef.current;
    if (!currentTrack || !audio) return;

    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      listenStart.current = Date.now();
      return;
    }

    finalizeStats();
    const index =
      (currentIndexRef.current - 1 + currentQueue.length) % currentQueue.length;
    const prev = currentQueue[index];
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

  const handleSeek = (p: number) => {
    const audio = audioRef.current;
    if (audio && duration) {
      audio.currentTime = duration * p;
    }
  };

  // when exiting the application
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
    loadTrack,
    togglePlayPause,
    playNext,
    playPrev,
    handleSeek,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    targetVolume,
    setTargetVolume: updateVolume,
    visibleListenTime,
  };
}
