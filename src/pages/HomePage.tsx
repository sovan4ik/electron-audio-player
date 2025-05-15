import { useEffect, useState, useMemo } from "react";
import { allTracks } from "../data/tracks";
import { getRankedTrackList } from "../utils/getRankedTrackList";
import { Track } from "../types";
import { TrackList } from "../components/tracks/TrackList";
import { useAudioPlayerContext } from "@/contexts/AudioPlayerProvider";

export default function HomePage() {
  const player = useAudioPlayerContext();
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [genreStats, setGenreStats] = useState<Record<string, number>>({});

  useEffect(() => {
    const load = async () => {
      const likedFromFile = await window.electronAPI.loadLikes();
      const likedSet = new Set(likedFromFile);
      setLiked(likedSet);

      const stats: Record<string, number> = {};
      likedFromFile.forEach((file) => {
        const track = allTracks.find((t) => t.file === file);
        if (track) {
          stats[track.genre] = (stats[track.genre] || 0) + 1;
        }
      });
      setGenreStats(stats);
    };
    load();
  }, []);

  const displayTracks = useMemo(
    () => getRankedTrackList(genreStats, liked, allTracks),
    [genreStats, liked]
  );

  const toggleLike = (track: Track) => {
    const newLiked = new Set(liked);
    const newStats = { ...genreStats };
    if (newLiked.has(track.file)) {
      newLiked.delete(track.file);
      newStats[track.genre] = (newStats[track.genre] || 1) - 1;
    } else {
      newLiked.add(track.file);
      newStats[track.genre] = (newStats[track.genre] || 0) + 1;
    }
    setLiked(newLiked);
    setGenreStats(newStats);
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
      tracks={displayTracks}
      liked={liked}
      toggleLike={toggleLike}
      onPlay={playTrack}
      onPause={pauseTrack}
      currentTrackFile={player.currentTrack?.file}
      isPlaying={player.isPlaying}
    />
  );
}
