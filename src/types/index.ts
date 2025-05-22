export type GenreKey =
  | "melodic_techno"
  | "deep_techno"
  | "tech_house"
  | "progressive_house"
  | "minimal"
  | "ambient"
  | "drum_and_bass"
  | "breakbeat"
  | "trance"
  | "hard_techno"
  | "dubstep"
  | "techno"
  | "house"
  | "deep_house"
  | "future_house"
  | "electro"
  | "psytrance"
  | "acid_techno"
  | "industrial_techno"
  | "chillout"
  | "lo_fi"
  | "synthwave"
  | "vaporwave"
  | "trap"
  | "hip_hop"
  | "trip_hop"
  | "edm"
  | "big_room"
  | "future_bass"
  | "garage"
  | "uk_bass"
  | "hardstyle"
  | "hardcore"
  | "jungle"
  | "experimental"
  | "pop"
  | "indie_pop"
  | "synth_pop"
  | "k_pop"
  | "rock"
  | "indie_rock"
  | "post_rock"
  | "alternative"
  | "metal"
  | "nu_metal"
  | "punk"
  | "reggae"
  | "ska"
  | "funk"
  | "soul"
  | "rnb"
  | "jazz"
  | "acid_jazz"
  | "blues"
  | "classical"
  | "opera"
  | "world"
  | "latin"
  | "bossa_nova"
  | "afrobeat"
  | "cumbia"
  | "reggaeton"
  | "flamenco"
  | "bollywood"
  | "folk"
  | "ethno"
  | "chillhop"
  | "downtempo"
  | "cinematic"
  | "soundtrack"
  | "unknown";

export type Track = {
  title: string;
  artists: string[];
  genres: GenreKey[];
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

export interface TrackStats {
  playCount: number;
  skipCount: number;
  liked: boolean;
  lastPlayed: number; // timestamp
  totalListenTime: number; // in seconds
}
