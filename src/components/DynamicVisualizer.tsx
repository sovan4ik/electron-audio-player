import { Lumiflex, Novatrix, Tranquiluxe } from "uvcanvas";
import { useAudioAnalyser } from "@/hooks/useContext";

function getVisualizerColor(
  bass: number,
  treble: number
): [number, number, number] {
  const r = Math.min(255, Math.floor(200 + bass * 55));
  const g = Math.min(255, Math.floor(100 + treble * 155));
  const b = Math.min(255, Math.floor(180 + (1 - treble) * 75));

  return [r, g, b];
}

export const DynamicVisualizer = () => {
  const { bass, treble } = useAudioAnalyser();

  return (
    <></>
    // <Lumiflex
    //   // key={`lumiflex-${Math.floor(bass * 100)}-${Math.floor(treble * 100)}`}
    // // <Novatrix
    // // <Tranquiluxe
    //   color={getVisualizerColor(bass, treble)}
    //   // color={[124,252,100]}
    //   // style={{
    //   //   width: "100%",
    //   //   height: "100%",
    //   //   position: "absolute",
    //   //   top: 0,
    //   //   left: 0,
    //   //   pointerEvents: "none",
    //   //   zIndex: 0,
    //   // }}
    //   // key={`viz-${Math.floor(bass * 100)}-${Math.floor(treble * 100)}`}
    //   // speed={0.5 + bass * 2}
    //   // color={[treble, bass, 1 - treble]}
    //   // color={getVisualizerColor(bass, treble)}
    //   // style={{
    //   //   width: "100%",
    //   //   height: "100%",
    //   //   position: "absolute",
    //   //   top: 0,
    //   //   left: 0,
    //   //   pointerEvents: "none",
    //   //   zIndex: 0,
    //   // }}
    // />
  );
};
