/* ========= src/renderer/components/player/PlayerBar.tsx ========= */

import { Box, Grid, IconButton, Slider, Typography } from "@mui/material";
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  VolumeUp,
} from "@mui/icons-material";

interface Props {
  isPlaying: boolean;
  togglePlayPause: () => void;
  progress: number;
  duration: number;
  onSeek: (percent: number) => void;
  title?: string;
  artist?: string;
  onPrev: () => void;
  onNext: () => void;
  volume: number;
  setVolume: (value: number) => void;
}

export function PlayerBar({
  isPlaying,
  togglePlayPause,
  progress,
  duration,
  onSeek,
  title,
  artist,
  onPrev,
  onNext,
  volume,
  setVolume,
}: Props) {
  const format = (n: number) =>
    `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, "0")}`;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        px: 3,
        py: 1.5,
        bgcolor: "#181818",
        borderTop: "1px solid #333",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 3,
      }}
    >
      {/* Track info (left) */}
      <Box sx={{ minWidth: 200 }}>
        <Typography variant="subtitle1" color="white">
          {title || "No track playing"}
        </Typography>
        <Typography variant="body2" color="gray">
          {artist || ""}
        </Typography>
      </Box>

      {/* Controls (center) */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexGrow: 1,
        }}
      >
        <Box>
          <IconButton onClick={onPrev} sx={{ color: "white" }}>
            <SkipPrevious />
          </IconButton>
          <IconButton onClick={togglePlayPause} sx={{ color: "white" }}>
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton onClick={onNext} sx={{ color: "white" }}>
            <SkipNext />
          </IconButton>
        </Box>
        <Slider
          value={progress}
          max={duration || 1}
          onChange={(_, val) => onSeek((val as number) / duration)}
          sx={{ color: "green", width: 400 }}
        />
        <Box
          sx={{ display: "flex", justifyContent: "space-between", width: 400 }}
        >
          <Typography variant="caption" color="gray.400">
            {format(progress)}
          </Typography>
          <Typography variant="caption" color="gray.400">
            {format(duration)}
          </Typography>
        </Box>
      </Box>

      {/* Volume (right) */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <VolumeUp sx={{ color: "white" }} />
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(_, val) => setVolume(val as number)}
          sx={{ width: 100, color: "white" }}
        />
      </Box>
    </Box>
  );
}
