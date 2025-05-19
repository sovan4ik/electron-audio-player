import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { AudioPlayerProvider } from "./contexts/AudioPlayerProvider";

import "./index.css";
import { TrackStatsProvider } from "./contexts/TrackStatsProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TrackStatsProvider>
      <AudioPlayerProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </AudioPlayerProvider>
    </TrackStatsProvider>
  </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");
