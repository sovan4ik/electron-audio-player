import { useEffect, useState, useCallback, useMemo } from "react";
import { Track } from "@/types";
import { useTracks } from "./useTracks";

export function useLikes() {
  const { tracks } = useTracks();
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const genreStats = useMemo(() => {
    const stats: Record<string, number> = {};

    for (const file of liked) {
      const track = tracks.find((t) => t.file === file);
      if (track) {
        for (const genre of track.genres || []) {
          stats[genre] = (stats[genre] || 0) + 1;
        }
      }
    }

    return stats;
  }, [liked, tracks]);

  useEffect(() => {
    const load = async () => {
      const likedFromFile = await window.electronAPI.loadLikes();
      setLiked(new Set(likedFromFile));
    };

    load();
  }, []);

  const toggleLike = useCallback((track: Track) => {
    setLiked((prev) => {
      const updated = new Set(prev);
      if (updated.has(track.file)) {
        updated.delete(track.file);
      } else {
        updated.add(track.file);
      }

      window.electronAPI.saveLikes(Array.from(updated));
      return updated;
    });
  }, []);

  return {
    liked,
    genreStats,
    toggleLike,
  };
}
