import { useEffect, useMemo, useState } from "react";
import { InputBase, Paper, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import debounce from "lodash.debounce";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState("");

  const debouncedSearch = useMemo(
    () => debounce((value: string) => onSearch(value), 300),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(query);
    return debouncedSearch.cancel;
  }, [query]);

  const handleSearch = () => {
    if (query.trim()) onSearch(query.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <motion.div
      initial={{ width: 240 }}
      whileFocus={{ width: 400 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Paper
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          borderRadius: "9999px",
          backgroundColor: "#282828",
          // paddingLeft: 1,
        }}
        elevation={2}
      >
        <IconButton sx={{ color: "white" }}>
          <Search size={16} />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1, color: "white" }}
          placeholder="Search..."
          inputProps={{ "aria-label": "search" }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <IconButton
            sx={{ color: "white" }}
            onClick={() => {
              setQuery("");
              onSearch("");
            }}
          >
            <X size={16} />
          </IconButton>
        )}
      </Paper>
    </motion.div>
  );
}
