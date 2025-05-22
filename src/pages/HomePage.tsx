import { TrackList } from "@/components/TrackList/Home/TrackList";
import { useLikes } from "@/hooks/useLikes";
import { usePlaybackQueues } from "@/hooks/usePlaybackQueues";
import { useAudioPlayer } from "@/hooks/useContext";

export default function HomePage() {
  const player = useAudioPlayer();
  const { liked, toggleLike } = useLikes();

  const { primaryQueue } = usePlaybackQueues();

  return (
    <>
      <TrackList
        tracks={primaryQueue}
        liked={liked}
        toggleLike={toggleLike}
        onPlay={() => console.log()}
        onPause={player.togglePlayPause}
        currentTrackFile={player.currentTrack?.file}
        isPlaying={player.isPlaying}
      />
    </>
  );
}
