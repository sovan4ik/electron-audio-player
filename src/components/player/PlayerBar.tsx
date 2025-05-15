import { Box, IconButton, Slider, Typography, useTheme } from "@mui/material";
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  VolumeUp,
  VolumeOff,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { DurationProgress } from "../DurationProgress/DurationProgress";
import { useAudioProgress } from "@/hooks/useAudioProgress";
import formatDuration from "@/utils/formatDuration";

interface Props {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  togglePlayPause: () => void;
  progress: number;
  duration: number;
  onSeek: (percent: number) => void;
  title?: string;
  artists?: string[];
  onPrev: () => void;
  onNext: () => void;
  volume: number;
  setVolume: (value: number) => void;
  cover?: string; // image url (base64 or fallback)
}

export function PlayerBar({
  isPlaying,
  audioRef,
  togglePlayPause,
  // progress,
  duration,
  onSeek,
  title,
  artists,
  onPrev,
  onNext,
  volume,
  setVolume,
  cover,
}: Props) {
  const [lastVolume, setLastVolume] = useState(volume);

  const progress = useAudioProgress(audioRef);
  const theme = useTheme();

  const handleMuteToggle = () => {
    if (volume > 0) {
      setLastVolume(volume);
      setVolume(0);
    } else {
      setVolume(lastVolume || 0.5);
    }
  };

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
      {/* Track info + cover */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 200 }}
      >
        <img
          src={cover}
          alt="cover"
          width={48}
          height={48}
          style={{ objectFit: "cover", borderRadius: 4 }}
        />
        <Box>
          <Typography variant="subtitle1" color="white">
            {title || "No track playing"}
          </Typography>
          <Typography variant="body2" color="gray">
            {artists || ""}
          </Typography>
        </Box>
      </Box>

      {/* Controls */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexGrow: 1,
          maxWidth: 600,
        }}
      >
        <Box>
          <SkipPrevious onClick={onPrev} sx={{ color: "white" }} />

          <IconButton onClick={togglePlayPause} sx={{ bgcolor: "white" }}>
            {isPlaying ? (
              <Pause sx={{ color: theme.palette.primary.contrastText }} />
            ) : (
              <PlayArrow sx={{ color: theme.palette.primary.contrastText }} />
            )}
          </IconButton>

          <SkipNext onClick={onNext} sx={{ color: "white" }} />
        </Box>

        {/* <Slider
          value={progress}
          min={0}
          max={duration || 1}
          onChange={(_, val) => onSeek((val as number) / duration)}
          sx={{
            color: "#1db954",
            width: "100%",
            mt: 1,
          }}
        /> */}

        {/* <Slider
          value={dragProgress !== null ? dragProgress : progress}
          min={0}
          max={duration || 1}
          step={0.1}
          onChange={(_, val) => setDragProgress(val as number)}
          onChangeCommitted={(_, val) => {
            setDragProgress(null);
            onSeek((val as number) / duration);
          }}
          sx={{ color: "green", width: 400 }}
        /> */}

        <DurationProgress
          value={progress}
          duration={duration}
          onSeek={onSeek}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            px: 1,
          }}
        >
          <Typography variant="caption" color="gray.400">
            {formatDuration(progress)}
          </Typography>
          <Typography variant="caption" color="gray.400">
            {formatDuration(duration)}
          </Typography>
        </Box>
      </Box>

      {/* Volume */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 120 }}
      >
        <IconButton onClick={handleMuteToggle}>
          {volume > 0 ? (
            <VolumeUp sx={{ color: "white" }} />
          ) : (
            <VolumeOff sx={{ color: "white" }} />
          )}
        </IconButton>
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
