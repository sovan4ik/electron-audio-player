import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Track } from "../../../types";
import { TrackRow } from "./TrackRow";
import { Clock3 } from "lucide-react";

interface Props {
  title?: string;
  tracks: Track[];
  liked: Set<string>;
  toggleLike: (track: Track) => void;
  onPlay: (track: Track) => void;
  onPause: () => void;
  currentTrackFile?: string;
  isPlaying: boolean;
}

export function TrackList({
  title,
  tracks,
  liked,
  toggleLike,
  // ignored,
  // toggleIgnore,
  onPlay,
  onPause,

  currentTrackFile,
  isPlaying,
}: Props) {
  return (
    <div>
      {title && (
        <Typography variant="h6" color="white" sx={{ mb: 2 }}>
          {title}
        </Typography>
      )}
      <Table sx={{ minWidth: 650, mb: "40px" }}>
        <TableHead>
          <TableRow>
            <TableCell align="center" size="small" sx={{ color: "gray" }}>
              #
            </TableCell>
            <TableCell sx={{ color: "gray" }}>Title</TableCell>
            <TableCell sx={{ color: "gray" }}>Album</TableCell>
            <TableCell sx={{ color: "gray" }}>Genre</TableCell>
            <TableCell sx={{ color: "gray" }}></TableCell>
            <TableCell size="small" sx={{ color: "gray" }}>
              <Clock3 size={18} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tracks.map((track, index) => (
            <TrackRow
              key={track.file}
              track={track}
              index={index}
              current={track.file === currentTrackFile}
              isPlaying={track.file === currentTrackFile && isPlaying}
              onPlay={() => onPlay(track)}
              onPause={() => onPause()}
              liked={liked.has(track.file)}
              toggleLike={() => toggleLike(track)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
