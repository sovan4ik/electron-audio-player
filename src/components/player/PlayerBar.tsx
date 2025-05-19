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
import { VolumeSlider } from "../VolumeSlider/VolumeSlider";
import { Volume1, Volume2, VolumeX } from "lucide-react";

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
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flex: 1, // This ensures the left block takes equal space
        }}
      >
        <img
          src={cover}
          alt="cover"
          width={48}
          height={48}
          style={{ objectFit: "cover", borderRadius: 4 }}
        />
        <Box sx={{ overflow: "hidden", width: 180 }}>
          <Typography
            variant="subtitle1"
            color="white"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            {title || "No track playing"}
          </Typography>
          <Typography
            variant="body2"
            color="gray"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            {artists?.join(", ") || ""}
          </Typography>
        </Box>
      </Box>

      {/* Centralized controls */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 2, // This will allow the central block to take more space
          maxWidth: 600,
          mx: "auto",
          width: "100%",
        }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" gap={3}>
          <SkipPrevious
            onClick={onPrev}
            sx={{
              color: "#888888",
              cursor: "pointer",
              transition: "color 0.2s ease-in-out",
              "&:hover": {
                color: "#ffffff",
              },
            }}
          />

          <IconButton
            onClick={togglePlayPause}
            sx={{
              bgcolor: "#fff",
              width: 32,
              height: 32,
              transition:
                "background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
              "&:hover": {
                bgcolor: "#e5e5e5",
              },
              boxShadow: 4,
            }}
          >
            {isPlaying ? (
              <Pause sx={{ color: "#000", fontSize: 24 }} />
            ) : (
              <PlayArrow sx={{ color: "#000", fontSize: 24 }} />
            )}
          </IconButton>

          <SkipNext
            onClick={onNext}
            sx={{
              color: "#888888",
              cursor: "pointer",
              transition: "color 0.2s ease-in-out",
              "&:hover": {
                color: "#ffffff",
              },
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            minxWidth: "400px",
            maxWidth: "600px",
            px: 2,
            gap: 0.5,
            mt: 0.5,
          }}
        >
          <Typography fontSize={12} color="#979797" minWidth={40}>
            {formatDuration(progress)}
          </Typography>

          <Box sx={{ flex: 1, mx: 1 }}>
            <DurationProgress
              value={progress}
              duration={duration}
              onSeek={onSeek}
            />
          </Box>

          <Typography fontSize={12} color="#979797" minWidth={40}>
            {formatDuration(duration)}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 1,
          flex: 1, // This ensures the right block takes equal space
        }}
      >
        <IconButton size="small" onClick={handleMuteToggle} sx={{ p: 0.5 }}>
          {volume === 0 ? (
            <VolumeX size={18} color="white" />
          ) : volume <= 0.5 ? (
            <Volume1 size={18} color="white" />
          ) : (
            <Volume2 size={18} color="white" />
          )}
        </IconButton>

        <VolumeSlider value={volume} onChange={setVolume} />
      </Box>
    </Box>
  );
}
