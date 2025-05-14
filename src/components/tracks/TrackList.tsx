import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Track } from "../../types";
import { TrackRow } from "./TrackRow";

interface Props {
  title?: string;
  tracks: Track[];
  liked: Set<string>;
  toggleLike: (track: Track) => void;
  onPlay: (track: Track) => void;
  currentTrackFile?: string;
}

export function TrackList({
  title,
  tracks,
  liked,
  toggleLike,
  onPlay,
  currentTrackFile,
}: Props) {
  return (
    <div>
      {title && (
        <Typography variant="h6" color="white" sx={{ mb: 2 }}>
          {title}
        </Typography>
      )}
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "gray" }}>#</TableCell>
            <TableCell sx={{ color: "gray" }}>Title</TableCell>
            <TableCell sx={{ color: "gray" }}>Artist</TableCell>
            <TableCell sx={{ color: "gray" }}>Genre</TableCell>
            <TableCell sx={{ color: "gray" }} align="right">
              Like
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tracks.map((track, index) => (
            <TrackRow
              key={track.file}
              track={track}
              index={index}
              liked={liked.has(track.file)}
              current={currentTrackFile === track.file}
              onPlay={onPlay}
              toggleLike={toggleLike}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
