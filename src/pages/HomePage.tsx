import { useEffect, useMemo, useRef } from "react";
import { useAudioPlayerContext } from "@/contexts/AudioPlayerProvider";
import { getRankedTrackList } from "@/utils/getRankedTrackList";
import { TrackList } from "@/components/tracks/TrackList";
import { useLikes } from "@/hooks/useLikes";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useTracks } from "@/hooks/useTracks";

export default function HomePage() {
  const player = useAudioPlayerContext();
  const { liked, genreStats, toggleLike } = useLikes();
  const { volume, setVolume, lastPlayed, isReady } = useAppSettings();
  const { tracks } = useTracks();
  const initialized = useRef(false);

  const displayTracks = useMemo(
    () => getRankedTrackList(genreStats, liked, tracks),
    [genreStats, liked]
  );

  useEffect(() => {
    if (isReady) {
      player.setTargetVolume(volume);
    }
  }, [isReady, volume]);

  // Loading the last track
  useEffect(() => {
    if (!initialized.current && isReady && lastPlayed) {
      // If the current track is already the same, don't load it
      if (
        !player.currentTrack ||
        player.currentTrack.file !== lastPlayed.file
      ) {
        const found = tracks.find((t) => t.file === lastPlayed.file);
        if (found) {
          player.loadTrack(found, lastPlayed.position);
        }
      }
      initialized.current = true;
    }
  }, [isReady, lastPlayed]);

  return (
    <TrackList
      tracks={displayTracks}
      liked={liked}
      toggleLike={toggleLike}
      onPlay={player.playTrack}
      onPause={player.togglePlayPause}
      currentTrackFile={player.currentTrack?.file}
      isPlaying={player.isPlaying}
    />
  );
}
