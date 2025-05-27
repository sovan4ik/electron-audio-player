import { useEffect, useState } from "react";

export function useAudioAnalyser(analyserRef: React.RefObject<AnalyserNode>) {
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(
    new Uint8Array(0)
  );
  const [bass, setBass] = useState(0);
  const [treble, setTreble] = useState(0);

  useEffect(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const update = () => {
      requestAnimationFrame(update);
      analyser.getByteFrequencyData(dataArray);
      setFrequencyData(new Uint8Array(dataArray));

      const bassSlice = dataArray.slice(0, bufferLength / 4);
      const trebleSlice = dataArray.slice((bufferLength * 3) / 4);
      const avg = (arr: Uint8Array) =>
        arr.reduce((a, b) => a + b, 0) / arr.length / 255;

      setBass(avg(bassSlice));
      setTreble(avg(trebleSlice));
    };

    update();
  }, [analyserRef]);

  return { frequencyData, bass, treble };
}
