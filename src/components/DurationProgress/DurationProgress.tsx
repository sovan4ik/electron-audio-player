import { Box, Slider, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  duration: number;
  onSeek: (percent: number) => void;
}

export function DurationProgress({ value, duration, onSeek }: Props) {
  const [internal, setInternal] = useState(value);
  const [dragging, setDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const format = (n: number) =>
    `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, "0")}`;

  useEffect(() => {
    if (!dragging) {
      setInternal(value);
    }
  }, [value, dragging]);

  return (
    <Box sx={{ position: "relative", width: "100%", mt: 1 }}>
      <Slider
        value={internal}
        min={0}
        max={duration || 1}
        step={0.1}
        onChange={(_, val) => {
          setInternal(val as number);
          if (!dragging) setDragging(true);
          setShowTooltip(true);
        }}
        onChangeCommitted={(_, val) => {
          setDragging(false);
          setShowTooltip(false);
          setInternal(val as number);
          onSeek((val as number) / duration);
        }}
        sx={{
          height: 4,
          color: "#a259ff",
          "& .MuiSlider-thumb": {
            width: 12,
            height: 12,
            backgroundColor: "#fff",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            "&:hover": {
              boxShadow: "0 0 0 8px rgba(156, 30, 215, 0.16)",
            },
          },
          "& .MuiSlider-rail": {
            opacity: 0.3,
            backgroundColor: "#999",
          },
        }}
      />

      {/* Tooltip */}
      {showTooltip && (
        <Box
          sx={{
            position: "absolute",
            top: -24,
            left: `${(internal / duration) * 100}%`,
            transform: "translateX(-50%)",
            backgroundColor: "#a259ff",
            color: "white",
            borderRadius: 1,
            fontSize: 12,
            px: 1,
            py: "2px",
            pointerEvents: "none",
          }}
        >
          {format(internal)}
        </Box>
      )}
    </Box>
  );
}
