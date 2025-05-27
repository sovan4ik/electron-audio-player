import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { AudioPlayerProvider } from "./contexts/AudioPlayerProvider";

import "./index.css";
import { TrackStatsProvider } from "./contexts/TrackStatsProvider";
import { AppSettingsProvider } from "./contexts/AppSettingsProvider";
import { AudioAnalyserWrapper } from "./components/AudioAnalyserWrapper";
import { SearchProvider } from "./contexts/SearchProvider";
import { TrackFlagsProvider } from "./contexts/TrackFlagsProvider";
import { SearchResetOnRouteChange } from "./components/SearchBar/SearchResetOnRouteChange";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppSettingsProvider>
      <TrackFlagsProvider>
        <TrackStatsProvider>
          <AudioPlayerProvider>
            <SearchProvider>
              <AudioAnalyserWrapper>
                <HashRouter>
                  <SearchResetOnRouteChange />
                  <App />
                </HashRouter>
              </AudioAnalyserWrapper>
            </SearchProvider>
          </AudioPlayerProvider>
        </TrackStatsProvider>
      </TrackFlagsProvider>
    </AppSettingsProvider>
  </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");
