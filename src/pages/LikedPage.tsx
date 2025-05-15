import { useEffect, useState } from "react";
import { allTracks } from "../data/tracks";
import { Track } from "../types";
import { TrackList } from "../components/tracks/TrackList";
import { useAudioPlayerContext } from "@/contexts/AudioPlayerProvider";

export default function LikedPage() {
const player = useAudioPlayerContext();
  const [liked, setLiked] = useState<Set<string>>(new Set());

  useEffect(() => {
    const load = async () => {
      const likedFromFile = await window.electronAPI.loadLikes();
      setLiked(new Set(likedFromFile));
    };
    load();
  }, []);

  const likedTracks = allTracks.filter((track) => liked.has(track.file));

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

  return (
    <TrackList
      tracks={likedTracks}
      liked={liked}
      toggleLike={toggleLike}
      onPlay={playTrack}
      currentTrackFile={player.currentTrack?.file}
    />
  );
}
