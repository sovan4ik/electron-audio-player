import { createContext } from "react";
import { useTrackFlags as useTrackFlagsHook } from "@/hooks/useTrackFlags";
import { Track } from "@/types";

interface TrackFlagsContextType {
  liked: Set<string>;
  ignored: Set<string>;
  toggleLike: (track: Track) => void;
  toggleIgnore: (track: Track) => void;
  genreStats: Record<string, number>;
}

export const TrackFlagsContext = createContext<TrackFlagsContextType | null>(
  null
);

export function TrackFlagsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useTrackFlagsHook();
  return (
    <TrackFlagsContext.Provider value={value}>
      {children}
    </TrackFlagsContext.Provider>
  );
}
