import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { TopBar } from "../components/TopBar";
import { PlayerBar } from "../components/player/PlayerBar";
import { useAudioPlayerContext } from "@/contexts/AudioPlayerProvider";
import { useCover } from "@/hooks/useCover";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useEffect, useRef } from "react";
import { useTracks } from "@/hooks/useTracks";

export default function RootLayout() {
  const player = useAudioPlayerContext();
  const { tracks, isTracksReady } = useTracks();
  const {
    volume,
    setVolume,
    lastPlayed,
    saveLastPlayed,
    isReady: isSettingsReady,
  } = useAppSettings();

  const cover = useCover(player.currentTrack);
  const initialized = useRef(false);

  // Set the volume in the player after loading
  useEffect(() => {
    if (isSettingsReady) {
      console.log("[FORCE APPLY VOLUME]", volume);
      player.setTargetVolume(volume);
    }
  }, [isSettingsReady, volume]);

  // Load the last played track (without autoplay)
  useEffect(() => {
    if (!initialized.current && isSettingsReady && isTracksReady) {
      if (lastPlayed) {
        const found = tracks.find((t) => t.file === lastPlayed.file);
        if (found) {
          player.loadTrack(found, lastPlayed.position);
        }
      }
      initialized.current = true;
    }
  }, [isSettingsReady, isTracksReady, lastPlayed, tracks]);

  // Save track position every 1.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const audio = player.audioRef.current;
      if (audio && player.currentTrack) {
        saveLastPlayed({
          file: player.currentTrack.file,
          position: audio.currentTime,
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [player.currentTrack]);

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <TopBar />
      <Box flex={1} overflow="auto">
        <Outlet />
      </Box>

      {player.currentTrack && (
        <PlayerBar
          audioRef={player.audioRef}
          isPlaying={player.isPlaying}
          cover={cover}
          togglePlayPause={player.togglePlayPause}
          progress={player.progress}
          duration={player.duration}
          onSeek={player.handleSeek}
          title={player.currentTrack?.title}
          artists={player.currentTrack?.artists}
          onNext={() => player.playNext(tracks)}
          onPrev={() => player.playPrev(tracks)}
          volume={volume}
          setVolume={setVolume}
        />
      )}

      <audio
        ref={player.audioRef}
        onEnded={() => player.playNext(tracks)}
        onTimeUpdate={player.handleTimeUpdate}
        onLoadedMetadata={player.handleLoadedMetadata}
      />
    </Box>
  );
}
