import { Chip } from "@mui/material";
import { genreColorMap } from "@/data/genreColorMap";
import { GenreKey } from "@/types";

export const GenreChip = ({ genre }: { genre: GenreKey }) => {
  const genreData = genreColorMap[genre];

  if (!genreData) return null;

  return (
    <Chip
      label={genreData.label}
      style={{
        backgroundColor: genreData.color,
        color: "white",
        fontWeight: 500,
      }}
      size="small"
    />
  );
};
