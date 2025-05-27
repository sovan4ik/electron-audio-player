import { useEffect, useRef, useState } from "react";
import { useAudioPlayer } from "@/hooks/useContext";
import { useAudioAnalyser } from "@/hooks/useContext";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  height?: number;
}

export function WaveformVisualizer({ height = 150 }: Props) {
  const player = useAudioPlayer();
  const { frequencyData } = useAudioAnalyser();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasWidth, setCanvasWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const canvasParent = canvasRef.current?.parentElement;
      if (canvasParent) {
        setCanvasWidth(canvasParent.clientWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvasWidth === 0 || frequencyData.length === 0) return;

    canvas.width = canvasWidth;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const draw = () => {
      animationId = requestAnimationFrame(draw);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "#00c6ff");
      gradient.addColorStop(1, "#ff5c93");

      const barWidth = 4;
      const gap = 2;
      const totalBars = Math.floor(canvas.width / (barWidth + gap));
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.fillStyle = gradient;

      for (let i = 0; i < totalBars / 2; i++) {
        const index = Math.floor((i / (totalBars / 2)) * frequencyData.length);
        const value = frequencyData[index] / 255;
        const barHeight = value * centerY;

        const xL = centerX - (i + 1) * (barWidth + gap);
        const xR = centerX + i * (barWidth + gap);

        ctx.fillRect(xL, centerY - barHeight, barWidth, barHeight * 2);
        ctx.fillRect(xR, centerY - barHeight, barWidth, barHeight * 2);
      }
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [frequencyData, canvasWidth, height]);

  return (
    <div style={{ position: "relative", width: "100%", height: `${height}px` }}>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
        }}
      />
      <AnimatePresence>
        {player.targetVolume === 1 && (
          <motion.img
            key="koala-overlay"
            src="/assets/images/koala.png"
            alt="Overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              width: "75%",
              height: "75%",
              objectFit: "contain",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              maxWidth: "20%",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
