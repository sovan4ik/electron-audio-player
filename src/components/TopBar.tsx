import { Box, IconButton, Tooltip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BarChartIcon from "@mui/icons-material/BarChart";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import { Link } from "react-router-dom";

export function TopBar() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
        backgroundColor: "#1c1c1c",
        borderBottom: "1px solid #333",
      }}
    >
      <Box>
        <Tooltip title="Home">
          <IconButton component={Link} to="/" sx={{ color: "white" }}>
            <LibraryMusicIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        <Tooltip title="Liked Songs">
          <IconButton component={Link} to="/liked" sx={{ color: "white" }}>
            <FavoriteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Statistics">
          <IconButton component={Link} to="/stats" sx={{ color: "white" }}>
            <BarChartIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
