import { Track } from "@/types";
import { albums } from "../data/albums";

export function getTrackCover(track: Track): string | undefined {
  const album = albums.find((a) => a.id === track.albumId);
  return album?.cover;
}
