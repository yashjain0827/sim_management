import React, { useState } from "react";
import LoadingComponent from "../CommonComponents/LoadingComponts";
import { Box, Button, ThemeProvider, createTheme } from "@mui/material";
import ImportExcel from "./ImportExcel";

const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(14 57 115 / 86%)",
    },
  },
});

export default function SimManagement() {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const ExcelImportModal = () => {
    setOpenModal(true);
  };

  const closeExcelImportModal = () => {
    setOpenModal(false);
  };

  return (
    <div className="main_container">
      <LoadingComponent isLoading={loading} />
      <Box className="main">
        <ThemeProvider theme={theme}>
          <Button onClick={ExcelImportModal}>import excel</Button>
          <ImportExcel
            openModal={openModal}
            setOpenModal={setOpenModal}
            closeExcelImportModal={closeExcelImportModal}
          />
        </ThemeProvider>
      </Box>
    </div>
  );
}
