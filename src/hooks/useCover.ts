import { useEffect, useState } from "react";
import { Track } from "../types";

const globalCoverCache = new Map<string, string>();

export function useCover(track: Track | null): string {
  const [cover, setCover] = useState(process.env.APP_NO_COVER_IMAGE_PATH!);

  useEffect(() => {
    if (!track) return;

    const path = track.file.startsWith("/")
      ? `public${track.file}`
      : track.file;

    if (globalCoverCache.has(path)) {
      setCover(globalCoverCache.get(path)!);
      return;
    }

    window.electronAPI.getCover(path).then((img) => {
      globalCoverCache.set(path, img);
      setCover(img);
    });
  }, [track?.file]);

  return cover;
}
