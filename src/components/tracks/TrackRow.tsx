import {
  TableRow,
  TableCell,
  IconButton,
  Avatar,
  Box,
  Typography,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { Track } from "../../types";

interface Props {
  track: Track;
  index: number;
  liked: boolean;
  current?: boolean;
  onPlay: (track: Track) => void;
  toggleLike: (track: Track) => void;
}

export function TrackRow({
  track,
  index,
  liked,
  current,
  onPlay,
  toggleLike,
}: Props) {
  return (
    <TableRow
      hover
      onClick={() => onPlay(track)}
      selected={current}
      sx={{
        cursor: "pointer",
        backgroundColor: current ? "#2c2c2c" : "inherit",
      }}
    >
      <TableCell sx={{ color: "white" }}>{index + 1}</TableCell>
      <TableCell sx={{ color: "white" }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            variant="rounded"
            src={track.cover || "/no-cover.png"}
            alt={track.title}
            sx={{ width: 48, height: 48 }}
          />
          <Box>
            <Typography variant="body1" color="white">
              {track.title}
            </Typography>
            <Typography variant="body2" color="gray">
              {track.artist}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell sx={{ color: "white" }}>{track.artist}</TableCell>
      <TableCell sx={{ color: "white" }}>{track.genre}</TableCell>
      <TableCell align="right">
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(track);
          }}
        >
          {liked ? (
            <Favorite sx={{ color: "red" }} />
          ) : (
            <FavoriteBorder sx={{ color: "white" }} />
          )}
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
