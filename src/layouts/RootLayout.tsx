import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { TopBar } from "../components/TopBar";
import { PlayerBar } from "../components/player/PlayerBar";
import { useAudioPlayerContext } from "@/contexts/AudioPlayerProvider";
import { useCover } from "@/hooks/useCover";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useEffect, useRef } from "react";
import { allTracks } from "@/data/tracks";

export default function RootLayout() {
  const player = useAudioPlayerContext();
  const { volume, setVolume, lastPlayed, saveLastPlayed, isReady } =
    useAppSettings();
  const cover = useCover(player.currentTrack);
  const initialized = useRef(false);

  // Set the volume in the player after loading
  useEffect(() => {
    if (isReady) {
      console.log("[FORCE APPLY VOLUME]", volume);
      player.setTargetVolume(volume);
    }
  }, [isReady, volume]);

  // Load the last played track (without autoplay)
  useEffect(() => {
    if (!initialized.current && isReady && lastPlayed) {
      const found = allTracks.find((t) => t.file === lastPlayed.file);
      if (found) {
        player.loadTrack(found, lastPlayed.position);
      }
      initialized.current = true;
    }
  }, [isReady, lastPlayed]);

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
    }, 1500);
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
          cover={cover}
          isPlaying={player.isPlaying}
          togglePlayPause={player.togglePlayPause}
          progress={player.progress}
          duration={player.duration}
          onSeek={player.handleSeek}
          title={player.currentTrack?.title}
          artist={player.currentTrack?.artist}
          onNext={() => player.playNext(allTracks)}
          onPrev={() => player.playPrev(allTracks)}
          volume={volume}
          setVolume={setVolume}
        />
      )}

      <audio
        ref={player.audioRef}
        onEnded={() => player.playNext(allTracks)}
        onTimeUpdate={player.handleTimeUpdate}
        onLoadedMetadata={player.handleLoadedMetadata}
      />
    </Box>
  );
}
