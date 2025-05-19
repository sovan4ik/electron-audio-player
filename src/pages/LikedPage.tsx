import { useEffect, useState } from "react";
import { useTracks } from "@/hooks/useTracks";
import { useAudioPlayerContext } from "@/contexts/AudioPlayerProvider";
import { Track } from "../types";
import { TrackList } from "../components/tracks/TrackList";

export default function LikedPage() {
  const player = useAudioPlayerContext();
  const { tracks } = useTracks();
  const [liked, setLiked] = useState<Set<string>>(new Set());

  useEffect(() => {
    const load = async () => {
      const likedFromFile = await window.electronAPI.loadLikes();
      setLiked(new Set(likedFromFile));
    };
    load();
  }, []);

  const likedTracks = Array.from(liked)
    .map((file) => tracks.find((track) => track.file === file))
    .filter((track) => track !== undefined)
    .reverse();

  const toggleLike = (track: Track) => {
    const newLiked = new Set(liked);
    if (newLiked.has(track.file)) {
      newLiked.delete(track.file);
    } else {
      newLiked.add(track.file);
    }
    setLiked(newLiked);
    window.electronAPI.saveLikes(Array.from(newLiked));
  };

  const playTrack = (track: Track) => {
    player.playTrack(track);
  };

  const pauseTrack = () => {
    player.togglePlayPause();
  };

  return (
    <TrackList
      tracks={likedTracks}
      liked={liked}
      toggleLike={toggleLike}
      onPlay={playTrack}
      onPause={pauseTrack}
      currentTrackFile={player.currentTrack?.file}
      isPlaying={player.isPlaying}
    />
  );
}
