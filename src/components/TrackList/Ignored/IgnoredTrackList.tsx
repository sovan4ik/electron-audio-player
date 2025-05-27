import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Track } from "../../../types";
import { IgnoredTrackRow } from "./IgnoredTrackRow";
import { Clock3 } from "lucide-react";

interface Props {
  title?: string;
  tracks: Track[];
  liked: Set<string>;
  ignored: Set<string>;
  toggleLike: (track: Track) => void;
  toggleIgnore: (track: Track) => void;
  onPlay: (track: Track) => void;
  onPause: () => void;
  currentTrackFile?: string;
  isPlaying: boolean;
}

export function IgnoredTrackList({
  title,
  tracks,
  liked,
  ignored,
  toggleLike,
  toggleIgnore,
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
            <TableCell sx={{ color: "gray", width: 300 }}>Title</TableCell>
            <TableCell sx={{ color: "gray", width: 150 }}>Album</TableCell>
            <TableCell sx={{ color: "gray", width: 150 }}>Genre</TableCell>
            <TableCell sx={{ color: "gray", width: 100 }}></TableCell>
            <TableCell
              align="center"
              size="small"
              sx={{ color: "gray", width: 60 }}
            >
              <Clock3 size={18} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tracks.map((track, index) => (
            <IgnoredTrackRow
              key={track.file}
              track={track}
              index={index}
              current={track.file === currentTrackFile}
              isPlaying={track.file === currentTrackFile && isPlaying}
              onPlay={() => onPlay(track)}
              onPause={onPause}
              liked={liked.has(track.file)}
              ignored={ignored.has(track.file)}
              toggleLike={toggleLike}
              toggleIgnore={toggleIgnore}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
