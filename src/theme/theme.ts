import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    primary: {
      main: "#1db954",
    },
    secondary: {
      main: "#535bf2",
    },
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
  },
});
