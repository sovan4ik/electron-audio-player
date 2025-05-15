import { useCallback, useEffect, useState } from "react";

export function useLikes() {
  const [likes, setLikes] = useState<Set<string>>(new Set());

  useEffect(() => {
    window.electronAPI.loadLikes().then((list) => {
      setLikes(new Set(list));
    });
  }, []);

  const like = useCallback((track: string) => {
    setLikes((prev) => new Set(prev).add(track));
    window.electronAPI.likeTrack(track);
  }, []);

  const unlike = useCallback((track: string) => {
    setLikes((prev) => {
      const copy = new Set(prev);
      copy.delete(track);
      return copy;
    });
    window.electronAPI.unlikeTrack(track);
  }, []);

  const toggleLike = useCallback((track: string) => {
    setLikes((prev) => {
      const copy = new Set(prev);
      if (copy.has(track)) {
        copy.delete(track);
        window.electronAPI.unlikeTrack(track);
      } else {
        copy.add(track);
        window.electronAPI.likeTrack(track);
      }
      return copy;
    });
  }, []);

  return {
    likes,
    like,
    unlike,
    toggleLike,
  };
}
