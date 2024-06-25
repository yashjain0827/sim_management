import React, { useState, useEffect, useCallback } from "react";
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
  TextField,
  Button,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import exportExcelIcon from "../../img/Import Excel.svg";
import exportPdfIcon from "../../img/Import PDF.svg";
import importExcelIcon from "../../img/Export Excel.svg";

import debounce from "lodash/debounce";
import { styled } from "@mui/material/styles";
import ImportExcel from "./ImportExcel";
import { SimManagementAction } from "../actions/simManagement";

const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(14 57 115 / 86%)",
    },
  },
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "rgb(14 57 115 / 86%)",
  color: "white",
}));

const fetchRequests = async (page, rowsPerPage, searchParams) => {
  try {
    const payload = {
      pageNo: page,
      pageSize: rowsPerPage,
      fromDate: searchParams.fromdate,
      toDate: searchParams.todate,
      search: searchParams.requestcode,
    };
    const response = await SimManagementAction.getAllSimManagement(payload);

    return response;
  } catch (error) {
    console.error("Error fetching data", error);
    throw error;
  }
};

const ExportButtons = ({ index, onExcelDownload, onPdfDownload }) => (
  <>
    <IconButton
      onClick={() => onExcelDownload(index)}
      aria-label="Export to Excel"
    >
      <img src={exportExcelIcon} alt="Export to Excel" />
    </IconButton>
    <IconButton onClick={() => onPdfDownload(index)} aria-label="Export to PDF">
      <img src={exportPdfIcon} alt="Export to PDF" />
    </IconButton>
  </>
);

const DetailRow = ({ detail, detailIndex }) => (
  <TableRow sx={{ backgroundColor: "#b3e0e5" }}>
    <TableCell>{detailIndex + 1}</TableCell>
    <TableCell>{detail.imeiNo}</TableCell>
    <TableCell>{detail.iccidNo}</TableCell>
    <TableCell>{new Date(detail.oldExpiryDate).toLocaleDateString()}</TableCell>
    <TableCell>{new Date(detail.newExpiryDate).toLocaleDateString()}</TableCell>
  </TableRow>
);

const RequestRow = ({
  row,
  index,
  isOpen,
  handleRowClick,
  onExcelDownload,
  onPdfDownload,
}) => (
  <>
    <TableRow sx={{ backgroundColor: "#b3e0e5" }}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{row.requestCode}</TableCell>
      <TableCell>{row.devices.length}</TableCell>
      <TableCell>{new Date(row.requestDate).toLocaleDateString()}</TableCell>
      <TableCell>{row.createdBy}</TableCell>

      <TableCell>
        <ExportButtons
          index={index}
          onExcelDownload={onExcelDownload}
          onPdfDownload={onPdfDownload}
        />
      </TableCell>
      <TableCell>
        <IconButton
          onClick={() => handleRowClick(index)}
          aria-label="Expand row"
        >
          {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableCell colSpan={7} style={{ paddingBottom: 0, paddingTop: 0 }}>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <Box margin={1}>
            <Table size="small">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S.No. </StyledTableCell>
                  <StyledTableCell>IMEI Number</StyledTableCell>
                  <StyledTableCell>ICCID Number</StyledTableCell>
                  <StyledTableCell>Old Expiry Date</StyledTableCell>
                  <StyledTableCell>New Expiry Date</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {row.devices.map((detail, detailIndex) => (
                  <DetailRow
                    key={detailIndex}
                    detail={detail}
                    detailIndex={detailIndex}
                  />
                ))}
              </TableBody>
            </Table>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  </>
);

const exportToExcel = (data) => {
  const ws = XLSX.utils.json_to_sheet(
    data.devices.map((detail) => ({
      "Device IMEI": detail.imeiNo,
      ICCID: detail.iccidNo,
      "Old Exp Date": new Date(detail.oldExpiryDate).toLocaleDateString(),
      "New Exp Date": new Date(detail.newExpiryDate).toLocaleDateString(),
    }))
  );
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Details");
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  FileSaver.saveAs(
    new Blob([wbout], { type: "application/octet-stream" }),
    `Request_${data.requestCode}.xlsx`
  );
};

const exportToPdf = (data) => {
  const doc = new jsPDF();
  doc.text(`Request Code: ${data.requestCode}`, 10, 10);
  doc.text(`Total Device: ${data.devices.length}`, 10, 20);
  doc.text(
    `Renew Date: ${new Date(data.requestDate).toLocaleDateString()}`,
    10,
    30
  );
  doc.text(`Renewed By: ${data.createdBy}`, 10, 40);

  const tableColumn = [
    "Sl no.",
    "Device IMEI",
    "ICCID",
    "Old Exp Date",
    "New Exp Date",
  ];
  const tableRows = data.devices.map((detail, index) => [
    index + 1,
    detail.imeiNo,
    detail.iccidNo,
    new Date(detail.oldExpiryDate).toLocaleDateString(),
    new Date(detail.newExpiryDate).toLocaleDateString(),
  ]);

  doc.autoTable(tableColumn, tableRows, { startY: 50 });
  doc.save(`Request_${data.requestCode}.pdf`);
};

export default function SimManagement() {
  const [openRowIndices, setOpenRowIndices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchParams, setSearchParams] = useState({
    fromdate: 0,
    todate: 0,
    requestcode: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItem, setTotalItem] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const openExcelImportModal = () => {
    setOpenModal(true);
  };

  const closeExcelImportModal = () => {
    setOpenModal(false);
  };

  const handleRowClick = (index) => {
    setOpenRowIndices((prevOpenRowIndices) =>
      prevOpenRowIndices.includes(index)
        ? prevOpenRowIndices.filter((i) => i !== index)
        : [...prevOpenRowIndices, index]
    );
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchRequests(page, rowsPerPage, searchParams);
        console.log(data);
        if (isMounted) {
          setFilteredRequests(data.items);
          setTotalItem(data.totalItems);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [page, rowsPerPage, searchParams]);

  const debouncedSearch = useCallback(
    debounce(() => {
      setPage(0);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
    debouncedSearch(); // Trigger debounce function
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onExcelDownload = (index) => {
    const selectedRow = filteredRequests[index];
    exportToExcel(selectedRow);
  };

  const onPdfDownload = (index) => {
    const selectedRow = filteredRequests[index];
    exportToPdf(selectedRow);
  };
  const hello = () => {
    console.log("object");
  };
  return (
    <div className="main_container">
      <LoadingComponent isLoading={loading} />
      <Box sx={{ flexGrow: 1 }} className="main">
        <ThemeProvider theme={theme}>
          <Grid container spacing={2}>
            <Grid container item xs={12}>
              <Grid item xs={10}>
                <h1>Sim Management</h1>
              </Grid>
              <Grid item xs={2}>
                <IconButton
                  onClick={openExcelImportModal}
                  aria-label="Export to Excel"
                >
                  <img src={importExcelIcon} alt="Export to Excel" />
                </IconButton>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <TextField
                      name="fromdate"
                      label="From Date"
                      type="date"
                      value={searchParams.fromdate}
                      onChange={handleSearchChange}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      name="todate"
                      label="To Date"
                      type="date"
                      value={searchParams.todate}
                      onChange={handleSearchChange}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      name="requestcode"
                      label="Request Code"
                      value={searchParams.requestcode}
                      onChange={handleSearchChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={debouncedSearch}
                      fullWidth
                      sx={{ height: "100%" }}
                    >
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ width: "100%", mb: 2 }} elevation={1}>
                <TableContainer component={Paper} elevation={1}>
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>S.No. </StyledTableCell>
                        <StyledTableCell>Request Code</StyledTableCell>
                        <StyledTableCell>Total Devices</StyledTableCell>
                        <StyledTableCell>Renewed Date</StyledTableCell>
                        <StyledTableCell>Renewed By</StyledTableCell>
                        <StyledTableCell>Export EXCEL/PDF</StyledTableCell>
                        <StyledTableCell>Action</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredRequests.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            No data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRequests.map((row, index) => (
                          <RequestRow
                            key={index}
                            row={row}
                            index={index}
                            isOpen={openRowIndices.includes(index)}
                            handleRowClick={handleRowClick}
                            onExcelDownload={onExcelDownload}
                            onPdfDownload={onPdfDownload}
                          />
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={totalItem}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </Grid>
          </Grid>
          <ImportExcel
            openModal={openModal}
            setOpenModal={setOpenModal}
            closeExcelImportModal={closeExcelImportModal}
            loading={loading}
            setLoading={setLoading}
          />
        </ThemeProvider>
      </Box>
    </div>
  );
}
