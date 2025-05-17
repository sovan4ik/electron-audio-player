import { app } from "electron";
import fs from "fs";
import path from "path";
import * as mm from "music-metadata";
import { LastPlayed, PlayMode, Track } from "../../src/types";

// --- Paths ---
const baseDir = app.getPath("userData");

const TRACKS_DIR = path.join(app.getAppPath(), "public/assets/tracks");

const paths = {
  meta: path.join(baseDir, "meta.json"),
  liked: path.join(baseDir, "likedTracks.json"),
  ignored: path.join(baseDir, "ignoredTracks.json"),
};

// --- Helpers ---
const readJson = <T>(file: string, fallback: T): T => {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return fallback;
  }
};

const writeJson = (file: string, data: any) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

const readList = (file: string): string[] => readJson(file, []);
const writeList = (file: string, list: string[]) => writeJson(file, list);

// --- Meta ---
type MetaData = {
  volume?: number;
  lastPlayed?: LastPlayed;
  playMode?: PlayMode;
};

const readMeta = (): MetaData => readJson(paths.meta, {});
const updateMeta = (partial: Partial<MetaData>) =>
  writeJson(paths.meta, { ...readMeta(), ...partial });

const getMetaValue = <K extends keyof MetaData>(key: K): MetaData[K] =>
  readMeta()[key];

const setMetaValue = <K extends keyof MetaData>(key: K, value: MetaData[K]) =>
  updateMeta({ [key]: value });

// --- Cover extraction ---
async function getCover(filePath: string): Promise<string> {
  try {
    const buffer = fs.readFileSync(filePath);
    const metadata = await mm.parseBuffer(buffer, "audio/mpeg");
    const picture = metadata.common.picture?.[0];
    if (picture) {
      const base64 = Buffer.from(picture.data).toString("base64");
      return `data:${picture.format};base64,${base64}`;
    }
    return "/assets/images/no-cover.png";
  } catch (e) {
    console.error("Error reading cover:", e);
    return "/assets/images/no-cover.png";
  }
}

async function getAvailableTracks(tracks: Track[]): Promise<Track[]> {
  return tracks.filter((track: { file: string }) =>
    fs.existsSync(path.join(process.env.VITE_PUBLIC!, track.file))
  );
}

async function loadTracksWithMetadata(): Promise<Track[]> {
  const files = fs.readdirSync(TRACKS_DIR).filter((f) => f.endsWith(".mp3"));

  const tracks = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(TRACKS_DIR, file);
      try {
        const metadata = await mm.parseFile(filePath);
        return {
          title: metadata.common.title || file,
          artists:
            metadata.common.artists ||
            (metadata.common.artist
              ? [metadata.common.artist]
              : ["Unknown Artist"]),
          genres: metadata.common.genre || [],
          album: metadata.common.album || "Unknown Album",
          duration: metadata.format.duration || 0,
          file: `/assets/tracks/${file}`,
          cover: await getCover(filePath),
        };
      } catch (e) {
        console.error("Metadata error:", e);
        return null;
      }
    })
  );

  return tracks.filter((t): t is Track => t !== null);
}
// --- Exported API ---
export const metaStore = {
  // Meta
  getVolume: () => getMetaValue("volume") ?? 0.5,
  setVolume: (v: number) => setMetaValue("volume", v),

  getLastPlayed: () => getMetaValue("lastPlayed") ?? null,
  setLastPlayed: (data: { file: string; position: number }) =>
    setMetaValue("lastPlayed", data),

  // Liked
  getLiked: () => readList(paths.liked),
  setLiked: (list: string[]) => writeList(paths.liked, list),
  addLiked: (track: string) => {
    const current = readList(paths.liked);
    if (!current.includes(track)) {
      writeList(paths.liked, [...current, track]);
    }
  },
  removeLiked: (track: string) => {
    const current = readList(paths.liked);
    writeList(
      paths.liked,
      current.filter((t) => t !== track)
    );
  },
  toggleLiked: (track: string) => {
    const current = readList(paths.liked);
    if (current.includes(track)) {
      writeList(
        paths.liked,
        current.filter((t) => t !== track)
      );
    } else {
      writeList(paths.liked, [...current, track]);
    }
  },

  // Ignored
  getIgnored: () => readList(paths.ignored),
  setIgnored: (list: string[]) => writeList(paths.ignored, list),
  addIgnored: (track: string) => {
    const current = readList(paths.ignored);
    if (!current.includes(track)) {
      writeList(paths.ignored, [...current, track]);
    }
  },
  removeIgnored: (track: string) => {
    const current = readList(paths.ignored);
    writeList(
      paths.ignored,
      current.filter((t) => t !== track)
    );
  },
  toggleIgnored: (track: string) => {
    const current = readList(paths.ignored);
    if (current.includes(track)) {
      writeList(
        paths.ignored,
        current.filter((t) => t !== track)
      );
    } else {
      writeList(paths.ignored, [...current, track]);
    }
  },

  getPlayMode: () => getMetaValue("playMode") ?? PlayMode.Normal,
  setPlayMode: (mode: PlayMode) => setMetaValue("playMode", mode),

  // Cover
  getCover,

  // Available tracks
  getAvailableTracks,

  // Auto-scanning and returns tracks
  loadTracksWithMetadata,

  // Paths (debug/logging)
  paths,
};
