





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
import { useEffect, useState } from "react";
import { Track } from "../../types";
import { NowPlayingBars } from "../NowPlayingBars";
import { useCover } from "@/hooks/useCover";

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
  const cover = useCover(track);

  return (
    <TableRow
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        backgroundColor: current ? "#2a2a2a" : "transparent",
        transition: "background-color 0.2s",
      }}
      hover
      onClick={() => onPlay(track)}
    >
      {/* Left: play index or icon */}
      <TableCell sx={{ color: "white", width: 50 }}>
        {current && hovered ? (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onPause(track);
            }}
            size="small"
          >
            <Pause sx={{ color: "white" }} fontSize="small" />
          </IconButton>
        ) : current ? (
          <NowPlayingBars active={isPlaying} />
        ) : hovered ? (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onPlay(track);
            }}
            size="small"
          >
            <PlayArrow sx={{ color: "white" }} fontSize="small" />
          </IconButton>
        ) : (
          index + 1
        )}
      </TableCell>

      {/* Middle: title + artist */}
      <TableCell sx={{ color: "white" }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            variant="rounded"
            src={cover || "/no-cover.png"}
            alt={track.title}
            sx={{ width: 48, height: 48 }}
          />
          <Box>
            <Tooltip title={track.title} placement="top">
              <Typography variant="body1" color="white">
                {track.title}
              </Typography>
            </Tooltip>

            <Typography variant="body2" color="gray">
              {track.artist}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell sx={{ color: "white" }}>{track.artist}</TableCell>
      <TableCell sx={{ color: "white" }}>{track.genre}</TableCell>
      {/* Right: like button */}
      <TableCell align="right">
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(track);
          }}
        >
          {liked ? (
            <FavoriteIcon sx={{ color: "#1db954" }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: "white" }} />
          )}
        </IconButton>
      </TableCell>
    </TableRow>
  );
}



