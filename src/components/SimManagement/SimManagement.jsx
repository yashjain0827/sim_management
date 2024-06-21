import React, { useState } from "react";
import LoadingComponent from "../CommonComponents/LoadingComponts";
import { Box, ThemeProvider, createTheme } from "@mui/material";
const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(14 57 115 / 86%)",
    },
  },
});
export default function SimManagement() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="main_container">
      <LoadingComponent isLoading={loading} />
      <Box className="main">
        <ThemeProvider theme={theme}>
          <h1>hiiii</h1>
        </ThemeProvider>
      </Box>
    </div>
  );
}
