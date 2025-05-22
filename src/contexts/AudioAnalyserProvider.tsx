// import {
//   createContext,
//   useContext,
//   useRef,
//   useState,
//   useEffect,
//   PropsWithChildren,
// } from "react";

// interface AudioAnalyserContextValue {
//   bass: number;
//   treble: number;
// }

// const AudioAnalyserContext = createContext<AudioAnalyserContextValue>({
//   bass: 0,
//   treble: 0,
// });

// export function AudioAnalyserProvider({
//   audioRef,
//   children,
// }: PropsWithChildren<{ audioRef: React.RefObject<HTMLAudioElement> }>) {
//   const [bass, setBass] = useState(0);
//   const [treble, setTreble] = useState(0);
//   const analyserRef = useRef<AnalyserNode | null>(null);
//   const animationRef = useRef<number>();

//   useEffect(() => {
//     if (!audioRef.current || analyserRef.current) return;

//     const audioCtx = new AudioContext();
//     const analyser = audioCtx.createAnalyser();
//     const source = audioCtx.createMediaElementSource(audioRef.current);

//     source.connect(analyser);
//     analyser.connect(audioCtx.destination);
//     analyser.fftSize = 256;

//     const bufferLength = analyser.frequencyBinCount;
//     const dataArray = new Uint8Array(bufferLength);

//     const getAvg = (fromHz: number, toHz: number) => {
//       const sampleRate = audioCtx.sampleRate;
//       const hzPerBin = (sampleRate / 2) / bufferLength;
//       const from = Math.floor(fromHz / hzPerBin);
//       const to = Math.ceil(toHz / hzPerBin);
//       const range = dataArray.slice(from, to);
//       const avg = range.reduce((a, b) => a + b, 0) / range.length;
//       return avg / 255;
//     };

//     const update = () => {
//       analyser.getByteFrequencyData(dataArray);
//       setBass(getAvg(20, 250));
//       setTreble(getAvg(4000, 16000));
//       animationRef.current = requestAnimationFrame(update);
//     };

//     update();
//     analyserRef.current = analyser;

//     return () => {
//       cancelAnimationFrame(animationRef.current!);
//       analyser.disconnect();
//       source.disconnect();
//       audioCtx.close();
//     };
//   }, [audioRef]);

//   return (
//     <AudioAnalyserContext.Provider value={{ bass, treble }}>
//       {children}
//     </AudioAnalyserContext.Provider>
//   );
// }

// export function useAudioAnalyser() {
//   return useContext(AudioAnalyserContext);
// }
