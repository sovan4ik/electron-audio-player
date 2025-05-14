import { Box, CssBaseline } from "@mui/material";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#121212",
        paddingBottom: "96px",
      }}
    >
      <CssBaseline />
      {children}
    </Box>
  );
}
