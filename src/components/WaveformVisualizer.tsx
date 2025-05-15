import React, { useRef, useEffect } from "react";

interface WaveformVisualizerProps {
  audioSrc: string;
  width?: number;
  height?: number;
  barColor?: string;
  backgroundColor?: string;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  audioSrc,
  width = 800,
  height = 200,
  barColor = "#1db954",
  backgroundColor = "#000000",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationIdRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const audio = audioRef.current;
    if (!canvas || !audio) return;

    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const source = audioContext.createMediaElementSource(audio);
    const analyser = audioContext.createAnalyser();

    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) return;

    const draw = () => {
      animationIdRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = backgroundColor;
      canvasCtx.fillRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height;
        canvasCtx.fillStyle = barColor;
        canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      analyser.disconnect();
      source.disconnect();
      audioContext.close();
    };
  }, [audioSrc, width, height, barColor, backgroundColor]);

  return (
    <div>
      <audio ref={audioRef} src={audioSrc} controls />
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};

export default WaveformVisualizer;
