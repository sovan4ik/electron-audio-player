import { useEffect, useState, useMemo } from "react";
import { allTracks } from "./data/tracks";
import { Track } from "./types";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { getRankedTrackList } from "./utils/getRankedTrackList";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { darkTheme } from "./theme/theme";
import { PlayerBar } from "./components/player/PlayerBar";
import { TrackList } from "./components/tracks/TrackList";
import { MainLayout } from "./layouts/MainLayout";

interface LastPlayedData {
  file: string;
  position: number;
}

export default function App() {
  const player = useAudioPlayer();
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [genreStats, setGenreStats] = useState<Record<string, number>>({});
  const [volume, setVolume] = useState(0.5);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  const [lastPlayed, setLastPlayed] = useState<LastPlayedData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const likedFromFile = await window.electronAPI.loadLikes();
      const likedSet = new Set<string>(likedFromFile);
      setLiked(likedSet);

      const stats: Record<string, number> = {};
      for (const file of likedFromFile) {
        const track = allTracks.find((s) => s.file === file);
        if (track) {
          stats[track.genre] = (stats[track.genre] || 0) + 1;
        }
      }
      setGenreStats(stats);

      const last = await window.electronAPI.loadLastPlayed();
      if (last) {
        setLastPlayed(last);
        const index = allTracks.findIndex((s) => s.file === last.file);
        if (index !== -1) {
          setCurrentIndex(index);
          player.playTrack(allTracks[index], last.position);
        }
      }

      setIsReady(true);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isReady) {
      window.electronAPI.saveLikes(Array.from(liked));
    }
  }, [liked, isReady]);

  useEffect(() => {
    const audio = player.audioRef.current;
    if (!audio) return;

    const saveState = () => {
      const file = player.currentTrack?.file;
      const position = audio.currentTime;
      if (file) {
        window.electronAPI.saveLastPlayed({ file, position });
      }
    };

    audio.addEventListener("timeupdate", saveState);
    return () => audio.removeEventListener("timeupdate", saveState);
  }, [player.currentTrack]);


  useEffect(() => {
  window.electronAPI.loadVolume().then(setVolume)
}, [])

useEffect(() => {
  if (isReady) {
    window.electronAPI.saveVolume(volume)
  }
}, [volume, isReady])
  const playTrack = (track: Track, startTime = 0) => {
    const index = allTracks.findIndex((s) => s.file === track.file);
    setCurrentIndex(index);
    player.playTrack(track, startTime);
  };

  const playNext = () => {
    if (currentIndex === null) return;
    const nextIndex = (currentIndex + 1) % allTracks.length;
    const nextTrack = allTracks[nextIndex];
    setCurrentIndex(nextIndex);
    player.playTrack(nextTrack);
  };

  const playPrev = () => {
    if (currentIndex === null) return;
    const prevIndex = (currentIndex - 1 + allTracks.length) % allTracks.length;
    const prevTrack = allTracks[prevIndex];
    setCurrentIndex(prevIndex);
    player.playTrack(prevTrack);
  };

  const toggleLike = (track: Track) => {
    const newLiked = new Set(liked);
    const newGenreStats = { ...genreStats };
    if (newLiked.has(track.file)) {
      newLiked.delete(track.file);
      newGenreStats[track.genre] = (newGenreStats[track.genre] || 1) - 1;
    } else {
      newLiked.add(track.file);
      newGenreStats[track.genre] = (newGenreStats[track.genre] || 0) + 1;
    }
    setLiked(newLiked);
    setGenreStats(newGenreStats);
  };

  if (player.audioRef.current) {
    player.audioRef.current.volume = volume;
  }

  const displayTracks = useMemo(
    () => getRankedTrackList(genreStats, liked, allTracks),
    [genreStats, liked]
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <MainLayout>
        <TrackList
          title="Your Tracks"
          tracks={displayTracks}
          liked={liked}
          toggleLike={toggleLike}
          onPlay={playTrack}
          currentTrackFile={player.currentTrack?.file}
        />
      </MainLayout>

      <PlayerBar
        isPlaying={player.isPlaying}
        togglePlayPause={player.togglePlayPause}
        progress={player.progress}
        duration={player.duration}
        onSeek={player.handleSeek}
        title={player.currentTrack?.title}
        artist={player.currentTrack?.artist}
        onNext={playNext}
        onPrev={playPrev}
        volume={volume}
        setVolume={setVolume}
      />

      <audio
        ref={player.audioRef}
        src={player.currentTrack?.file}
        onEnded={playNext}
      />
    </ThemeProvider>
  );
}
