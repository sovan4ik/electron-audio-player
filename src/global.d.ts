export {};

declare global {
  interface Window {
    electronAPI: {
      saveLikes: (data: string[]) => void;
      loadLikes: () => Promise<string[]>;
      saveLastPlayed: (data: { file: string; position: number }) => void;
      loadLastPlayed: () => Promise<{ file: string; position: number } | null>;
      saveVolume: (volume: number) => void;
      loadVolume: () => Promise<number>;
    };
  }
}
