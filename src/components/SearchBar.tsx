import { useState } from 'react';
import { InputBase, Paper, IconButton } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) onSearch(query.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <motion.div
      initial={{ width: 240 }}
      whileFocus={{ width: 400 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Paper
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          borderRadius: '9999px',
          backgroundColor: '#282828',
          paddingLeft: 1,
        }}
        elevation={2}
      >
        <IconButton sx={{ p: '10px', color: 'white' }}>
          <SearchIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1, color: 'white' }}
          placeholder="Search..."
          inputProps={{ 'aria-label': 'search' }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </Paper>
    </motion.div>
  );
}
