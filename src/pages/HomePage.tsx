import { TrackList } from "@/components/TrackList/Home/TrackList";
import { useLikes } from "@/hooks/useLikes";
import { usePlaybackQueues } from "@/hooks/usePlaybackQueues";
import { useAudioPlayer, useSearch } from "@/hooks/useContext";

export default function HomePage() {
  const player = useAudioPlayer();
  const { liked, toggleLike } = useLikes();

  const { primaryQueue } = usePlaybackQueues();
  const { searchQuery } = useSearch();

  const filteredTracks = primaryQueue.filter(
    (track) =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artists?.some((a) =>
        a.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );
  return (
    <>
      <TrackList
        tracks={filteredTracks}
        liked={liked}
        toggleLike={toggleLike}
        onPlay={player.playTrack}
        onPause={player.togglePlayPause}
        currentTrackFile={player.currentTrack?.file}
        isPlaying={player.isPlaying}
      />
    </>
  );
}
