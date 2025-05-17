export type Track = {
  title: string;
  artists: string[];
  genres: string[];
  album: string;
  duration: number;
  cover: string;
  file: string;
};

export type LastPlayed = {
  file: string;
  position: number;
};

export enum PlayMode {
  Normal = "normal",
  Shuffle = "shuffle",
  SmartShuffle = "smartShuffle",
}
