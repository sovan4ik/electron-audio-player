import {
  Avatar,
  Box,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import PlayArrow from "@mui/icons-material/PlayArrow";
import Pause from "@mui/icons-material/Pause";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useState } from "react";
import { Track } from "../../types";
import { NowPlayingBars } from "../NowPlayingBars";
import { useCover } from "@/hooks/useCover";
import formatDuration from "@/utils/formatDuration";

interface TrackRowProps {
  track: Track;
  index: number;
  current: boolean;
  isPlaying: boolean;
  onPlay: (track: Track) => void;
  onPause: (track: Track) => void;
  liked: boolean;
  toggleLike: (track: Track) => void;
}

export function TrackRow({
  track,
  index,
  current,
  isPlaying,
  onPlay,
  onPause,
  liked,
  toggleLike,
}: TrackRowProps) {
  const [hovered, setHovered] = useState(false);
  // const cover = useCover(track);

  const handlePlay = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (current) {
      onPause(track);
    } else {
      onPlay(track);
    }
  };

  const isActive = current && isPlaying;
  const isPaused = current && !isPlaying;

  return (
    <TableRow
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        backgroundColor: "transparent",
        transition: "background-color 0.3s ease",
        // cursor: "pointer",
        ":hover": {
          backgroundColor: "#2a2a2a",
        },
      }}
    >
      <TableCell align="center" size="small" sx={{ width: 50, border: 0 }}>
        {hovered && current && isPlaying ? (
          <Tooltip title={`Pause ${track.title}`}>
            <Pause
              onClick={handlePlay}
              sx={{ color: "white", cursor: "pointer" }}
              fontSize="small"
            />
          </Tooltip>
        ) : hovered && (!current || !isPlaying) ? (
          <Tooltip title={`Play ${track.title}`}>
            <PlayArrow
              onClick={handlePlay}
              sx={{ color: "white", cursor: "pointer" }}
              fontSize="small"
            />
          </Tooltip>
        ) : isActive ? (
          <NowPlayingBars active />
        ) : isPaused ? (
          <Typography sx={{ color: "#a259ff" }}>{index + 1}</Typography>
        ) : (
          <Typography sx={{ color: "white" }}>{index + 1}</Typography>
        )}
      </TableCell>

      {/* Title & Artist */}
      <TableCell align="left" sx={{ color: "white" }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            variant="rounded"
            src={track.cover || "/no-cover.png"}
            alt={track.title}
            sx={{ width: 48, height: 48 }}
          />
          <Box>
            <Tooltip title={track.title} placement="top">
              <Typography
                variant="body1"
                sx={{
                  color: isActive || isPaused ? "#a259ff" : "white",
                  // fontWeight: isActive ? 500 : 400,
                }}
              >
                {track.title}
              </Typography>
            </Tooltip>

            <Typography
              variant="body2"
              sx={{
                color: hovered ? "#bbbbbb" : "gray",
              }}
            >
              {track.artists.join(", ")}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      <TableCell align="left" sx={{ color: "white" }}>
        {track.album}
      </TableCell>
      <TableCell align="left" sx={{ color: "white" }}>
        {track.genres.join(", ")}
      </TableCell>
      <TableCell align="left">
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(track);
          }}
        >
          {liked ? (
            <FavoriteIcon sx={{ color: "#a259ff" }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: "white" }} />
          )}
        </IconButton>
      </TableCell>
      <TableCell align="left" sx={{ color: "white" }}>
        {formatDuration(track.duration)}
      </TableCell>
    </TableRow>
  );
}
