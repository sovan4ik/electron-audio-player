// export interface Track {
//   title: string;
//   artist: string;
//   file: string;
//   genre: string;
//   albumId?: string;
// }

export interface Track {
  title: string;
  artists: string[];
  genres: string[];
  album: string;
  duration: number;
  cover: string;
  file: string;
}
