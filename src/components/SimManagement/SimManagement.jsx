import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingComponent from "../CommonComponents/LoadingComponts";
import {
  Box,
  ThemeProvider,
  createTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  TablePagination,
  Grid,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import FileSaver from "file-saver";
import XLSX from "json2xls";
import jsPDF from "jspdf";
import exportExcelIcon from "../../img/Import Excel.svg";
import exportPdfIcon from "../../img/Export PDF.svg";

const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(14 57 115 / 86%)",
    },
  },
});

export default function SimManagement() {
  const [openRowIndex, setOpenRowIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestList, setRequestList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRowClick = (index) => {
    setOpenRowIndex(openRowIndex === index ? null : index);
  };

  useEffect(() => {
    // Replace with your actual API endpoint
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.example.com/requests");
        setRequestList(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onExcelDownload = (index) => {
    showData(index, "excel");
  };

  const onPdfDownload = (index) => {
    showData(index, "pdf");
  };

  const showData = async (index, exportType) => {
    const selectedRow = requestList[index];
    if (exportType === "excel") {
      exportToExcel(selectedRow);
    } else if (exportType === "pdf") {
      exportToPdf(selectedRow);
    }
  };

  const exportToExcel = (data) => {
    const xlsData = data.details.map((detail) => ({
      "Device IMEI": detail.deviceimei,
      ICCID: detail.iccid,
      "Old Exp Date": detail.oldexpdate,
      "New Exp Date": detail.newexpdate,
    }));
    const xls = XLSX(xlsData);
    const blob = new Blob([xls], { type: "application/vnd.ms-excel" });
    FileSaver.saveAs(blob, `Request_${data.requestcode}.xlsx`);
  };

  const exportToPdf = (data) => {
    const doc = new jsPDF();
    doc.text(`Request Code: ${data.requestcode}`, 10, 10);
    doc.text(`Total Device: ${data.totaldevice}`, 10, 20);
    doc.text(`Renew Date: ${data.renewdate}`, 10, 30);
    doc.text(`Renewed By: ${data.renewby}`, 10, 40);

    data.details.forEach((detail, index) => {
      const y = 50 + index * 10;
      doc.text(`Device IMEI: ${detail.deviceimei}`, 10, y);
      doc.text(`ICCID: ${detail.iccid}`, 60, y);
      doc.text(`Old Exp Date: ${detail.oldexpdate}`, 110, y);
      doc.text(`New Exp Date: ${detail.newexpdate}`, 160, y);
    });

    doc.save(`Request_${data.requestcode}.pdf`);
  };

  return (
    <div className="main_container">
      <LoadingComponent isLoading={loading} />
      <Box className="main">
        <ThemeProvider theme={theme}>
          <Grid container>
            <Grid item sm={12}>
              <h1>inputfild</h1>
            </Grid>
            <Grid item sm={12}>
              <Paper sx={{ width: "100%", mb: 2 }} elevation={1}>
                <TableContainer component={Paper} elevation={1}>
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: "rgb(14 57 115 / 86%)",
                        }}
                      >
                        <TableCell sx={{ color: "white" }}>Sl No.</TableCell>
                        <TableCell sx={{ color: "white" }}>
                          Request Code
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          Total Device
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          Renew Date
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          Renewed By
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>Action</TableCell>
                        <TableCell sx={{ color: "white" }}>
                          download EXEL
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          download PDF
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {requestList.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            No data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        requestList
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, index) => (
                            <React.Fragment key={index}>
                              <TableRow>
                                <TableCell>
                                  {page * rowsPerPage + index + 1}
                                </TableCell>
                                <TableCell>{row.requestcode}</TableCell>
                                <TableCell>{row.totaldevice}</TableCell>
                                <TableCell>{row.renewdate}</TableCell>
                                <TableCell>{row.renewby}</TableCell>
                                <TableCell>
                                  <IconButton
                                    onClick={() => handleRowClick(index)}
                                  >
                                    {openRowIndex === index ? (
                                      <KeyboardArrowUp />
                                    ) : (
                                      <KeyboardArrowDown />
                                    )}
                                  </IconButton>
                                </TableCell>
                                <TableCell>
                                  <div onClick={() => onExcelDownload(index)}>
                                    <img
                                      src={exportExcelIcon}
                                      alt="export excel button"
                                    ></img>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div onClick={() => onPdfDownload(index)}>
                                    <img
                                      src={exportPdfIcon}
                                      alt="export pdf button"
                                    ></img>
                                  </div>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  colSpan={12}
                                  style={{ paddingBottom: 0, paddingTop: 0 }}
                                >
                                  <Collapse
                                    in={openRowIndex === index}
                                    timeout="auto"
                                    unmountOnExit
                                  >
                                    <Box margin={1}>
                                      <Table size="small">
                                        <TableHead>
                                          <TableRow
                                            sx={{
                                              backgroundColor:
                                                "rgb(14 57 115 / 86%)",
                                            }}
                                          >
                                            <TableCell sx={{ color: "white" }}>
                                              Device IMEI
                                            </TableCell>
                                            <TableCell sx={{ color: "white" }}>
                                              ICCID
                                            </TableCell>
                                            <TableCell sx={{ color: "white" }}>
                                              Old Exp date
                                            </TableCell>
                                            <TableCell sx={{ color: "white" }}>
                                              New Exp date
                                            </TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {row.details.map(
                                            (detail, detailIndex) => (
                                              <TableRow key={detailIndex}>
                                                <TableCell>
                                                  {detail.deviceimei}
                                                </TableCell>
                                                <TableCell>
                                                  {detail.iccid}
                                                </TableCell>
                                                <TableCell>
                                                  {detail.oldexpdate}
                                                </TableCell>
                                                <TableCell>
                                                  {detail.newexpdate}
                                                </TableCell>
                                              </TableRow>
                                            )
                                          )}
                                        </TableBody>
                                      </Table>
                                    </Box>
                                  </Collapse>
                                </TableCell>
                              </TableRow>
                            </React.Fragment>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={requestList.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </Grid>
          </Grid>
        </ThemeProvider>
      </Box>
    </div>
  );
}
