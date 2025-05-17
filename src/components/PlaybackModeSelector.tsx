import { IconButton, Tooltip, Fade } from "@mui/material";
import { Repeat, Shuffle, Sparkles } from "lucide-react";
import { usePlayMode } from "@/hooks/usePlayMode";
import { PlayMode } from "@/types";

const icons = {
  normal: <Repeat />,
  shuffle: <Shuffle />,
  smartShuffle: <Sparkles />,
};

const labels: Record<PlayMode, string> = {
  normal: "Normal playback",
  shuffle: "Shuffle mode",
  smartShuffle: "Smart Shuffle (based on genres)",
};

const nextMode: Record<PlayMode, PlayMode> = {
  normal: PlayMode.Shuffle,
  shuffle: PlayMode.SmartShuffle,
  smartShuffle: PlayMode.Normal,
};

export function PlaybackModeSelector() {
  const { mode, setMode } = usePlayMode();

  const handleClick = () => {
    const next = nextMode[mode];
    setMode(next);
  };

  return (
    <Tooltip title={labels[mode]} arrow TransitionComponent={Fade}>
      <IconButton
        onClick={handleClick}
        sx={{
          color: "white",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
      >
        {icons[mode]}
      </IconButton>
    </Tooltip>
  );
}
