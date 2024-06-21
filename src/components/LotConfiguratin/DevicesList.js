import {
  Box,
  Collapse,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  createTheme,
  tableCellClasses,
} from "@mui/material";
import { isArray } from "lodash";
import debouce from "lodash.debounce";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import TopView from "../CommonComponents/topView";
import { LotAction } from "../actions/Lot";
import InfoIcon from "@mui/icons-material/Info";
import moment from "moment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(14 57 115 / 86%)",
    },
  },
});

const tableCellStyle = {
  color: "#fff",
  fontSize: "15px",
  fontWeight: "bold",
  background: "rgb(48 85 135)",
};
const innerTableCellStyle = {
  color: "#fff",
  fontSize: "15px",
  fontWeight: "bold",
  background: "rgb(48 85 135)",
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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

function Row(props) {
  const { row, index, setOpenRowIndex, openRowIndex } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [oldImeiCommandList, setoOldImeiCommandList] = useState([]);
  const [imeiCommandList, setImeiCommandList] = useState([]);
  const [page, setPage] = useState(imeiCommandList?.length);

  const isRowOpen = index === openRowIndex;
  let batchSize = 50;
  let currentIndex = imeiCommandList?.length;

  const expandrowOpenHandler = (index, row) => {
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
      comandTrailHandler(row?.lotId, row.id);
    }
  };

  const comandTrailHandler = (lotId, testDeviceId) => {
    const data = {
      lotId: lotId ? lotId : null,
      testDeviceId: testDeviceId ? testDeviceId : null,
    };
    LotAction.commandTrail(data).then((response) => {
      try {
        if (response !== null) {
          setoOldImeiCommandList(response?.data);
          setImeiCommandList(response?.data?.slice(0, 50));
        } else {
        }
      } catch (error) {}
    });
  };

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
        <StyledTableCell>{row?.imeiNo ? row?.imeiNo : "NA"}</StyledTableCell>
        <StyledTableCell>{row?.uuidNo ? row?.uuidNo : "NA"}</StyledTableCell>

        <StyledTableCell
          sx={{
            position: "relative",
            maxWidth: "300px",
            overflowWrap: "break-word",
          }}
        >
          <Tooltip title={row?.detail ? row?.detail : "NA"} arrow>
            <IconButton>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </StyledTableCell>
        <TableCell>
          {row.isRejected
            ? "REJECTED"
            : row.isTestingCompleted
            ? "COMPLETED"
            : "IN-PROCESS"}
        </TableCell>
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
          colSpan={6}
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
                          Command
                        </StyledTableCell>
                        <StyledTableCell sx={innerTableCellStyle}>
                          Response
                        </StyledTableCell>
                        <StyledTableCell sx={innerTableCellStyle}>
                          Failure Reason
                        </StyledTableCell>
                        <StyledTableCell sx={innerTableCellStyle}>
                          Status
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {imeiCommandList &&
                        imeiCommandList?.map((historyRow, ind) => (
                          <TableRow
                            key={historyRow.date}
                            sx={{
                              background:
                                historyRow.status === "ACCEPT"
                                  ? "#a3dbf1"
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
                              {historyRow?.command ? historyRow?.command : "NA"}
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
                              {historyRow?.failureReason
                                ? historyRow?.failureReason
                                : "NA"}
                            </TableCell>
                            <TableCell>
                              {historyRow?.status ? historyRow?.status : "NA"}
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

function DevicesList() {
  const id = window.location.pathname.split("/")[2];
  const [openRowIndex, setOpenRowIndex] = React.useState(null);
  const [devicesList, setDevicesList] = useState([]);
  const [lotDetail, setLotDetails] = useState();
  const [totalCount, setTotalCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [IdBool, setIdBool] = useState(false);
  const [search, setSearch] = useState("");
  const [statusValue, setStatusValue] = useState(null);

  const handleChangePage = (event, newPage) => {
    //console.log(newPage);
    setPageNo(newPage);
    setIdBool(true);
  };

  const handleChangeRowsPerPage = (event) => {
    //console.log(event.target.value)
    setPageSize(parseInt(event.target.value));
    setPageNo(0);
    setIdBool(true);
  };

  const fetchDevicesListById = () => {
    const data = {
      lotId: id ? id : null,
      pageSize: pageSize,
      pageNo: pageNo,
      search: search,
      deviceStatus: statusValue ? statusValue?.id : null,
    };
    LotAction.fetchLotDevicesList(data).then((response) => {
      try {
        if (response !== null) {
          setLotDetails(response?.lot);
          setDevicesList(response?.response?.data);
          setTotalCount(response?.response?.totalElements);
        } else {
        }
      } catch (error) {}
    });
  };
  const searcHandler = (e) => {
    setSearch(e.target.value);
    setIdBool(true);
    if (e.target.value === "") {
      setIdBool(true);
      setPageNo(0);
    }
  };

  const debouncedResults = useMemo(() => {
    return debouce(searcHandler, 1000);
  }, []);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  useEffect(() => {
    if (IdBool) {
      fetchDevicesListById();
    }
    setIdBool(false);
  }, [IdBool]);

  useEffect(() => {
    fetchDevicesListById();
  }, []);
  const statusList = [
    { name: "PROCESSING", id: "PROCESSING" },
    { name: "COMPLETED", id: "COMPLETED" },
    { name: "REJECTED", id: "REJECTED" },
  ];

  const filteredValue = [
    {
      typeId: 2,
      label: "Select Status",
      option: statusList ? statusList : [],
      value: statusValue || {},
      function: (event, newValue) => {
        setStatusValue(newValue);
        setIdBool(true);
      },
    },
  ];

  let topViewData = {
    pageTitle: "Devices List",
    addText: "Add Company",

    hideAddButton: false,
    addClick: `/viewLot/${id}`,

    editText: "",
    hideEditButton: true,
    editClick: null,

    cancelText: null,
    hideCancelButton: true,
    cancelClick: null,

    updateText: null,
    hideUpdateButton: true,
    updateClick: null,

    hidePdfExport: true,
    exportPdfClick: "",
    onPdfDownload: null,

    hideExcelExport: true,
    exportExcelClick: "",
    onExcelDownload: null,

    hideExcelImport: true,
    excelImportClick: "",

    filter: true,
    filterHandler: null,

    searchFieldHandler: debouncedResults,
    searchInput: search,
    searchField: false,
    filteredValue: filteredValue,
  };
  return (
    <div className="main_container">
      <Box className="main">
        <ThemeProvider theme={theme}>
          <Grid sx={{ padding: "10px" }}>
            <TopView topViewData={topViewData} />
          </Grid>
          <Grid>
            <Grid>
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  alignContent: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    border: "1px solid grey",
                    padding: "4px",
                    borderRadius: "5px",
                    background: "#daaae9",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#fff",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  Lot Number:-{" "}
                  {lotDetail && lotDetail?.systemLotId
                    ? lotDetail?.systemLotId
                    : "NA"}
                </div>
                <div
                  style={{
                    border: "1px solid grey",
                    padding: "4px",
                    borderRadius: "5px",
                    color: "#fff",
                    background: "#f4cc70",
                    fontSize: "16px",
                    fontWeight: "bold",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  SIM Provider:-{" "}
                  {lotDetail && lotDetail?.provider
                    ? lotDetail?.provider?.name
                    : "NA"}
                </div>
                <div
                  style={{
                    border: "1px solid grey",
                    padding: "4px",
                    borderRadius: "5px",
                    background: "#4df7d6",
                    color: "#fff",
                    fontSize: "16px",
                    fontWeight: "bold",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  Primary Operator:-{" "}
                  {lotDetail && lotDetail?.operators
                    ? lotDetail?.operators?.name
                    : "NA"}
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid sx={{ marginTop: "10px" }}>
            <Paper>
              <TableContainer sx={{ maxHeight: "67vh" }}>
                <Table size="small" stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: "rgb(14 57 115 / 86%)",
                        color: "#fff",
                      }}
                    >
                      <TableCell
                        sx={{
                          color: "#fff",
                          backgroundColor: "rgb(48 85 135)",
                        }}
                      >
                        S.No
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#fff",
                          backgroundColor: "rgb(48 85 135)",
                        }}
                      >
                        IMEI Number
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#fff",
                          backgroundColor: "rgb(48 85 135)",
                        }}
                      >
                        ICCID Number
                      </TableCell>

                      <TableCell
                        sx={{
                          color: "#fff",
                          backgroundColor: "rgb(48 85 135)",
                        }}
                      >
                        Detail
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#fff",
                          backgroundColor: "rgb(48 85 135)",
                        }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#fff",
                          backgroundColor: "rgb(48 85 135)",
                        }}
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {devicesList &&
                      isArray(devicesList) &&
                      devicesList?.map((row, ind) => (
                        <Row
                          key={row.id}
                          row={row}
                          index={ind}
                          openRowIndex={openRowIndex}
                          setOpenRowIndex={setOpenRowIndex}
                        />
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                sx={{}}
                component="div"
                rowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
                count={totalCount ? totalCount : 0}
                rowsPerPage={pageSize}
                page={pageNo}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Grid>
        </ThemeProvider>
      </Box>
    </div>
  );
}

export default DevicesList;
