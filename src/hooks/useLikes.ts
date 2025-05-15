import { useEffect, useState, useCallback } from "react";
import { Track } from "@/types";
import { useTracks } from "./useTracks";

export function useLikes() {
  const { tracks } = useTracks();
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [genreStats, setGenreStats] = useState<Record<string, number>>({});

  useEffect(() => {
    const load = async () => {
      const likedFromFile = await window.electronAPI.loadLikes();
      const likedSet = new Set(likedFromFile);
      setLiked(likedSet);

      const stats: Record<string, number> = {};

      for (const file of likedFromFile) {
        const track = tracks.find((t) => t.file === file);
        if (track) {
          for (const genre of track.genres || []) {
            stats[genre] = (stats[genre] || 0) + 1;
          }
        }
      }

      setGenreStats(stats);
    };

    load();
  }, [tracks]);

  const toggleLike = useCallback(
    (track: Track) => {
      const genres = track.genres || [];

      setLiked((prev) => {
        const updated = new Set(prev);
        const updatedStats = { ...genreStats };

        if (updated.has(track.file)) {
          updated.delete(track.file);
          for (const genre of genres) {
            updatedStats[genre] = (updatedStats[genre] || 1) - 1;
            if (updatedStats[genre] <= 0) delete updatedStats[genre];
          }
        } else {
          updated.add(track.file);
          for (const genre of genres) {
            updatedStats[genre] = (updatedStats[genre] || 0) + 1;
          }
        }

        setGenreStats(updatedStats);
        window.electronAPI.saveLikes(Array.from(updated));
        return updated;
      });
    },
    [genreStats]
  );

  return {
    liked,
    genreStats,
    toggleLike,
  };
}
