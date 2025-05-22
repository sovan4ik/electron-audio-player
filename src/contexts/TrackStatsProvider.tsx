import { createContext } from "react";
import { useTrackStats } from "@/hooks/useTrackStats";

export const TrackStatsContext = createContext<ReturnType<
  typeof useTrackStats
> | null>(null);

export const TrackStatsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const value = useTrackStats();
  return (
    <TrackStatsContext.Provider value={value}>
      {children}
    </TrackStatsContext.Provider>
  );
};
