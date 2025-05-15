// import { allTracks } from "@/data/tracks";
// import { useEffect, useState } from "react";
// import { Track } from "@/types";

// export function useAvailableTracks() {
//   const [availableTracks, setAvailableTracks] = useState<Track[]>([]);

//   useEffect(() => {
//     window.electronAPI
//       .getAvailableTracks(allTracks)
//       .then((validTracks) => setAvailableTracks(validTracks));
//   }, []);

//   return availableTracks;
// }
