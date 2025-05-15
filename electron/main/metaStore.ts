import { app } from "electron";
import fs from "fs";
import path from "path";
import * as mm from "music-metadata";

// --- Paths ---
const baseDir = app.getPath("userData");

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
  lastPlayed?: { file: string; position: number };
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

  // Cover
  getCover,

  // Paths (debug/logging)
  paths,
};
