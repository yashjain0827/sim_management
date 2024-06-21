import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import { DevicesAction } from "./GetAllDevicesAPI";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import RefreshIcon from "../../img/Icons/Refresh.svg";
import ExportReport from "../CommonComponents/Export";
import ExportPdf from "../CommonComponents/exportPdf";
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
  Box,
  Autocomplete,
  Divider,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import TopView from "../CommonComponents/topView";

const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(14 57 115 / 86%)",
    },
  },
});

function AllIssuesDevices() {
  const [companySearchArray, setCompanySearchArray] = useState([]);
  const navigate = useNavigate();
  const [issuesDevices, setIssuesDevices] = useState([]);
  const [issuesDevicesOld, setIssuesDevicesOld] = useState([]);

  const [totalCount, setTotalCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [IdBool, setIdBool] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [exportDataPdf, setExportDataPdf] = useState([]);
  const [exportDataExcel, setExportDataExcel] = useState([]);
  const open = Boolean(anchorEl);

  const exportDataList = (exportArray) => {
    console.log(exportArray, "exportarray");
    let exportDataArray = [];
    exportArray.forEach((item, index) => {
      let objExport = {
        col1: index + 1,
        col2: item.issueSlipNumber ? item.issueSlipNumber : "NA",
        col3: item.clientDTO.companyName,
        col4: item.clientDTO.lastIssueDate
          ? moment
              .utc(item.clientDTO.lastIssueDate)
              .utcOffset("+05:30")
              .format("DD/MM/YYYY hh:mm A")
          : null || "NA",
        col5: item.quantity ? item.quantity : "NA",
        col6: item.clientDTO.phoneNumber ? item.clientDTO.phoneNumber : "NA",
        col7: item.stateDTO && item.stateDTO.name ? item.stateDTO.name : "NA",
        
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

  const TableHeadData = [
    {
      name: "S.No.",
      width: "50px",
    },
    {
      name: "Issues Slip No.",
      width: "150px",
    },
    {
      name: "Client Name",
      width: "150px",
    },
    {
      name: "Issue Date",
      width: "100px",
    },
    {
      name: "Quantity",
      width: "100px",
    },
    {
      name: "Phone Number",
      width: "100px",
    },
    {
      name: "State",
      width: "100px",
    },
  ];

  async function getDevices(type, exportType) {
    const payload = {};
    const keys = {
      pageNo: type ? pageNo : 0,
      pageSize: type ? pageSize : 0,
    };
    console.log("keys", keys);
    const response = await DevicesAction.getIssuesDeviceList(payload, keys);
    if (response !== null) {
      if (type) {
        const dataObject = response.data;

        setIssuesDevices(dataObject);
        setIssuesDevicesOld(dataObject);
        setTotalCount(response);
      } else {
        if (exportType == "excel") {
          // setExportDataExcel(res.data);
          exportDataList(response.data);

          setTimeout(() => {
            document.getElementById("exportDataList").click();
          }, 500);
        } else if (exportType == "pdf") {
          // setExportDataPdf(res.data);
          exportDataList(response.data);

          setTimeout(() => {
            document.getElementById("exportPdfButton").click();
          }, 500);
        }
      }
    } else {
      setIssuesDevices([]);
      setTotalCount(0);
      console.log("error");
    }
  }

  const handleChangePage = (event, newPage) => {
    setPageNo(newPage);
    setIdBool(true);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value));
    setPageNo(0);
    setIdBool(true);
  };

  const handleCheckAvaliability = (event) => {
    navigate("/CheckAvailability");
  };

  const handleSingleIssueSlip = (id, issueSlipNumber) => {
    navigate("/SingleCompanyDevicesList", {
      state: { id: id, issueNumber: issueSlipNumber },
    });
  };
  useEffect(() => {
    if (IdBool) {
      getDevices(true, null);
    } else {
      getDevices(true);
    }
    setIdBool(false);
  }, [IdBool]);

  const handleSearch = () => {
    const filtered = issuesDevices.filter((item) => {
      const companyName = item?.clientDTO?.companyName?.toLowerCase();
      const keyword = searchKeyword?.toLowerCase();

      const matchKeyword = !searchKeyword || companyName.includes(keyword);

      if (fromDate && toDate) {
        const itemDate = new Date(item.lastIssueDate);
        const from = new Date(fromDate);
        const to = new Date(toDate);

        const matchDate = itemDate >= from && itemDate <= to;
        return matchKeyword && matchDate;
      }

      return matchKeyword;
    });
    console.log("filtered", filtered);
    setCompanySearchArray(filtered);
    exportDataList(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchKeyword]);

  const handleRefreshButton = () => {
    setSearchKeyword("");
    setFromDate("");
    setToDate("");
    getDevices();
  };

  const onPdfDownload = (type) => {
    getDevices(false, type);
  };

  const onExcelDownload = (type) => {
    getDevices(false, type);
  };

  let topViewData = {
    pageTitle: " All Issues Devices",

    addText: "Add Company",

    hideAddButton: true,
    addClick: "/deviceStatusUpdate",

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

    searchField: true,
    searchFieldHandler: null,
    searchInput: null,
  };

  function getFilteredData(data1) {
    if (data1) {
      setSearchKeyword(data1);
      const data = data1.toLowerCase();
      const filteredData =
        issuesDevicesOld &&
        issuesDevicesOld.length > 0 &&
        issuesDevicesOld.filter((ele) => {
          return (
            ele.clientDTO.companyName.toLowerCase().includes(data.trim()) ||
            ele.issueSlipNumber.toLowerCase().includes(data.trim())
          );
        });
      setIssuesDevices(filteredData);
    } else {
      setIssuesDevices(issuesDevicesOld);
      setSearchKeyword("");
    }
  }

  return (
    <div className="main_container">
      <Box className="main">
        <ThemeProvider theme={theme}>
          <TopView topViewData={topViewData}></TopView>
          <Grid container sx={{ marginTop: "0rem" }} rowGap={2}>
            <Grid item xs={12} sm={4} md={4} lg={2} xl={1}>
              <div style={{ display: "none" }}>
                <ExportPdf
                  exportData={exportDataPdf || []}
                  labelHeader={tableHeadForExport || []}
                  title="All Issues Devices"
                  reportName="All Issues Devices"
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={2} xl={1.5}>
              <div style={{ display: "none" }}>
                <ExportReport
                  exportData={exportDataExcel || []}
                  labelHeader={tableHeadForExport || []}
                  exportHeading={["All Issues Devices"]}
                />
              </div>
            </Grid>

            <Grid
              item
              xs={12}
              container
              justifyContent={"space-between"}
              flexWrap="nowrap"
              // alignItems={"center"}
            >
              {/* <Grid item>
                <Typography
                  sx={{
                    color: "rgb(14 57 115 / 86%)",
                    fontSize: "25px",
                    padding: "",
                  }}
                >
                  All Issues Devices
                  <Divider />
                </Typography>
              </Grid> */}
              <Grid item>
                <Tooltip>
                  <Button
                    variant="contained"
                    sx={{ color: "white", height: "3rem" }}
                    onClick={(e) => handleCheckAvaliability(e)}
                    size="small"
                  >
                    Issues Devices
                    <ArrowRightAltIcon sx={{ width: "2rem" }} />
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              container
              justifyContent={"space-between"}
              flexWrap="nowrap"
              alignItems={"center"}
            >
              <Grid
                item
                xs={12}
                container
                justifyContent={"flex-start"}
                alignItems="center"
                spacing={1}
                sx={{ paddingTop: "0px" }}
              >
                <Grid item>
                  <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                    Search Client Name
                  </Typography>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    value={searchKeyword}
                    inputProps={{
                      style: {
                        width: "12rem",
                        height: "0.4rem",
                      },
                    }}
                    onChange={(e) => getFilteredData(e.target.value)}
                    textAlign="center"
                  />
                </Grid>
                {/* <Grid item>
                  <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                    From Date
                  </Typography>
                  <TextField
                    name="toDate"
                    type="date"
                    size="small"
                    variant="outlined"
                    inputProps={{
                      style: {
                        width: "12rem",
                      },
                    }}
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </Grid> */}
                {/* <Grid item>
                  <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                    To Date
                  </Typography>
                  <TextField
                    name="toDate"
                    type="date"
                    size="small"
                    variant="outlined"
                    inputProps={{
                      style: {
                        width: "12rem",
                      },
                    }}
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </Grid> */}
                {/* <Grid item>
                  <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                  </Typography>
                  <Button
                    sx={{
                      marginTop: "24px",
                      color: "white",
                      width: "8rem",
                      height: "2.6rem",
                    }}
                    variant="contained"
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </Grid> */}
                {/* <Grid item>
                  <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                  </Typography>
                  <Button
                    sx={{
                      marginTop: "24px",
                      color: "white",
                      width: "8rem",
                      height: "2.6rem",
                    }}
                    variant="contained"
                    title="Reset All Data"
                    onClick={handleRefreshButton}
                  >
                    <img src={RefreshIcon} height="25px" width="40px" />
                  </Button>
                </Grid> */}
                {/* <Grid item>
                  <Tooltip>
                    <Button
                      variant="contained"
                      sx={{ color: "white", height: "3rem" }}
                      onClick={(e) => handleCheckAvaliability(e)}
                      size="small"
                    >
                      Issued Devices
                      <ArrowRightAltIcon sx={{ width: "2rem" }} />
                    </Button>
                  </Tooltip>
                </Grid> */}
              </Grid>
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
                            sx={{ minWidth: ele.width, color: "white" }}
                            align="center"
                          >
                            {ele.name}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {issuesDevices &&
                        issuesDevices.length > 0 &&
                        issuesDevices?.map((user, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell align="center">{index + 1}</TableCell>
                              <TableCell
                                align="center"
                                onClick={() =>
                                  handleSingleIssueSlip(
                                    user.id,
                                    user.issueSlipNumber
                                  )
                                }
                                sx={{ color: "green", cursor: "pointer" }}
                              >
                                {user.issueSlipNumber || "NA"}
                              </TableCell>
                              <TableCell align="center">
                                {user.clientDTO.companyName || "NA"}
                              </TableCell>
                              <TableCell align="center">
                                {user.createdAt
                                  ? moment
                                      .utc(user.createdAt)
                                      .utcOffset("+05:30")
                                      .format("DD/MM/YYYY hh:mm A")
                                  : null || "NA"}
                              </TableCell>
                              <TableCell
                                align="center"
                                onClick={() =>
                                  handleSingleIssueSlip(
                                    user.id,
                                    user.issueSlipNumber
                                  )
                                }
                                sx={{ color: "green", cursor: "pointer" }}
                              >
                                {user.quantity || "NA"}
                              </TableCell>
                              <TableCell align="center">
                                {user.clientDTO.phoneNumber || "NA"}
                              </TableCell>
                              <TableCell align="center">
                                {user.stateDTO.name || "NA"}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  sx={{}}
                  component="div"
                  rowsPerPageOptions={[
                    10,
                    15,
                    20,
                    25,
                    30,
                    { label: "All", value: 1000 },
                  ]}
                  count={totalCount.totalElements}
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
}

var tableHeadForExport = [
  "S.No.",
  "Issues Slip No.",
  "Client Name",
  "Issues Date",
  "Quantity",
  "Phone Number",
  "State",
];

export default AllIssuesDevices;
