import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { TopBar } from "../components/TopBar";
import { PlayerBar } from "../components/player/PlayerBar";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { useAudioPlayerContext } from "@/contexts/AudioPlayerProvider";
import { useEffect, useState } from "react";
import { allTracks } from "@/data/tracks";
import { useCover } from "@/hooks/useCover";

export default function RootLayout() {
  const player = useAudioPlayerContext();
  const cover = useCover(player.currentTrack);
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
          volume={player.targetVolume}
          setVolume={player.setTargetVolume}
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
