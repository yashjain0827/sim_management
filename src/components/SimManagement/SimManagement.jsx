import React, { useState, useEffect, useCallback } from "react";
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
  const fromdate = new Date(searchParams.fromdate).getTime();
  const todate = new Date(searchParams.todate).getTime();
  try {
    const payload = {
      pageNo: page,
      pageSize: rowsPerPage,
      fromDate: fromdate,
      toDate: todate,
      search: searchParams.requestcode.trim(),
    };
    const response = await SimManagementAction.getAllSimManagement(payload);
    return response;
  } catch (error) {
    console.error("Error fetching data", error);
    throw error;
  }
};

const fetchRequestDetails = async (requestCode) => {
  try {
    const response = await SimManagementAction.getSimManagementDetails(
      requestCode
    );
    return response;
  } catch (error) {
    console.error("Error fetching request details", error);
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
  details,
  onExcelDownload,
  onPdfDownload,
}) => (
  <>
    <TableRow sx={{ backgroundColor: "#b3e0e5" }}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{row.requestCode}</TableCell>
      <TableCell>{row.totalDevices}</TableCell>
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
          onClick={() => handleRowClick(index, row.requestCode)}
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
                {details.map((detail, detailIndex) => (
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
  doc.text(`Total Device: ${data.totalDevices}`, 10, 20);
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
  const [openRowIndex, setOpenRowIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [details, setDetails] = useState({});
  const [searchParams, setSearchParams] = useState({
    fromdate: 0,
    todate: new Date().getTime(),
    requestcode: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItem, setTotalItem] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const openExcelImportModal = () => {
    setOpenModal(true);
  };

  const closeExcelImportModal = () => {
    setOpenModal(false);
  };

  const handleRowClick = async (index, requestCode) => {
    if (openRowIndex === index) {
      setOpenRowIndex(null);
    } else {
      setLoading(true);
      try {
        const data = await fetchRequestDetails(requestCode);
        setDetails((prevDetails) => ({
          ...prevDetails,
          [index]: data.items,
        }));
        setOpenRowIndex(index);
      } catch (error) {
        console.error("Error fetching request details", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const debouncedFetchRequests = useCallback(
    debounce(async (page, rowsPerPage, searchParams) => {
      setLoading(true);
      try {
        const data = await fetchRequests(page, rowsPerPage, searchParams);
        setFilteredRequests(data.items);
        setTotalItem(data.totalItems);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedFetchRequests(page, rowsPerPage, searchParams);
  }, [page, rowsPerPage, searchParams, debouncedFetchRequests]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    console.log("date pick value: ", e?.target?.value);
    if (name === "requestcode") {
      setSearchParams((prevParams) => ({
        ...prevParams,
        [name]: value,
      }));
    } else {
      setSearchParams((prevParams) => ({
        ...prevParams,
        [name]: value,
      }));
    }
    setPage(0);
    debouncedFetchRequests(0, rowsPerPage, { ...searchParams, [name]: value });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    debouncedFetchRequests(newPage, rowsPerPage, searchParams);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    debouncedFetchRequests(0, newRowsPerPage, searchParams);
  };

  const handleExcelDownload = async (index) => {
    const requestData = filteredRequests[index];
    if (requestData) {
      const detailsData = await fetchRequestDetails(requestData.requestCode);
      exportToExcel({ ...requestData, devices: detailsData.items });
    }
  };

  const handlePdfDownload = async (index) => {
    const requestData = filteredRequests[index];
    if (requestData) {
      const detailsData = await fetchRequestDetails(requestData.requestCode);
      exportToPdf({ ...requestData, devices: detailsData.items });
    }
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
                      onClick={() =>
                        debouncedFetchRequests(page, rowsPerPage, searchParams)
                      }
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
                      {filteredRequests?.length === 0 ? (
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
                            isOpen={openRowIndex === index}
                            handleRowClick={handleRowClick}
                            details={details[index] || []}
                            onExcelDownload={handleExcelDownload}
                            onPdfDownload={handlePdfDownload}
                          />
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 20, 50, 100]}
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
