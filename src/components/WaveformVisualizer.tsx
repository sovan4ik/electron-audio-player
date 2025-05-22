import { useAudioPlayer } from "@/hooks/useContext";
import { useEffect, useRef, useState } from "react";

interface Props {
  audioRef: React.RefObject<HTMLAudioElement>;
  height?: number;
}

export function WaveformVisualizer({ audioRef, height = 150 }: Props) {
  const player = useAudioPlayer();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
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
    const audio = audioRef.current;
    if (!canvas || !audio || canvasWidth === 0) return;

    canvas.width = canvasWidth;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!audioCtxRef.current) {
      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      analyser.fftSize = 128;

      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;
    }

    const analyser = analyserRef.current!;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let animationId: number;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

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
        const index = Math.floor((i / (totalBars / 2)) * bufferLength);
        const value = dataArray[index] / 255;
        const barHeight = value * centerY;

        const xL = centerX - (i + 1) * (barWidth + gap);
        const xR = centerX + i * (barWidth + gap);

        ctx.fillRect(xL, centerY - barHeight, barWidth, barHeight * 2);
        ctx.fillRect(xR, centerY - barHeight, barWidth, barHeight * 2);
      }
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [audioRef, canvasWidth, height]);

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
      {player.targetVolume === 1 ? (
        <img
          src="/public/assets/images/koala.png"
          alt="Overlay"
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
      ) : null}
    </div>
  );
}
