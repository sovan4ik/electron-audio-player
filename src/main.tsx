import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { AudioPlayerProvider } from "./contexts/AudioPlayerProvider";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AudioPlayerProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </AudioPlayerProvider>
  </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");
