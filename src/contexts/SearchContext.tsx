import { createContext } from "react";
import { useSearch as useSearchHook } from "@/hooks/useSearch";

export const SearchContext = createContext<ReturnType<
  typeof useSearchHook
> | null>(null);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const search = useSearchHook();

  return (
    <SearchContext.Provider value={search}>{children}</SearchContext.Provider>
  );
};
