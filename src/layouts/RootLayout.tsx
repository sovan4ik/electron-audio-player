import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { TopBar } from "../components/TopBar";
import { PlayerBar } from "../components/player/PlayerBar";

import { useEffect, useRef } from "react";
import { useTracks } from "@/hooks/useTracks";
import { WaveformVisualizer } from "@/components/WaveformVisualizer";

import { useAppSettings, useAudioPlayer } from "@/hooks/useContext";
import { DynamicVisualizer } from "@/components/DynamicVisualizer";

export default function RootLayout() {
  const player = useAudioPlayer();
  const {
    volume,
    setVolume,
    lastPlayed,
    saveLastPlayed,
    isReady: isSettingsReady,
  } = useAppSettings();
  const { tracks, isTracksReady } = useTracks();

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

  // Save track position every 0.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const audio = player.audioRef.current;
      if (audio && player.currentTrack) {
        saveLastPlayed({
          file: player.currentTrack.file,
          position: audio.currentTime,
        });
      }
    }, 500);
    return () => clearInterval(interval);
  }, [player.currentTrack]);

  return (
    <Box position="relative" height="100vh" overflow="hidden">
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <DynamicVisualizer />
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        position="relative"
        zIndex={1}
      >
        <TopBar />
        <WaveformVisualizer />

        <Box flex={1} overflow="auto">
          <Outlet />
        </Box>

        {player.currentTrack && (
          <PlayerBar
            audioRef={player.audioRef}
            isPlaying={player.isPlaying}
            cover={player.currentTrack.cover}
            togglePlayPause={player.togglePlayPause}
            progress={player.progress}
            duration={player.duration}
            onSeek={player.handleSeek}
            title={player.currentTrack?.title}
            artists={player.currentTrack?.artists}
            onNext={() => player.playNext()}
            onPrev={() => player.playPrev()}
            volume={volume}
            setVolume={setVolume}
          />
        )}

        <audio
          crossOrigin="anonymous"
          ref={player.audioRef}
          onEnded={() => player.playNext()}
          onTimeUpdate={player.handleTimeUpdate}
          onLoadedMetadata={player.handleLoadedMetadata}
        />
      </Box>
    </Box>
  );
}
