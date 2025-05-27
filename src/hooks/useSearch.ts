import { useCallback, useState } from "react";

export function useSearch() {
  const [searchQuery, setSearchQueryState] = useState("");

  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
  };
}
