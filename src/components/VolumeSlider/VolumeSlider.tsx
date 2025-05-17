import { Box, Slider } from "@mui/material";
import { useState, useEffect } from "react";

interface Props {
  value: number; // from 0.0 to 1.0
  onChange: (volume: number) => void;
}

export function VolumeSlider({ value, onChange }: Props) {
  const [internal, setInternal] = useState(value);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setInternal(value);
  }, [value]);

  return (
    <Box
      sx={{ position: "relative", height: 32, width: 100 }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Slider
        min={0}
        max={1}
        step={0.01}
        value={internal}
        onChange={(_, val) => {
          const v = val as number;
          setInternal(v);
          onChange(v);
        }}
        sx={{
          height: 2.5,
          color: "#888",
          transition: "color 0.2s",
          "&:hover": {
            color: "#1db954",
          },
          "& .MuiSlider-thumb": {
            width: 12,
            height: 12,
            backgroundColor: "#fff",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            "&:hover": {
              boxShadow: "0 0 0 8px rgba(30, 215, 96, 0.16)",
            },
          },
          "& .MuiSlider-rail": {
            opacity: 0.3,
            backgroundColor: "#999",
          },
        }}
      />

      {showTooltip && (
        <Box
          sx={{
            position: "absolute",
            top: -24,
            left: `calc(${internal * 100}% - 12px)`,
            transform: "translateX(0%)",
            backgroundColor: "#1db954",
            color: "white",
            borderRadius: 1,
            fontSize: 12,
            px: 1,
            py: "2px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {Math.round(internal * 100)}%
        </Box>
      )}
    </Box>
  );
}
