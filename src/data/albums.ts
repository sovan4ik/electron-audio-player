import { Track } from "../types";

export interface Album {
  id: string;
  title: string;
  artist: string;
  cover: string;
  year: number;
  genre: string;
  tracks: Track[];
}

export const albums: Album[] = [
  {
    id: "boris-gravity",
    title: "Gravity",
    artist: "Boris Brejcha",
    cover: "/assets/covers/boris-gravity.jpg",
    year: 2020,
    genre: "high_tech_minimal",
    tracks: [
      {
        title: "Gravity",
        artist: "Boris Brejcha",
        file: "/assets/tracks/gravity.mp3",
        genre: "high_tech_minimal",
        albumId: "boris-gravity",
      },
    ],
  },
  {
    id: "boris-purple",
    title: "Purple Noise",
    artist: "Boris Brejcha",
    cover: "/assets/covers/boris-purple.jpg",
    year: 2019,
    genre: "high_tech_minimal",
    tracks: [
      {
        title: "Purple Noise",
        artist: "Boris Brejcha",
        file: "/assets/tracks/purple_noise.mp3",
        genre: "high_tech_minimal",
        albumId: "boris-purple",
      },
    ],
  },
  {
    id: "boris-space-diver",
    title: "Space Diver",
    artist: "Boris Brejcha",
    cover: "/assets/covers/boris-space-diver.jpg",
    year: 2020,
    genre: "high_tech_minimal",
    tracks: [
      {
        title: "Space Diver",
        artist: "Boris Brejcha",
        file: "/assets/tracks/space_diver.mp3",
        genre: "high_tech_minimal",
        albumId: "boris-space-diver",
      },
    ],
  },
  {
    id: "taleofus-endless",
    title: "Endless",
    artist: "Tale Of Us",
    cover: "/assets/covers/taleofus-endless.jpg",
    year: 2017,
    genre: "melodic_techno",
    tracks: [
      {
        title: "Nova Two",
        artist: "Tale Of Us",
        file: "/assets/tracks/nova_two.mp3",
        genre: "melodic_techno",
        albumId: "taleofus-endless",
      },
      {
        title: "Endless",
        artist: "Tale Of Us",
        file: "/assets/tracks/endless.mp3",
        genre: "melodic_techno",
        albumId: "taleofus-endless",
      },
      {
        title: "Distante",
        artist: "Tale Of Us",
        file: "/assets/tracks/distante.mp3",
        genre: "melodic_techno",
        albumId: "taleofus-endless",
      },
    ],
  },
  {
    id: "nirvana-nevermind",
    title: "Nevermind",
    artist: "Nirvana",
    cover: "/assets/covers/nirvana-nevermind.jpg",
    year: 1991,
    genre: "rock",
    tracks: [
      {
        title: "Smells Like Teen Spirit",
        artist: "Nirvana",
        file: "/assets/tracks/smells_like_teen_spirit.mp3",
        genre: "rock",
        albumId: "nirvana-nevermind",
      },
    ],
  },
  {
    id: "rhcp-californication",
    title: "Californication",
    artist: "Red Hot Chili Peppers",
    cover: "/assets/covers/rhcp-californication.jpg",
    year: 1999,
    genre: "rock",
    tracks: [
      {
        title: "Californication",
        artist: "Red Hot Chili Peppers",
        file: "/assets/tracks/californication.mp3",
        genre: "rock",
        albumId: "rhcp-californication",
      },
    ],
  },
  {
    id: "queen-a-night-at-the-opera",
    title: "A Night at the Opera",
    artist: "Queen",
    cover: "/assets/covers/queen-a-night-at-the-opera.jpg",
    year: 1975,
    genre: "rock",
    tracks: [
      {
        title: "Bohemian Rhapsody",
        artist: "Queen",
        file: "/assets/tracks/bohemian_rhapsody.mp3",
        genre: "rock",
        albumId: "queen-a-night-at-the-opera",
      },
    ],
  },
];
