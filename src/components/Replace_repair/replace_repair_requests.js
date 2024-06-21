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
import { useNavigate, useHistory } from "react-router-dom";
import { LotAction } from "../../components/actions/Lot";
import { DeviceAction } from "../../components/actions/device";
import { companyAction } from "../company/companyFetchData";

import { styled } from "@mui/material/styles";

// import CompanyProfile from "./CompanyProfile";
import TopView from "../CommonComponents/topView";
import ExportReport from "../CommonComponents/Export";
import ExportPdf from "../CommonComponents/exportPdf";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import RefreshIcon from "../../img/Icons/Refresh.svg";
// import Person2Icon from '@mui/icons-material/Person2';
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import EditNoteIcon from "@mui/icons-material/EditNote";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { MaintenanceAction } from "../actions/maintenance";

export const CustomAutoComplete = styled(Autocomplete)(
  ({ theme, ...props }) => ({
    width: "100%",
    "& input": {
      background: props.background ? props.background : "#fff",
      borderRadius: "5px",
      padding: "11px 15px !important",
      borderLeft: props.required ? "2px solid #EF3434" : "0",
      fontSize: "13px",
    },

    "& .MuiOutlinedInput-root": {
      background: props.background ? props.background : "#fff",
      borderRadius: "5px",
      marginBottom: "0px",
    },
    "& .MuiTextField-root": {
      margin: 0,
    },
    "& fieldset": {
      border: ".5",
    },
    "& label": {
      lineHeight: "initial",
      fontSize: "13px",
    },
    "& .MuiInputLabel-shrink": {
      // background: "#ffffff",
      transform: " translate(14px, -7px) scale(0.8) !important",
    },
    "& .MuiInputLabel-root": {
      transform: "translate(14px, 9px) scale(1)",
    },
    " & .MuiOutlinedInput-root": {
      padding: "0",
    },
  })
);
const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(14 57 115 / 86%)",
    },
  },
});

function MaintenanceList() {
  const [repairRequestList, setRepairRequestList] = useState([]);

  const [companySearchArray, setCompanySearchArray] = useState([]);

  const [deviceModal, setDeviceModal] = useState({});
  const [simProvider, setSimProvider] = useState({});
  const [lotStatus, setLotStatus] = useState({});
  const [deviceModalList, setDeviceModalList] = useState([]);
  const [simProviderList, setSimProviderList] = useState([]);
  const [client, setClient] = useState();
  const [clientList, setClientList] = useState([]);
  const [primaryOperator, setPrimaryOperator] = useState();
  const [primaryOperatorList, setPrimaryOperatorList] = useState([]);
  const [errors, setErrors] = useState({
    companyName: "",
    companyLogo: "",
    address: "",
    contactNumber: "",
    email: "",
    state: "",
    city: "",
    panNumber: "",
    gstNumber: "",
  });

  const [filterData, SetfilterData] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [status, setStatus] = useState("");
  const open = Boolean(anchorEl);
  const [filterCompany, setFilterCompany] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [showOldFromDate, setShowOldFromDate] = useState(false);
  const [end, setEnd] = useState(100);
  const [IdBool, setIdBool] = useState(false);
  // const [showNewFromDate, setShowNewFromDate] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [exportDataPdf, setExportDataPdf] = useState([]);
  const [exportDataExcel, setExportDataExcel] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [trigger, setTrigger] = useState(false);
  function searchFieldHandler() {
    setTrigger(true);
  }
  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    //console.log(newPage);
    setPageNo(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    //console.log(event.target.value)
    setPageSize(parseInt(event.target.value));
    setPageNo(0);
  };
  async function fetchPrimaryOperator() {
    const response = await DeviceAction.getOperators();
    if (response) {
      setPrimaryOperatorList(response);
    } else {
      setPrimaryOperatorList([]);
    }
  }
  async function fetchCompanyData() {
    const response = await companyAction.getCompanyList();
    if (response) {
      setClientList(response.data.slice(0, 101));
    } else {
      setClientList([]);
    }
  }

  async function fetchDeviceModal() {
    const response = await LotAction.getAllDeviceModal();
    if (response) {
      setDeviceModalList(response);
    } else {
      setDeviceModalList([]);
    }
  }
  async function fetchSimProviders() {
    const response = await DeviceAction.getProviders();
    if (response) {
      setSimProviderList(response);
    } else {
      setSimProviderList([]);
    }
  }

  const exportDataList = (exportArray) => {
    console.log(exportArray, "exportarray");
    let exportDataArray = [];
    exportArray &&
      exportArray.length > 0 &&
      exportArray.forEach((item, index) => {
        let objExport = {
          col1: index + 1,
          col2: item?.repairCode ?? "NA",

          col3: item?.client?.companyName ?? "NA",
          col4: item.state && item.state.name ? item.state.name : "NA",

          col5: item?.totalDevice ?? "NA",

          col6: item?.repairedDevice ?? "NA",
          col7: item?.pendingDevice ?? "NA",
          col8: item?.replacedDevice ?? "NA",
          col9: item?.ewayBillNo ?? "NA",

          col10: item.createdAt
            ? moment(item.createdAt).format("DD/MM/YYYY hh:mm a")
            : "NA",
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
    { name: "S.No.", width: "50px" },
    {
      name: "Repair code",
      width: "150px",
    },
    {
      name: "Client Name",
      width: "150px",
    },
    {
      name: "State",
      width: "150px",
    },
    {
      name: "Number of Devices",
      width: "100px",
    },
    {
      name: "Repaired Device",
      width: "100px",
    },
    {
      name: "Pending Device",
      width: "100px",
    },
    {
      name: "Reject Device",
      width: "100px",
    },

    {
      name: "E-way Bill No.",
      width: "100px",
    },
    {
      name: "Created Date",
      width: "100px",
    },
  ];

  async function getRepairRequestList(type, exportType) {
    let data = { pageNo: pageNo, pageSize: pageSize, search: searchInput };
    const response = await MaintenanceAction.getRepairRequestList(data);
    if (response !== null) {
      if (type) {
        setRepairRequestList(response.data);
        // setCompanySearchArray(response.data);
        setTotalCount(response.totalElements);
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
      setTrigger(false);
    } else {
      setTrigger(false);
      console.log("error");
    }
  }

  useEffect(() => {
    getRepairRequestList(true, "");
  }, [pageSize, pageNo, trigger]);

  const handleSearch = (keyword, exportType) => {
    console.log(repairRequestList);
    const data = keyword.trim().toLowerCase();

    const filtered =
      repairRequestList &&
      repairRequestList.length > 0 &&
      repairRequestList.filter((item) => {
        return (
          item.companyName.toLowerCase().includes(data) ||
          item.companyCode.toLowerCase().includes(data)
        );
      });
    console.log(filtered);
    setCompanySearchArray(filtered);

    if (exportType == "excel") {
      // setExportDataExcel(res.data);
      exportDataList(filtered);

      setTimeout(() => {
        document.getElementById("exportDataList").click();
      }, 500);
    } else if (exportType == "pdf") {
      // setExportDataPdf(res.data);
      exportDataList(filtered);

      setTimeout(() => {
        document.getElementById("exportPdfButton").click();
      }, 500);
    }
  };

  const onPdfDownload = (type) => {
    if (searchKeyword) {
      handleSearch(searchKeyword, "pdf");
    } else {
      getRepairRequestList(false, type);
    }
  };

  const onExcelDownload = (type) => {
    if (searchKeyword) {
      handleSearch(searchKeyword, "excel");
    } else {
      getRepairRequestList(false, type);
    }
  };

  let topViewData = {
    pageTitle: "Repair Request",

    addText: "Add Return Device",

    hideAddButton: false,
    addClick: `/addDeviceToMaintenance/0`,

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

    searchFieldHandler: null,
    searchInput: null,
    searchField: true,
  };
  function getSearchData(data) {
    if (data) {
      setSearchKeyword(data);
      handleSearch(data);
    } else {
      setCompanySearchArray(repairRequestList);
      exportDataList(repairRequestList);
      setSearchKeyword("");
    }
  }
  return (
    <div className="main_container">
      <Box className="main">
        <ThemeProvider theme={theme}>
          <TopView topViewData={topViewData}></TopView>
          <Grid container sx={{ marginTop: "0rem", background: "" }} rowGap={1}>
            <Grid item>
              <div className="search_field">
                <TextField
                  type="search"
                  placeholder="Search"
                  // ref={(input) => input && input.focus()}
                  value={searchInput}
                  onChange={(e) => {
                    if (e.target.value) {
                      setSearchInput(e.target.value);
                    } else {
                      setSearchInput("");

                      setTrigger(true);
                    }
                  }}
                  width={"80%"}
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment>
                        <IconButton onClick={searchFieldHandler}>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={2} xl={1}>
              <div style={{ display: "none" }}>
                <ExportPdf
                  exportData={exportDataPdf || []}
                  labelHeader={tableHeadForExport || []}
                  title="Registered Clients List"
                  reportName="Registered Clients List"
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={2} xl={1.5}>
              <div style={{ display: "none" }}>
                <ExportReport
                  exportData={exportDataExcel || []}
                  labelHeader={tableHeadForExport || []}
                  exportHeading={["Registered Clients List"]}
                />
              </div>
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
                alignItems={"center"}
                spacing={1}
                sx={{ paddingTop: "0px" }}
              >
                {/* <Grid item>
                  <TextField
                    id="outlined-basic"
                    label="Search Client Name"
                    variant="outlined"
                    value={searchKeyword}
                    inputProps={{
                      style: { width: "10rem", height: "0.7rem" },
                      autoComplete: "new-password",
                    }}
                    onChange={(e) => getSearchData(e.target.value)}
                    textAlign="center"
                  />
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
                      {searchTerm === null &&
                        repairRequestList &&
                        repairRequestList.length > 0 &&
                        repairRequestList.map((user, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell sx={{ textAlign: "center" }}>
                                {index + 1}
                              </TableCell>
                              <TableCell
                                sx={{
                                  textAlign: "center",
                                  cursor: "pointer",
                                  color: "#039cf4",
                                }}
                                onClick={() => {
                                  debugger;
                                  const path = `addDeviceToMaintenance/${user.id}`;
                                  window.open(path, "_self");
                                }}
                              >
                                {user.repairCode || "NA"}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                {user?.client?.companyName ?? "NA"}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                {user?.state?.name || "NA"}
                              </TableCell>
                              <TableCell
                                sx={{ textAlign: "center", color: "#039cf4" }}
                              >
                                {user?.totalDevice || 0}
                              </TableCell>
                              <TableCell
                                sx={{ textAlign: "center", color: "green" }}
                              >
                                {user?.repairedDevice ?? "NA"}
                              </TableCell>
                              <TableCell
                                sx={{ textAlign: "center", color: "#FF9800" }}
                              >
                                {user?.pendingDevice || "NA"}
                              </TableCell>
                              <TableCell
                                sx={{ textAlign: "center", color: "red" }}
                              >
                                {user?.replacedDevice ?? "NA"}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                {user?.ewayBillNo || "NA"}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                {moment(user?.createdAt).format(
                                  "DD-MM-YYYY HH:mm"
                                )}
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
}

var tableHeadForExport = [
  "S.No.",
  "Repair Code",
  "Client Name",
  "State",
  "Number Of Devices",
  "Repaired Devices",
  "Pending Devices",
  "Replaced Devices",
  "E-way bill",
  "Created At",
];

export default MaintenanceList;
