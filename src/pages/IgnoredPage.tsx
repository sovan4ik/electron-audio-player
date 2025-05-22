import { useEffect, useState } from "react";
import { useTracks } from "@/hooks/useTracks";
import { useAudioPlayer } from "@/hooks/useContext";
import { Track } from "../types";
import { TrackList } from "../components/TrackList/Home/TrackList";

export default function IgnoredPage() {
  const player = useAudioPlayer();
  const { tracks } = useTracks();
  const [ignored, setIgnored] = useState<Set<string>>(new Set());

  useEffect(() => {
    const load = async () => {
      const ignoredFromFile = await window.electronAPI.loadIgnored();
      setIgnored(new Set(ignoredFromFile));
    };
    load();
  }, []);

  const ignoredTracks = Array.from(ignored)
    .map((file) => tracks.find((track) => track.file === file))
    .filter((track) => track !== undefined)
    .reverse();

  const toggleIgnore = (track: Track) => {
    const newIgnored = new Set(ignored);
    if (newIgnored.has(track.file)) {
      newIgnored.delete(track.file);
    } else {
      newIgnored.add(track.file);
    }
    setIgnored(newIgnored);
    window.electronAPI.saveIgnored(Array.from(newIgnored));
  };

  const playTrack = (track: Track) => {
    player.playTrack(track);
  };

  const pauseTrack = () => {
    player.togglePlayPause();
  };

  return (
    <>wait</>
    // <TrackList
    //   tracks={ignoredTracks}
    //   // ignored={ignored}
    //   // toggleIgnore={toggleIgnore}
    //   onPlay={playTrack}
    //   onPause={pauseTrack}
    //   currentTrackFile={player.currentTrack?.file}
    //   isPlaying={player.isPlaying}
    // />
  );
}
