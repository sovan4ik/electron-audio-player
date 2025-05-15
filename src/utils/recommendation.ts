// import { Track } from "../types";

// export function getRecommendations(
//   likedGenres: Record<string, number>,
//   allTracks: Track[]
// ): Track[] {
//   const scored = allTracks.map((track) => {
//     const genreScore = likedGenres[track.genre] || 0;
//     return { ...track, score: genreScore + Math.random() * 0.5 };
//   });
//   return scored.sort((a, b) => b.score - a.score).filter((_, idx) => idx < 3);
// }
