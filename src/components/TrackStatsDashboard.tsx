import React, { useEffect, useMemo, useState } from "react";
import { Box, Grid, Typography, Divider, styled, Paper } from "@mui/material";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TracksStatsMap, useTrackStats } from "@/hooks/useTrackStats";
import { useTracks } from "@/hooks/useTracks";
import { Track } from "@/types";
import { useAudioPlayerContext } from "@/contexts/AudioPlayerProvider";
import { useTrackStatsContext } from "@/contexts/TrackStatsProvider";

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function TrackStatsDashboard() {
  const { audioRef } = useAudioPlayerContext();
  const { tracks, isTracksReady } = useTracks();
  const { stats } = useTrackStatsContext();
  const map = new Map(tracks.map((track) => [track.file, track]));

  const data = Object.entries(stats).map(([path, stat]) => {
    const track = map.get(path);
    const name = path.split("/").pop()?.replace(".mp3", "") || path;

    return {
      key: path,
      name: `${track?.title} - ${track?.artists.join(", ")}`,
      artist: track?.artists?.[0] || "Unknown",
      genre: track?.genres?.[0] || "Other",
      album: track?.album || "Unknown",
      ...stat,
    };
  });
  console.log("Dashboard stats:", stats);

  if (!isTracksReady) return <div>Loading tracks...</div>;

  // Create a map for quick search of a track by file name

  const totalTracks = data.length;
  const totalPlays = data.reduce((acc, d) => acc + d.playCount, 0);
  const totalSkips = data.reduce((acc, d) => acc + d.skipCount, 0);
  console.log("DATA =>", data);

  const totalTime = data.reduce((acc, d) => acc + d.totalListenTime, 0);

  console.log(
    "TOTAL TIME CHECK:",
    totalTime,
    data.map((d) => d.totalListenTime)
  );

  const genreStats = data.reduce((acc, d) => {
    if (!acc[d.genre]) {
      acc[d.genre] = { genre: d.genre, Plays: 0, Skips: 0 };
    }
    acc[d.genre].Plays += d.playCount;
    acc[d.genre].Skips += d.skipCount;
    return acc;
  }, {} as Record<string, { genre: string; Plays: number; Skips: number }>);

  const radarData = Object.values(genreStats);

  const latestTracks = data
    .filter((t) => !!t.lastPlayed)
    .sort(
      (a, b) =>
        new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime()
    )
    .slice(0, 5);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={8}>
          <Item>
            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {[
                {
                  label: "TOTAL TRACKS",
                  value: totalTracks,
                },
                {
                  label: "TOTAL PLAYS",
                  value: totalPlays,
                },
                {
                  label: "TOTAL SKIPS",
                  value: totalSkips,
                },
                {
                  label: "LISTEN TIME",
                  value: formatTime(totalTime),
                },
              ].map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    flex: "1 1 200px",
                    borderRadius: 2,
                    border: "1px solid #ff2cc3",
                    boxShadow: "0 0 15px #ff2cc3",
                    textAlign: "center",
                    p: 2,
                    background: "linear-gradient(to bottom, #1a1a2e, #0f0c29)",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#ff2cc3", mb: 1 }}
                  >
                    {item.label}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box>
              {latestTracks.map((track, index) => (
                <Box
                  key={index}
                  sx={{
                    py: 1,
                    borderBottom:
                      index < latestTracks.length - 1
                        ? "1px solid #333"
                        : "none",
                  }}
                >
                  <Typography variant="body1" sx={{ color: "#fff" }}>
                    {track.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#999" }}>
                    Last played: {new Date(track.lastPlayed).toISOString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Item>
        </Grid>
        <Grid size={4}>
          <Item>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: 500,
                height: 500,
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#4c4cff" />
                  <PolarAngleAxis dataKey="genre" stroke="#fff" />
                  <PolarRadiusAxis stroke="#888" />
                  <Radar
                    name="Plays"
                    dataKey="Plays"
                    stroke="#ff2cc3"
                    fill="#ff2cc3"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Skips"
                    dataKey="Skips"
                    stroke="#8e2de2"
                    fill="#8e2de2"
                    fillOpacity={0.3}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#222",
                      borderRadius: 6,
                      border: "none",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Box>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
