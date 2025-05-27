import { useTracks } from "@/hooks/useTracks";
import { useAudioPlayer, useSearch, useTrackFlags } from "@/hooks/useContext";
import { IgnoredTrackList } from "@/components/TrackList/Ignored/IgnoredTrackList";
import { Track } from "@/types";

export default function IgnoredPage() {
  const player = useAudioPlayer();
  const { tracks } = useTracks();
  const { searchQuery } = useSearch();
  const { liked, ignored, toggleLike, toggleIgnore } = useTrackFlags();

  const ignoredTracks = Array.from(ignored)
    .map((file) => tracks.find((track) => track.file === file))
    .filter((track): track is Track => track !== undefined)
    .reverse();

  const filteredTracks = ignoredTracks.filter(
    (track) =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artists?.some((a) =>
        a.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <IgnoredTrackList
      tracks={filteredTracks}
      liked={liked}
      ignored={ignored}
      toggleLike={toggleLike}
      toggleIgnore={toggleIgnore}
      onPlay={player.playTrack}
      onPause={player.togglePlayPause}
      currentTrackFile={player.currentTrack?.file}
      isPlaying={player.isPlaying}
    />
  );
}
