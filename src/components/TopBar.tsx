import { Box, IconButton, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import { PlaybackModeSelector } from "./PlaybackModeSelector";
import { Heart, BarChart2, Music, CircleMinus } from "lucide-react";
import SearchBar from "./SearchBar/SearchBar";
import { useSearch } from "@/hooks/useContext";

export function TopBar() {
  const { setSearchQuery } = useSearch();
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
      {/* Left block */}
      <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
        <Tooltip title="Home">
          <IconButton component={Link} to="/" sx={{ color: "white" }}>
            <Music size={20} />
          </IconButton>
        </Tooltip>
        <PlaybackModeSelector />
      </Box>

      {/* Center block */}
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <SearchBar onSearch={setSearchQuery} />
      </Box>

      {/* Right block */}
      <Box
        sx={{ flex: 1, display: "flex", justifyContent: "flex-end", gap: 1 }}
      >
        <Tooltip title="Ignored Songs">
          <IconButton component={Link} to="/ignored" sx={{ color: "white" }}>
            <CircleMinus size={20} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Liked Songs">
          <IconButton component={Link} to="/liked" sx={{ color: "white" }}>
            <Heart size={20} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Statistics">
          <IconButton component={Link} to="/stats" sx={{ color: "white" }}>
            <BarChart2 size={20} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
