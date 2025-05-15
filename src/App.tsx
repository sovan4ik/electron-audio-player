import { Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { darkTheme } from "./theme/theme";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import LikedPage from "./pages/LikedPage";
import StatisticsPage from "./pages/StatisticsPage";

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="liked" element={<LikedPage />} />
          <Route path="stats" element={<StatisticsPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
