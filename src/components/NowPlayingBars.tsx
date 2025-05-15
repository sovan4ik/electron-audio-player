import { Box } from "@mui/material";

export function NowPlayingBars({ active = true }: { active: boolean }) {
  const delays = ["0s", "0.12s", "0.05s", "0.22s"];
  const durations = ["1.4s", "1.6s", "1.2s", "1.5s"];

  return (
    <Box display="flex" alignItems="end" justifyContent="center" height={10}>
      {delays.map((delay, i) => (
        <Box
          key={i}
          sx={{
            width: 1,
            height: 8,
            margin: "0 2px",
            backgroundColor: "#1db954",
            animation: active
              ? `bounce-play ${durations[i]} infinite ease-in-out`
              : "none",
            animationDelay: delay,
            transformOrigin: "bottom",
          }}
        />
      ))}
    </Box>
  );
}
