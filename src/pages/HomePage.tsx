import { useEffect, useRef } from "react";
import { useAudioPlayerContext } from "@/contexts/AudioPlayerProvider";
import { TrackList } from "@/components/tracks/TrackList";
import { useLikes } from "@/hooks/useLikes";
import { useAppSettings } from "@/hooks/useAppSettings";
import { usePlaybackQueues } from "@/hooks/usePlaybackQueues";

export default function HomePage() {
  const player = useAudioPlayerContext();
  const { liked, genreStats, toggleLike } = useLikes();
  const { currentQueue } = usePlaybackQueues();
  const {
    volume,
    setVolume,
    lastPlayed,
    isReady: isSettingsReady,
  } = useAppSettings();
  const initialized = useRef(false);

  // Apply volume from settings
  useEffect(() => {
    if (isSettingsReady) {
      player.setTargetVolume(volume);
    }
  }, [isSettingsReady, volume]);
  

  // Load last played track and initialize queues
  useEffect(() => {
    if (!initialized.current && isSettingsReady && currentQueue.length > 0) {
      if (
        lastPlayed &&
        (!player.currentTrack || player.currentTrack.file !== lastPlayed.file)
      ) {
        const found = currentQueue.find((t) => t.file === lastPlayed.file);
        if (found) {
          player.loadTrack(found, lastPlayed.position);
        }
      }
      initialized.current = true;
    }
  }, [isSettingsReady, currentQueue, lastPlayed]);

  return (
    <TrackList
      tracks={currentQueue}
      liked={liked}
      toggleLike={toggleLike}
      onPlay={player.playTrack}
      onPause={player.togglePlayPause}
      currentTrackFile={player.currentTrack?.file}
      isPlaying={player.isPlaying}
    />
  );
}
