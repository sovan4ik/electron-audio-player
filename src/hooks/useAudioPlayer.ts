import { useEffect, useRef, useState } from "react";
import { Track } from "../types";

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const playTrack = (track: Track, position: number = 0) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play(), 0);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (percent: number) => {
    if (!audioRef.current) return;
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };
    audio.addEventListener("timeupdate", updateProgress);
    return () => audio.removeEventListener("timeupdate", updateProgress);
  }, []);

  return {
    audioRef,
    currentTrack,
    isPlaying,
    progress,
    duration,
    playTrack,
    togglePlayPause,
    handleSeek,
  };
}
