export {};

declare global {
  interface Window {
    electronAPI: {
      // Meta
      loadVolume: () => Promise<number>;
      saveVolume: (v: number) => void;

      loadLastPlayed: () => Promise<{ file: string; position: number } | null>;
      saveLastPlayed: (data: { file: string; position: number }) => void;

      // Likes
      loadLikes: () => Promise<string[]>;
      saveLikes: (list: string[]) => void;
      likeTrack: (track: string) => void;
      unlikeTrack: (track: string) => void;
      toggleLike: (track: string) => void;

      // Ignored
      loadIgnored: () => Promise<string[]>;
      saveIgnored: (list: string[]) => void;
      ignoreTrack: (track: string) => void;
      unignoreTrack: (track: string) => void;
      toggleIgnore: (track: string) => void;

      // Cover
      getCover: (filePath: string) => Promise<string>;
    };
  }
}
