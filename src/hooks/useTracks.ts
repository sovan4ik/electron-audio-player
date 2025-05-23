import { useEffect, useMemo, useState } from "react";

import { Track } from "@/types";

type TrackMaps = {
  byArtist: Map<string, Track[]>;
  byGenre: Map<string, Track[]>;
  byAlbum: Map<string, Track[]>;
};

export function useTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [local = [], remote = []] = await Promise.all([
          window.electronAPI?.loadTracksWithMetadata?.(),
          window.electronAPI?.loadRemoteTracksWithMetadata?.(),
        ]);

        setTracks([...local, ...remote]);
      } catch (err) {
        console.error("Failed to load tracks:", err);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const maps: TrackMaps = useMemo(() => {
    const byArtist = new Map<string, Track[]>();
    const byGenre = new Map<string, Track[]>();
    const byAlbum = new Map<string, Track[]>();

    for (const track of tracks) {
      for (const artist of track.artists || []) {
        if (!byArtist.has(artist)) byArtist.set(artist, []);
        byArtist.get(artist)!.push(track);
      }
      for (const genre of track.genres || []) {
        if (!byGenre.has(genre)) byGenre.set(genre, []);
        byGenre.get(genre)!.push(track);
      }
      const album = track.album;
      if (album) {
        if (!byAlbum.has(album)) byAlbum.set(album, []);
        byAlbum.get(album)!.push(track);
      }
    }

    return { byArtist, byGenre, byAlbum };
  }, [tracks]);

  return { tracks, isTracksReady: ready, ...maps };
}
