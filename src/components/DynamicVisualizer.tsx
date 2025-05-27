import { Venturo } from "uvcanvas";
import { useAudioAnalyser, useAudioPlayer } from "@/hooks/useContext";

import { AnimatePresence, motion } from "framer-motion";

export const DynamicVisualizer = () => {
  const { bass, treble } = useAudioAnalyser();
  const { isPlaying } = useAudioPlayer();

  return (
    <AnimatePresence>
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <Venturo speed={bass / 200} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
