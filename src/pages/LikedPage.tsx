import { useTracks } from "@/hooks/useTracks";
import { useAudioPlayer, useSearch, useTrackFlags } from "@/hooks/useContext";
import { TrackList } from "../components/TrackList/Home/TrackList";

export default function LikedPage() {
  const player = useAudioPlayer();
  const { tracks } = useTracks();
  const { searchQuery } = useSearch();
  const { liked, toggleLike } = useTrackFlags();

  const likedTracks = Array.from(liked)
    .map((file) => tracks.find((track) => track.file === file))
    .filter((track): track is NonNullable<typeof track> => !!track)
    .reverse();

  const filteredTracks = likedTracks.filter(
    (track) =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artists?.some((a) =>
        a.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <TrackList
      tracks={filteredTracks}
      liked={liked}
      toggleLike={toggleLike}
      onPlay={player.playTrack}
      onPause={player.togglePlayPause}
      currentTrackFile={player.currentTrack?.file}
      isPlaying={player.isPlaying}
    />
  );
}
