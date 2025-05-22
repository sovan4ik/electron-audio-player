import { Track } from "@/types";

export function getSmartShuffledTracks(
  tracks: Track[],
  liked: Set<string>,
  genreStats: Record<string, number>
): Track[] {
  const likedTracks: Track[] = [];
  const others: Track[] = [];

  for (const track of tracks) {
    if (liked.has(track.file)) {
      likedTracks.push(track);
    } else {
      others.push(track);
    }
  }

  const sortedOthers = others
    .map((track) => {
      const score = (track.genres || []).reduce(
        (sum, genre) => sum + (genreStats[genre] || 0),
        0
      );
      return { ...track, _score: score };
    })
    .sort((a, b) => b._score - a._score)
    .map(({ _score, ...track }) => track);

  return [...likedTracks.slice(0, 3), ...sortedOthers];
}
