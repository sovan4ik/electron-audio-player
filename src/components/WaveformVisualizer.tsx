import { useEffect, useRef } from "react";

interface Props {
  audioRef: React.RefObject<HTMLAudioElement>;
  width?: number;
  height?: number;
}

export function WaveformVisualizer({
  audioRef,
  width = 600,
  height = 150,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const audio = audioRef.current;
    if (!canvas || !audio) return;
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

      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, "#00c6ff");
      gradient.addColorStop(1, "#ff5c93");

      const barWidth = 4;
      const gap = 2;
      const totalBars = Math.floor(width / (barWidth + gap));
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.fillStyle = gradient;

      for (let i = 0; i < totalBars / 2; i++) {
        const index = Math.floor((i / (totalBars / 2)) * bufferLength);
        const value = dataArray[index] / 255;
        const barHeight = value * centerY;

        // Left side
        const xL = centerX - (i + 1) * (barWidth + gap);
        ctx.fillRect(xL, centerY - barHeight, barWidth, barHeight * 2);

        // Right side
        const xR = centerX + i * (barWidth + gap);
        ctx.fillRect(xR, centerY - barHeight, barWidth, barHeight * 2);
      }
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [audioRef, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        display: "block",
        margin: "0 auto",
        backgroundColor: "transparent",
      }}
    />
  );
}
