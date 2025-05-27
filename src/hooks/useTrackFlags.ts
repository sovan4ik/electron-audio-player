import { useEffect, useMemo, useState, useCallback } from "react";
import { Track } from "@/types";
import { useTracks } from "./useTracks";

export function useTrackFlags() {
  const { tracks } = useTracks();
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [ignored, setIgnored] = useState<Set<string>>(new Set());

  useEffect(() => {
    const load = async () => {
      const likedFromFile = await window.electronAPI.loadLikes();
      const ignoredFromFile = await window.electronAPI.loadIgnored();
      setLiked(new Set(likedFromFile));
      setIgnored(new Set(ignoredFromFile));
    };
    load();
  }, []);

  const toggleLike = useCallback(
    (track: Track) => {
      setLiked((prevLiked) => {
        const updatedLiked = new Set(prevLiked);
        const updatedIgnored = new Set(ignored);

        if (updatedLiked.has(track.file)) {
          updatedLiked.delete(track.file);
        } else {
          updatedLiked.add(track.file);
          updatedIgnored.delete(track.file);
          setIgnored(updatedIgnored);
          window.electronAPI.saveIgnored(Array.from(updatedIgnored));
        }

        window.electronAPI.saveLikes(Array.from(updatedLiked));
        return updatedLiked;
      });
    },
    [ignored]
  );

  const toggleIgnore = useCallback(
    (track: Track) => {
      setIgnored((prevIgnored) => {
        const updatedIgnored = new Set(prevIgnored);
        const updatedLiked = new Set(liked);

        if (updatedIgnored.has(track.file)) {
          updatedIgnored.delete(track.file);
        } else {
          updatedIgnored.add(track.file);
          updatedLiked.delete(track.file);
          setLiked(updatedLiked);
          window.electronAPI.saveLikes(Array.from(updatedLiked));
        }

        window.electronAPI.saveIgnored(Array.from(updatedIgnored));
        return updatedIgnored;
      });
    },
    [liked]
  );

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

  return {
    liked,
    ignored,
    toggleLike,
    toggleIgnore,
    genreStats,
  };
}
