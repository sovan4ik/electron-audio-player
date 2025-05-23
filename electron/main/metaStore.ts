// ─── Load Environment Variables ──────────────────────────────────────
import * as dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Resolve the absolute path to the project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../../.env");

dotenv.config({ path: envPath });

// Validate required variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error("Supabase credentials are missing in .env file");
}

// ─── Core Imports ────────────────────────────────────────────────────
import { app } from "electron";
import fs from "fs";
import * as mm from "music-metadata";
import { createClient } from "@supabase/supabase-js";

// ─── Project-Specific Imports ────────────────────────────────────────
import { LastPlayed, PlayMode, Track, TrackStats } from "../../src/types";
import { artistGenreMap } from "../../src/data/genre";

// ─── Initialize Supabase Client ──────────────────────────────────────

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// --- Paths ---
const baseDir = app.getPath("userData");

const TRACKS_DIR = path.join(app.getAppPath(), "public/assets/tracks");

const paths = {
  meta: path.join(baseDir, "meta.json"),
  liked: path.join(baseDir, "likedTracks.json"),
  ignored: path.join(baseDir, "ignoredTracks.json"),
  trackStats: path.join(baseDir, "trackStats.json"),
  remoteCache: path.join(baseDir, "remoteMetaCache.json"),
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

const readRemoteMetaCache = (): Record<string, Track> => {
  try {
    if (!fs.existsSync(paths.remoteCache)) return {};
    return JSON.parse(fs.readFileSync(paths.remoteCache, "utf-8"));
  } catch {
    return {};
  }
};

const writeRemoteMetaCache = (data: Record<string, Track>) => {
  fs.writeFileSync(paths.remoteCache, JSON.stringify(data, null, 2));
};

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

// --- Track Stats ---
const readTrackStats = (): Record<string, TrackStats> =>
  readJson(paths.trackStats, {});

const writeTrackStats = (data: Record<string, TrackStats>) =>
  writeJson(paths.trackStats, data);

function updateTrackStats(file: string, update: Partial<TrackStats>) {
  const stats: Record<string, TrackStats> = readJson(paths.trackStats, {});
  const prev: TrackStats = stats[file] || {
    playCount: 0,
    skipCount: 0,
    lastPlayed: null,
    totalListenTime: 0,
  };

  const next: TrackStats = {
    ...prev,
    playCount: prev.playCount + (update.playCount || 0),
    skipCount: prev.skipCount + (update.skipCount || 0),
    totalListenTime: prev.totalListenTime + (update.totalListenTime || 0),
    lastPlayed: update.lastPlayed || prev.lastPlayed,
  };

  stats[file] = next;
  writeJson(paths.trackStats, stats);
}

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
    return process.env.APP_NO_COVER_IMAGE_PATH!;
  } catch (e) {
    console.error("Error reading cover:", e);
    return process.env.APP_NO_COVER_IMAGE_PATH!;
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
        const buffer = fs.readFileSync(filePath);
        const metadata = await mm.parseBuffer(buffer, "audio/mpeg");

        const artists =
          metadata.common.artists ||
          (metadata.common.artist
            ? [metadata.common.artist]
            : ["Unknown Artist"]);

        const genresFromMetadata = metadata.common.genre?.filter(Boolean) || [];

        const genresFromMap = artists
          .flatMap((artist) => artistGenreMap[artist] || [])
          .filter(Boolean);

        const allGenres = Array.from(
          new Set([...genresFromMetadata, ...genresFromMap])
        ) as Track["genres"];

        const picture = metadata.common.picture?.[0];
        const cover = picture
          ? `data:${picture.format};base64,${Buffer.from(picture.data).toString(
              "base64"
            )}`
          : process.env.APP_NO_COVER_IMAGE_PATH;

        return {
          title: metadata.common.title || file,
          artists,
          genres: allGenres.length > 0 ? allGenres : ["unknown"],
          album: metadata.common.album || "Unknown Album",
          duration: metadata.format.duration || 0,
          file: `/assets/tracks/${file}`,
          cover,
        };
      } catch (e) {
        console.error("Metadata error:", e);
        return null;
      }
    })
  );

  return tracks.filter((t): t is Track => t !== null);
}
async function loadRemoteTracksWithMetadata(): Promise<Track[]> {
  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_STORAGE_BUCKET!)
    .list(process.env.SUPABASE_STORAGE_BUCKET_SUBFOLDER!, { limit: 100 });

  if (error) {
    console.error("Supabase storage error:", error);
    return [];
  }

  const files = (data || []).filter((file) => file.name.endsWith(".mp3"));
  const cache = readRemoteMetaCache();
  let cacheChanged = false;

  const tracks = await Promise.all(
    files.map(async (file) => {
      const fileName = file.name;

      if (cache[fileName]) {
        return cache[fileName];
      }

      try {
        const titleFromName = fileName.replace(".mp3", "");

        const { publicUrl } = supabase.storage
          .from(
            `${process.env.SUPABASE_STORAGE_BUCKET}/${process.env.SUPABASE_STORAGE_BUCKET_SUBFOLDER}`
          )
          .getPublicUrl(fileName).data;

        const res = await fetch(publicUrl);
        if (!res.body) throw new Error("Failed to get response body");

        const metadata = await mm.parseWebStream(res.body, "audio/mpeg");

        const artists =
          metadata.common.artists ||
          (metadata.common.artist
            ? [metadata.common.artist]
            : ["Unknown Artist"]);

        const genresFromMetadata = metadata.common.genre?.filter(Boolean) || [];

        const genresFromMap = artists
          .flatMap((artist) => artistGenreMap[artist] || [])
          .filter(Boolean);

        const allGenres = Array.from(
          new Set([...genresFromMetadata, ...genresFromMap])
        ) as Track["genres"];

        const picture = metadata.common.picture?.[0];
        const cover = picture
          ? `data:${picture.format};base64,${Buffer.from(picture.data).toString(
              "base64"
            )}`
          : process.env.APP_NO_COVER_IMAGE_PATH!;

        const track: Track = {
          title: metadata.common.title || titleFromName,
          file: publicUrl,
          artists,
          genres: allGenres.length > 0 ? allGenres : ["unknown"],
          album: metadata.common.album || "Unknown Album",
          duration: metadata.format.duration || 300,
          cover,
        };

        cache[fileName] = track;
        cacheChanged = true;

        return track;
      } catch (e) {
        console.error("Remote metadata parse error:", e);
        return null;
      }
    })
  );

  if (cacheChanged) {
    writeRemoteMetaCache(cache);
  }

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

  // Track Stats
  readTrackStats,
  writeTrackStats,
  updateTrackStats,

  // Cover
  getCover,

  // Available tracks
  getAvailableTracks,

  // Auto-scanning and returns tracks
  loadTracksWithMetadata,
  loadRemoteTracksWithMetadata,

  // Paths (debug/logging)
  paths,
};
