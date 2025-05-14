import { Track } from "../types";

export function getRankedTrackList(
  likedGenres: Record<string, number>,
  likedTracks: Set<string>,
  allTracks: Track[]
): Track[] {
  return allTracks
    .map((track) => {
      const genreWeight = likedGenres[track.genre] || 0;
      const likedWeight = likedTracks.has(track.file) ? 10 : 0;
      const noise = Math.random() * 0.05;
      const weight = genreWeight + likedWeight + noise;

      return { ...track, weight };
    })
    .sort((a, b) => b.weight - a.weight);
}
