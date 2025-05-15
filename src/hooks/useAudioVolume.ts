import { useEffect, useState } from "react";
import { useAppSettings } from "./useAppSettings";
import { useAudioPlayerContext } from "@/contexts/AudioPlayerProvider";

export function useAudioVolume() {
  const { audioRef } = useAudioPlayerContext();
  const { volume: savedVolume, setVolume: saveVolume } = useAppSettings();
  const [volume, setVolumeState] = useState<number | null>(null);
  const [isMuted, setMuted] = useState(false);

  // Set volume to audio when done
  useEffect(() => {
    if (audioRef.current && volume !== null) {
      audioRef.current.volume = volume;
    }
  }, [audioRef, volume]);

  // When volume comes from useAppSettings, apply it
  useEffect(() => {
    if (savedVolume !== undefined && savedVolume !== null) {
      setVolumeState(savedVolume);
      if (audioRef.current) {
        audioRef.current.volume = savedVolume;
      }
    }
  }, [savedVolume]);

  const setVolume = (v: number) => {
    setVolumeState(v);
    saveVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume ?? 0.5;
    } else {
      audioRef.current.volume = 0;
    }
    setMuted(!isMuted);
  };

  return {
    volume: volume ?? 0.5,
    setVolume,
    isMuted,
    toggleMute,
  };
}
