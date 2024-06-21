import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TopView from "../CommonComponents/topView";
import moment from "moment";
import ExportPdf from "../CommonComponents/exportPdf";
import ExportReport from "../CommonComponents/Export";
import { SubscriptionAction } from "../actions/subscription";
import LoadingComponent from "../CommonComponents/LoadingComponts";
import { DeviceAction } from "../actions/device";
import { LotAction } from "../actions/Lot";

import {
  Button,
  Fade,
  Grid,
  IconButton,
  Paper,
  Popover,
  Popper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  InputAdornment,
  Box,
  Autocomplete,
  Tooltip,
  tableCellClasses,
  Collapse,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { styled } from "@mui/system";

import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";

const innerTableCellStyle = {
  color: "#fff",
  fontSize: "15px",
  fontWeight: "bold",
  background: "rgb(48 85 135)",
};
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: "center",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
    fontWeight: "bold",
    fontSize: "15px",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    // border: 0,
    // fontWeight:"bold",
    // fontSize:"15px"
  },
}));
const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(14 57 115 / 86%)",
    },
  },
});
const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};
const blue = {
  100: "#DAECFF",
  200: "#b6daff",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const Textarea = styled(BaseTextareaAutosize)(
  ({ theme }) => `
    box-sizing: border-box;
    width: 560px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 12px 12px 0 12px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${
      theme.palette.mode === "dark" ? grey[900] : grey[50]
    };
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    &:focus {
      outline: 0;
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[600] : blue[200]
      };
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

function Row(props) {
  const { row, index, setOpenRowIndex, openRowIndex, commandSuccess } = props;
  console.log(row);
  /* ROW IS AN ARRAY OF DEVICES  */
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [oldImeiCommandList, setoOldImeiCommandList] = useState([]);
  const [imeiCommandList, setImeiCommandList] = useState([]);
  const [page, setPage] = useState(imeiCommandList?.length);

  const isRowOpen = index === openRowIndex;
  let batchSize = 50;
  let currentIndex = imeiCommandList?.length;

  const expandrowOpenHandler = (index, row) => {
    debugger;
    if (isRowOpen) {
      setOpenRowIndex(null); // Close the currently open row
      setoOldImeiCommandList([]);
      setImeiCommandList([]);
      setHasMore(true);
      currentIndex = 0;
    } else {
      setOpenRowIndex(null); // Close the currently open row
      setoOldImeiCommandList([]);
      setImeiCommandList([]);
      setHasMore(true);
      currentIndex = 0;
      setOpenRowIndex(index); // Open the clicked row
      // comandTrailHandler(row?.lotId, row.id);
    }
  };

  // const comandTrailHandler = (lotId, testDeviceId) => {
  //   const data = {
  //     lotId: lotId ? lotId : null,
  //     testDeviceId: testDeviceId ? testDeviceId : null,
  //   };
  //   LotAction.commandTrail(data).then((response) => {
  //     try {
  //       if (response !== null) {
  //         setoOldImeiCommandList(response?.data);
  //         setImeiCommandList(response?.data?.slice(0, 50));
  //       } else {
  //       }
  //     } catch (error) {}
  //   });
  // };

  const handleScroll = async (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;
    if (
      scrollTop + clientHeight >= scrollHeight - 20 &&
      !isLoading &&
      hasMore
    ) {
      // const totalPages = Math.ceil(oldImeiCommandList?.length / batchSize);

      if (currentIndex < oldImeiCommandList.length) {
        // Slice data from oldImeiCommandList in reverse order to get batches of 50 items
        const newData =
          oldImeiCommandList &&
          oldImeiCommandList?.slice(currentIndex, currentIndex + batchSize);
        setImeiCommandList((prevData) => [...prevData, ...newData]);
        currentIndex += batchSize;
        setPage((prevPage) => prevPage + batchSize); // Increment page for the next batch
      } else {
        // No more data to fetch
        setHasMore(false);
      }
    }
  };

  return (
    <React.Fragment>
      <TableRow
        sx={{
          background: row.isRejected
            ? "#fc7f7f"
            : row.isTestingCompleted
            ? "#9afccca8"
            : "",
        }}
      >
        <StyledTableCell>{index + 1}</StyledTableCell>
        <StyledTableCell>{row[0]?.requestedcode ?? "NA"}</StyledTableCell>

        <StyledTableCell
          sx={{
            position: "relative",
            maxWidth: "300px",
            overflowWrap: "break-word",
          }}
        >
          <Tooltip title={row[0]?.command ? row[0]?.command : "NA"} arrow>
            {`${row[0]?.command.slice(0, 15)} more...`}
          </Tooltip>
        </StyledTableCell>
        <StyledTableCell>{row[0]?.user ? row[0]?.user : "NA"}</StyledTableCell>
        <StyledTableCell>
          {row[0]?.requestedon
            ? moment(row[0]?.requestedon).format("DD-MM-YYYY HH :mm")
            : "NA"}
        </StyledTableCell>
        <StyledTableCell>{`${commandSuccess}/${row.length}`}</StyledTableCell>

        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => expandrowOpenHandler(index, row)}
          >
            {isRowOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
      </TableRow>

      <StyledTableRow>
        <StyledTableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={9}
        >
          <Collapse in={isRowOpen} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {/* <Typography variant="h6" gutterBottom component="div">
                History
              </Typography> */}
              <div
                style={{ maxHeight: "400px", overflowY: "auto" }}
                onScroll={handleScroll}
              >
                <Paper>
                  <Table size="small" stickyHeader aria-label="sticky table">
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell sx={innerTableCellStyle}>
                          S.No
                        </StyledTableCell>
                        <StyledTableCell sx={innerTableCellStyle}>
                          Imei No.
                        </StyledTableCell>
                        <StyledTableCell sx={innerTableCellStyle}>
                          CCID No.
                        </StyledTableCell>
                        <StyledTableCell sx={innerTableCellStyle}>
                          Box No.
                        </StyledTableCell>
                        <StyledTableCell sx={innerTableCellStyle}>
                          send date
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {row &&
                        row?.map((historyRow, ind) => (
                          <TableRow
                            key={historyRow.date}
                            sx={{
                              background:
                                !historyRow.isactive && historyRow.senddate
                                  ? "#aae7b6"
                                  : "#f39f6e",
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {ind + 1}
                            </TableCell>

                            <TableCell
                              sx={{
                                position: "relative",
                                maxWidth: "300px",
                                overflowWrap: "break-word",
                              }}
                            >
                              {historyRow?.imeinumber
                                ? historyRow?.imeinumber
                                : "NA"}
                            </TableCell>
                            <TableCell
                              sx={{
                                position: "relative",
                                maxWidth: "300px",
                                overflowWrap: "break-word",
                              }}
                            >
                              {historyRow?.response
                                ? historyRow?.response
                                : "NA"}
                            </TableCell>
                            <TableCell>
                              {historyRow?.boxnumber
                                ? historyRow?.boxnumber
                                : "NA"}
                            </TableCell>
                            <TableCell>
                              {historyRow?.senddate
                                ? historyRow?.senddate
                                : "NA"}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Paper>
              </div>
            </Box>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </React.Fragment>
  );
}
const ReconfigureDeviceList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [command, setCommand] = useState("");
  const [imeiNumbers, setImeiNumbers] = useState("");
  const [exportDataPdf, setExportDataPdf] = useState([]);
  const [exportDataExcel, setExportDataExcel] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [fromDate, setFromDate] = useState(
    moment(new Date()).subtract(10, "minutes").format("YYYY-MM-DD HH:mm")
  );
  const [toDate, setToDate] = useState(
    moment(new Date()).format("YYYY-MM-DD HH:mm")
  );
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [DevicePacketDataList, setDevicePacketDataList] = useState([]);
  const [openRowIndex, setOpenRowIndex] = React.useState(null);

  async function getAllReconfiguredDevices() {
    const res = await DeviceAction.getAllReconfiguredDevices();
  }
  const handleChangePage = (event, newPage) => {
    //console.log(newPage);
    setPageNo(newPage);
  };
  // useEffect(() => {
  //   getAllReconfiguredDevices();
  // }, []);

  const handleChangeRowsPerPage = (event) => {
    //console.log(event.target.value)
    setPageSize(parseInt(event.target.value));
    setPageNo(0);
  };
  const onPdfDownload = (type) => {
    getAllReconfiguredDevices(false, "pdf");
  };

  const onExcelDownload = (type) => {
    getAllReconfiguredDevices(false, "excel");
  };
  let topViewData = {
    pageTitle: "Bulk Reconfigure",

    addText: "Add Return Device",

    hideAddButton: false,
    addClick: `/reconfigure`,

    editText: "",
    hideEditButton: true,
    editClick: null,

    cancelText: null,
    hideCancelButton: true,
    cancelClick: null,

    updateText: null,
    hideUpdateButton: true,
    updateClick: null,

    hidePdfExport: false,
    exportPdfClick: "",
    onPdfDownload: onPdfDownload,

    hideExcelExport: false,
    exportExcelClick: "",
    onExcelDownload: onExcelDownload,

    hideExcelImport: true,
    excelImportClick: "",

    filter: true,
    filterHandler: null,

    searchFieldHandler: (event) => setSearch(event.target.value),
    searchInput: search,
    searchField: false,
  };
  const tableHeadForExport = [
    "S.No.",
    "Imei number",
    "Requested on",
    "Requested By",
    "IsActive",
    "command",
  ];

  const exportDataList = (exportArray) => {
    console.log(exportArray, "exportarray");
    let exportDataArray = [];
    exportArray &&
      exportArray.length > 0 &&
      exportArray.forEach((item, index) => {
        let objExport = {
          col1: index + 1,
          col2: item?.imeinumber ?? "NA",

          col3: moment(item?.requestedon).format("DD-MM-YYYY HH:mm"),
          col4: item?.user ?? "NA",
          col5: item?.isActive ? "Online" : "Offline" ?? "NA",

          col6: item?.command ?? "NA",
        };
        exportDataArray.push(objExport);
      });

    setExportDataPdf(exportDataArray);

    let objExport = {};

    tableHeadForExport.forEach((element, index) => {
      objExport[`col${index + 1}`] = element;
    });

    if (exportDataArray.length > 0) {
      exportDataArray = [objExport].concat(exportDataArray);
    }

    setExportDataExcel(exportDataArray);
  };

  async function getAllReconfiguredDevices(type, exportType) {
    setIsLoading(true);
    let data = {
      pageNo: type ? pageNo : 0,
      pageSize: type ? pageSize : 0,
      fromDate: Date.parse(new Date(fromDate)),
      toDate: Date.parse(new Date(toDate)),
      imeiNo: search,
    };
    console.log(data);
    const response = await DeviceAction.getAllReconfiguredDevices(data);
    if (type) {
      console.log(response);
      setDevicePacketDataList(response?.data?.items || {});
      setTotalCount(response?.data?.totalItems);
    } else {
      if (exportType == "pdf") {
        exportDataList(response?.data?.items ?? []);
        setTimeout(() => {
          document.getElementById("exportPdfButton").click();
        }, 500);
      } else {
        exportDataList(response?.data?.items ?? []);

        setTimeout(() => {
          document.getElementById("exportDataList").click();
        }, 500);
      }
    }
    setIsLoading(false);
  }
  useEffect(() => {
    getAllReconfiguredDevices(true);
  }, [pageNo, pageSize]);
  const TableHeadData = [
    { name: "S.No.", width: "50px" },
    {
      name: "Request Code",
      width: "150px",
    },
    {
      name: "Command",
      width: "150px",
    },
    {
      name: "Created By",
      width: "150px",
    },
    {
      name: "Created At",
      width: "150px",
    },
    {
      name: "send/total",
      width: "150px",
    },
    {
      name: "Action",
      width: "150px",
    },
  ];
  function sendCommandToreconfigure() {
    console.log("sendCommandToreconfigure");
  }
  return (
    <div className="main_container">
      <Box className="main">
        <ThemeProvider theme={theme}>
          <TopView topViewData={topViewData}></TopView>
          <LoadingComponent isLoading={isLoading} />

          <Grid container sx={{ marginTop: "0rem", background: "" }} rowGap={1}>
            <Grid item xs={12} sm={4} md={4} lg={2} xl={1}>
              <div style={{ display: "none" }}>
                <ExportPdf
                  exportData={exportDataPdf || []}
                  labelHeader={tableHeadForExport || []}
                  title="Subscription List"
                  reportName="Subscription List"
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={2} xl={1.5}>
              <div style={{ display: "none" }}>
                <ExportReport
                  exportData={exportDataExcel || []}
                  labelHeader={tableHeadForExport || []}
                  exportHeading={["Subscription List"]}
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <Paper
                sx={{ width: "100%", mb: 2, padding: "5px" }}
                elevation={1}
              >
                <Grid container spacing={2} alignItems={"center"}>
                  <Grid item>
                    {/* <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      From Date
                    </Typography> */}
                    <TextField
                      name="fromdate"
                      type="datetime-local"
                      label="From Date"
                      size="small"
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={fromDate}
                      sx={{ width: "220px", marginTop: "23px" }}
                      inputProps={
                        {
                          // max: toDate,
                          // style: {
                          //   width: "12rem",
                          // },
                        }
                      }
                      onChange={(e) => {
                        setFromDate(e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Typography
                      sx={{ color: "rgb(14 57 115 / 86%)" }}
                    ></Typography>
                    <TextField
                      name="toDate"
                      type="datetime-local"
                      label="ToDate"
                      size="small"
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={toDate}
                      sx={{ width: "220px", marginTop: "23px" }}
                      inputProps={
                        {
                          // max: toDate,
                        }
                      }
                      onChange={(e) => {
                        setToDate(e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      sx={{ marginTop: "20px", color: "white" }}
                      variant="contained"
                      onClick={() => getAllReconfiguredDevices(true)}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ width: "100%", mb: 2 }} elevation={1}>
                <TableContainer component={Paper} elevation={1}>
                  <Table
                    size="small"
                    aria-label="a dense table"
                    justifyContent={"center"}
                    alignItems="center"
                  >
                    <TableHead>
                      <TableRow
                        sx={{ backgroundColor: "rgb(14 57 115 / 86%)" }}
                      >
                        {TableHeadData.map((ele, index) => (
                          <TableCell
                            key={index}
                            sx={{
                              minWidth: ele.width,
                              color: "white",
                              textAlign: "center",
                            }}
                          >
                            {ele.name}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.keys(DevicePacketDataList)?.length > 0 &&
                        Object.entries(DevicePacketDataList)?.map(
                          ([requestCode, deviceListArray], index) => {
                            const user = deviceListArray[0];
                            console.log(deviceListArray);
                            const commandSuccess = deviceListArray.reduce(
                              (acc, curr) => {
                                return !curr.isactive && curr.senddate
                                  ? acc + 1
                                  : acc + 0;
                              },
                              0
                            );
                            return (
                              <Row
                                key={requestCode}
                                row={deviceListArray}
                                index={index}
                                openRowIndex={openRowIndex}
                                setOpenRowIndex={setOpenRowIndex}
                                commandSuccess={commandSuccess}
                              />
                              // <TableRow key={index}>
                              //   <TableCell sx={{ textAlign: "center" }}>
                              //     {index + 1}
                              //   </TableCell>
                              //   <TableCell
                              //     sx={{
                              //       textAlign: "center",
                              //       cursor: "pointer",
                              //       color: "blue",
                              //     }}
                              //     onClick={() => {
                              //       // window.open(path, "_self");
                              //     }}
                              //   >
                              //     {requestCode || "NA"}
                              //   </TableCell>
                              //   <TableCell sx={{ textAlign: "center" }}>
                              //     <Tooltip
                              //       title={user?.command ?? "NA"}
                              //       sx={{ width: 500, fontSize: "20px" }}
                              //     >
                              //       {`${user?.command.slice(0, 20)} more...` ??
                              //         "NA"}
                              //     </Tooltip>
                              //   </TableCell>
                              //   <TableCell sx={{ textAlign: "center" }}>
                              //     {user?.user ?? "NA"}
                              //   </TableCell>{" "}
                              //   <TableCell sx={{ textAlign: "center" }}>
                              //     {moment(user?.requestedon).format(
                              //       "DD-MM-YYYY HH:mm"
                              //     ) ?? "NA"}
                              //   </TableCell>
                              //   <TableCell sx={{ textAlign: "center" }}>
                              //     {`${commandSuccess} / ${deviceListArray.length}`}
                              //   </TableCell>{" "}
                              // </TableRow>
                            );
                          }
                        )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  sx={{}}
                  component="div"
                  rowsPerPageOptions={[10, 20, 50, 100]}
                  count={totalCount ? totalCount : 0}
                  rowsPerPage={pageSize}
                  page={pageNo}
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
};

export default ReconfigureDeviceList;
