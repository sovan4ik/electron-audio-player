import { useEffect, useState } from "react";
import { useTracks } from "@/hooks/useTracks";
import { useAudioPlayer } from "@/hooks/useContext";
import { Track } from "../types";
import { TrackList } from "../components/TrackList/Home/TrackList";

export default function LikedPage() {
  const player = useAudioPlayer();
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

  return (
    <TrackList
      tracks={likedTracks}
      liked={liked}
      toggleLike={toggleLike}
      onPlay={player.playTrack}
      onPause={player.togglePlayPause}
      currentTrackFile={player.currentTrack?.file}
      isPlaying={player.isPlaying}
    />
  );
}
