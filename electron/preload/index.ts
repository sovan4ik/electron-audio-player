import { PlayMode, Track, TrackStats } from "@/types";
import { ipcRenderer, contextBridge } from "electron";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args)
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },
});

contextBridge.exposeInMainWorld("electronAPI", {
  // Meta
  loadVolume: (): Promise<number> => ipcRenderer.invoke("load-volume"),
  saveVolume: (v: number): void => ipcRenderer.send("save-volume", v),

  loadLastPlayed: (): Promise<{ file: string; position: number } | null> =>
    ipcRenderer.invoke("load-last-played"),
  saveLastPlayed: (data: { file: string; position: number }): void =>
    ipcRenderer.send("save-last-played", data),

  // Likes
  loadLikes: (): Promise<string[]> => ipcRenderer.invoke("load-likes"),
  saveLikes: (list: string[]): void => ipcRenderer.send("save-likes", list),
  likeTrack: (track: string): void => ipcRenderer.send("like-track", track),
  unlikeTrack: (track: string): void => ipcRenderer.send("unlike-track", track),
  toggleLike: (track: string): void => ipcRenderer.send("toggle-like", track),

  // Ignored
  loadIgnored: (): Promise<string[]> => ipcRenderer.invoke("load-ignored"),
  saveIgnored: (list: string[]): void => ipcRenderer.send("save-ignored", list),
  ignoreTrack: (track: string): void => ipcRenderer.send("ignore-track", track),
  unignoreTrack: (track: string): void =>
    ipcRenderer.send("unignore-track", track),
  toggleIgnore: (track: string): void =>
    ipcRenderer.send("toggle-ignore", track),

  // Play mode
  loadPlayMode: (): Promise<PlayMode> => ipcRenderer.invoke("load-play-mode"),
  savePlayMode: (mode: PlayMode): void =>
    ipcRenderer.send("save-play-mode", mode),

  // Track stats
  loadTrackStats: (): Promise<Record<string, TrackStats>> =>
    ipcRenderer.invoke("load-track-stats"),
  saveTrackStats: (stats: Record<string, TrackStats>) =>
    ipcRenderer.send("save-track-stats", stats),

  updateTrackStats: (file: string, update: Partial<TrackStats>) =>
    ipcRenderer.send("update-track-stats", { file, update }),

  // Cover
  getCover: (filePath: string): Promise<string> =>
    ipcRenderer.invoke("get-cover", filePath),

  // Available tracks
  getAvailableTracks: (tracks: Track[]) =>
    ipcRenderer.invoke("get-available-tracks", tracks),

  // Auto-scanning and returns tracks
  loadTracksWithMetadata: (): Promise<Track[]> =>
    ipcRenderer.invoke("load-tracks-with-metadata"),

  loadRemoteTracksWithMetadata: (): Promise<Track[]> =>
    ipcRenderer.invoke("load-remote-tracks-with-metadata"),
});

// --------- Preload scripts loading ---------
function domReady(
  condition: DocumentReadyState[] = ["complete", "interactive"]
) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener("readystatechange", () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      return parent.appendChild(child);
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find((e) => e === child)) {
      return parent.removeChild(child);
    }
  },
};

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const className = `loaders-css__square-spin`;
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
  const oStyle = document.createElement("style");
  const oDiv = document.createElement("div");

  oStyle.id = "app-loading-style";
  oStyle.innerHTML = styleContent;
  oDiv.className = "app-loading-wrap";
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    },
  };
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);

window.onmessage = (ev) => {
  ev.data.payload === "removeLoading" && removeLoading();
};

setTimeout(removeLoading, 4999);
