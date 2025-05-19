import { createContext, useContext } from "react";
import { useTrackStats } from "@/hooks/useTrackStats";

const TrackStatsContext = createContext<ReturnType<
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

export const useTrackStatsContext = () => {
  const ctx = useContext(TrackStatsContext);
  if (!ctx)
    throw new Error(
      "useTrackStatsContext must be used within TrackStatsProvider"
    );
  return ctx;
};
