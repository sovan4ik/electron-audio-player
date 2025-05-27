import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSearch } from "@/hooks/useSearch";

export function SearchResetOnRouteChange() {
  const { setSearchQuery } = useSearch();
  const location = useLocation();

  useEffect(() => {
    setSearchQuery("");
  }, [location.pathname]);

  return null;
}
