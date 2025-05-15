import { useRef, useState } from "react";
import { Track } from "../types";

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [targetVolume, setTargetVolume] = useState<number | null>(null);

  let isFading = false;

  const playTrack = (track: Track, startTime = 0) => {
    const audio = audioRef.current;
    if (!audio || targetVolume === null) return;

    setCurrentTrack(track);
    setIsPlaying(true);

    audio.src = track.file;
    audio.currentTime = startTime;

    audio.onloadedmetadata = () => {
      audio.volume = targetVolume;
      audio.play().catch((err) => {
        console.error("Play error:", err);
        setIsPlaying(false);
      });
    };
  };

  const loadTrack = (track: Track, startTime = 0) => {
    const audio = audioRef.current;
    if (!audio) return;

    setCurrentTrack(track);
    setIsPlaying(false);

    audio.src = track.file;
    audio.currentTime = startTime;
    if (targetVolume !== null) {
      audio.volume = targetVolume;
    }
  };

  const fadeOut = (audio: HTMLAudioElement, duration = 400): Promise<void> => {
    return new Promise((resolve) => {
      const step = 50;
      const steps = duration / step;
      const volumeStep = audio.volume / steps;
      isFading = true;

      const interval = setInterval(() => {
        if (audio.volume > volumeStep) {
          audio.volume -= volumeStep;
        } else {
          audio.volume = 0;
          clearInterval(interval);
          isFading = false;
          resolve();
        }
      }, step);
    });
  };

  const fadeIn = (audio: HTMLAudioElement, target = 1, duration = 400) => {
    const step = 50;
    const steps = duration / step;
    const volumeStep = target / steps;
    isFading = true;

    const interval = setInterval(() => {
      if (audio.volume < target - volumeStep) {
        audio.volume += volumeStep;
      } else {
        audio.volume = target;
        clearInterval(interval);
        isFading = false;
      }
    }, step);
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || targetVolume === null) return;

    if (audio.paused) {
      setIsPlaying(true);
      audio.volume = targetVolume;
      audio
        .play()
        .then(() => fadeIn(audio, targetVolume))
        .catch((err) => {
          console.error("Play error:", err);
          setIsPlaying(false);
        });
    } else {
      setIsPlaying(false);
      fadeOut(audio).then(() => {
        audio.pause();
      });
    }
  };
  const handleSeek = (percent: number) => {
    const audio = audioRef.current;
    if (audio && duration) {
      audio.currentTime = duration * percent;
    }
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
    if (audio && !isFading) {
      audio.volume = value;
    }
  };

  const playNext = (tracks: Track[]) => {
    if (!currentTrack) return;
    const index = tracks.findIndex((t) => t.file === currentTrack.file);
    const next = tracks[index + 1] || tracks[0];
    playTrack(next);
  };

  const playPrev = (tracks: Track[]) => {
    if (!currentTrack || !audioRef.current) return;
    if (audioRef.current.currentTime > 2) {
      audioRef.current.currentTime = 0;
      return;
    }
    const index = tracks.findIndex((t) => t.file === currentTrack.file);
    const prev = tracks[index - 1] || tracks[tracks.length - 1];
    playTrack(prev);
  };

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
    targetVolume,
    setTargetVolume: updateVolume,
  };
}
