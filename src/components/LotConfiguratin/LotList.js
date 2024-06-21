import React, { useState, useEffect, useRef } from "react";
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
import SearchIcon from "@mui/icons-material/Search";

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
  Box,
  Autocomplete,
  InputAdornment,
} from "@mui/material";

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

const lotStatusList = [
  {
    id: 1,
    name: "Completed",
    value: true,
  },
  {
    id: 2,
    name: "Pending",
    value: false,
  },
];
function DeviceLotList() {
  const createLotPermission = JSON.parse(
    localStorage.getItem("data")
  )?.webPermissionDTOList.filter((ele) => {
    return ele.name == "CREATE_LOT" && ele.forWeb == true;
  });
  const timerForClient = useRef(null);
  const [searchInput, setSearchInput] = useState("");
  const [lotList, setLotList] = useState([]);
  const [companySearchArray, setCompanySearchArray] = useState([]);
  const [pageNo, setPageNo] = useState(0);

  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

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

  const navigate = useNavigate();

  async function fetchPrimaryOperator() {
    const response = await DeviceAction.getOperators();
    if (response) {
      setPrimaryOperatorList(response);
    } else {
      setPrimaryOperatorList([]);
    }
  }
  const handleChangePage = (event, newPage) => {
    //console.log(newPage);
    setPageNo(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    //console.log(event.target.value)
    setPageSize(parseInt(event.target.value));
    setPageNo(0);
  };
  async function fetchCompanyData(searchTerm) {
    // setSearchKeyword(searchTerm);
    console.log(searchTerm);
    const data = {
      pageNo: 0,
      pageSize: 0,
      companyName: searchTerm,
    };
    // const data = { pageNo: 15, pageSize: 50 };

    const response = await companyAction.getClientsList(data);
    if (response != null) {
      console.log(response.data);
      setClientList(response?.data);
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

  useEffect(() => {
    fetchDeviceModal();
    fetchSimProviders();
    fetchPrimaryOperator();
    // fetchCompanyData();
  }, []);

  const exportDataList = (exportArray) => {
    console.log(exportArray, "exportarray");
    let exportDataArray = [];
    exportArray &&
      exportArray.length > 0 &&
      exportArray.forEach((item, index) => {
        let objExport = {
          col1: index + 1,
          col2: item?.systemLotId ?? "NA",
          col3: moment(item?.createdAt).format("DD-MM-YYYY hh:mm A") ?? "NA",

          col4: item?.client?.companyName ?? "NA",
          col5: item?.modelId?.model ?? "NA",

          col6: item?.provider?.name ?? "NA",
          col7: item?.operators?.name ?? "NA",

          col8: item.state && item.state.name ? item.state.name : "NA",
          col9: `${item?.testedQuantity ?? 0}/${item?.orderQuantity ?? 0}`,
          col10: item?.isCompleted ? "Completed" : "Incomplete",
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
      name: "LOT  Id",
      width: "150px",
    },
    {
      name: "Created At",
      width: "150px",
    },
    {
      name: "Client Name",
      width: "150px",
    },
    {
      name: "Device Modal",
      width: "150px",
    },
    {
      name: "Sim Provider",
      width: "100px",
    },
    {
      name: "Sim Operator",
      width: "100px",
    },
    {
      name: "State",
      width: "100px",
    },
    {
      name: "Device Count",
      width: "100px",
    },

    {
      name: "Status",
      width: "100px",
    },
  ];

  async function getLotList(type, exportType) {
    let data = {
      pageNo: pageNo,
      pageSize: pageSize,
      imeiNo: searchInput.trim() || "",
    };
    const response = await LotAction.getLotList(data);
    if (response !== null) {
      if (type) {
        setLotList(response.data);
        setCompanySearchArray(response.data);
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
    } else {
      console.log("error");
    }
  }

  useEffect(() => {
    getLotList(true, "");
  }, [pageNo, pageSize]);

  const loadData = () => {
    var companiess = [];
    const start = companySearchArray.length;
    for (let i = start; i < end; i++) {
      if (i < lotList?.length) {
        lotList &&
          lotList.length > 0 &&
          // companySearchArray.push(lotList[i]);
          companiess.push(lotList[i]);

        console.log("companiess", companiess);
      }
    }
    setCompanySearchArray(companiess);
  };

  // window.addEventListener("scroll", () => {
  //   const { scrollY, innerHeight } = window;
  //   const { scrollHeight } = document.documentElement;

  //   if (scrollY + innerHeight <= scrollHeight) {
  //     loadData();
  //     setEnd((prevData) => prevData + 100);
  //   }
  // });
  // moment.utc(item.updatedAt).format("DD/MM/YYYY hh:mm a")

  const filterCLickHandler = () => {
    SetfilterData(!filterData);
  };

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedCompanyId(id);
  };

  const handleClose = (id) => {
    setAnchorEl(null);
  };

  const handleSearch = (keyword, exportType) => {
    console.log(lotList);
    const data = keyword.trim().toLowerCase();

    const filtered =
      lotList &&
      lotList.length > 0 &&
      lotList.filter((item) => {
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

  // useEffect(() => {
  //   handleSearch();
  // }, [searchKeyword]);

  //   const handleChange = async (event, user) => {
  //     // if(status === 10 || status === 20){
  //     //   const payload = CompanyProfile.handleFormSubmit.payload;
  //     //   const status = payload.push({id: null, "isActive": true})
  //     //   const companyUserPostAPI = companyAction.updateCompanyProfile(status)
  //     //   console.log(companyUserPostAPI);
  //     // }
  //     // else{
  //     //   alert("status is not correct");
  //     // }
  //     const payload = {
  //       companyName: user?.companyName,
  //       companyAddress: user.address,
  //       state: user.state ? user.state.id : null,
  //       city: user.city,
  //       email: user.email,
  //       phoneNumber: user.contactNumber,
  //       panNumber: user.PanNumber,
  //       companyLogo: user.convertedUrl,
  //       companyCode: user.companyCode || null,
  //       id: user?.id || null,
  //       isActive: event.target.value,
  //     };
  //     const companyUserPostAPI = await companyAction.updateCompanyProfile(
  //       payload
  //     );
  //     if (companyUserPostAPI) {
  //       setStatus(event.target.value);
  //     }
  //     getLotList(true, "");
  //   };

  const navigateToProfile = () => {
    navigate(`/CompanyProfile`);
  };
  const navigateToViewProfile = (id) => {
    // console.log("id",id);
    navigate(`/ViewCompanyProfile`, {
      state: { id: selectedCompanyId },
    });
  };
  const navigateToEditProfile = (id) => {
    navigate("/companyUpdate", {
      state: { id: selectedCompanyId },
    });
  };

  const handleRefreshButton = () => {
    setSearchKeyword("");
    setFromDate("");
    setToDate("");
    getLotList();
  };

  const onPdfDownload = (type) => {
    if (searchKeyword) {
      handleSearch(searchKeyword, "pdf");
    } else {
      getLotList(false, type);
    }
  };

  const onExcelDownload = (type) => {
    if (searchKeyword) {
      handleSearch(searchKeyword, "excel");
    } else {
      getLotList(false, type);
    }
  };

  let topViewData = {
    pageTitle: "Lot List",

    addText: "Add Company",

    hideAddButton: createLotPermission.length > 0 ? false : true,
    addClick: "/addNewLot",

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
      setCompanySearchArray(lotList);
      exportDataList(lotList);
      setSearchKeyword("");
    }
  }

  function searchClient(getData, delay) {
    // console.log(searchTerm);
    const that = this;
    let latestArgs;

    // console.log(timer);
    return (...args) => {
      debugger;
      latestArgs = args;
      // setSearchKeyword(...args);
      console.log(timerForClient.current);
      if (timerForClient.current) {
        // alert("on");
        clearTimeout(timerForClient.current);
      }
      timerForClient.current = setTimeout(() => {
        debugger;
        getData.apply(that, latestArgs);
      }, delay);
    };
  }

  const debouncedFunctionForClient = searchClient(fetchCompanyData, 1000);
  return (
    <div className="main_container">
      <Box className="main">
        <ThemeProvider theme={theme}>
          <TopView topViewData={topViewData}></TopView>
          <Grid container sx={{ marginTop: "0rem", background: "" }} rowGap={1}>
            <Grid item xs={12} sm={4} md={4} lg={2} xl={1}>
              <div style={{ display: "none" }}>
                <ExportPdf
                  exportData={exportDataPdf || []}
                  labelHeader={tableHeadForExport || []}
                  title="Lot List"
                  reportName="Lot List"
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={2} xl={1.5}>
              <div style={{ display: "none" }}>
                <ExportReport
                  exportData={exportDataExcel || []}
                  labelHeader={tableHeadForExport || []}
                  exportHeading={["Lot List"]}
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
                {false && (
                  <Grid item>
                    <Button
                      sx={{
                        marginTop: "0px",
                        color: "white",
                        width: "8rem",
                        height: "2.6rem",
                      }}
                      variant="contained"
                      onClick={handleSearch}
                    >
                      Submit
                    </Button>
                  </Grid>
                )}

                {/* <Grid item>
                  <Button
                    sx={{ color: "white", width: "10rem", height: "2.7rem" }}
                    variant="contained"
                    onClick={navigateToProfile}
                  >
                    <AddIcon /> Clients
                  </Button>
                </Grid> */}
              </Grid>
            </Grid>
            {true ? (
              <Grid
                item
                xs={12}
                container
                // justifyContent={"space-between"}
                // flexWrap="nowrap"
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
                      Device Modal
                    </Typography>
                    <CustomAutoComplete
                      disablePortal
                      id="combo-box-demo"
                      options={deviceModalList || []}
                      value={deviceModal}
                      getOptionLabel={({ model }) => {
                        return model || "";
                      }}
                      onChange={(e, newValue) => setDeviceModal(newValue)}
                      sx={{ width: 220 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={errors.state}
                          helperText={errors.state}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Sim Provider
                    </Typography>
                    <CustomAutoComplete
                      disablePortal
                      id="combo-box-demo"
                      options={simProviderList || []}
                      value={simProvider}
                      getOptionLabel={({ name }) => {
                        return name || "";
                      }}
                      onChange={(e, newValue) => setSimProvider(newValue)}
                      sx={{ width: 220 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={errors.state}
                          helperText={errors.state}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Status
                    </Typography>
                    <CustomAutoComplete
                      disablePortal
                      id="combo-box-demo"
                      options={lotStatusList || []}
                      value={lotStatus}
                      getOptionLabel={({ name }) => {
                        return name || "";
                      }}
                      onChange={(e, newValue) => setLotStatus(newValue)}
                      sx={{ width: 220 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={errors.state}
                          helperText={errors.state}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Client
                    </Typography>
                    <CustomAutoComplete
                      disablePortal
                      required
                      id="combo-box-demo"
                      options={clientList || []}
                      getOptionLabel={({ companyName }) => {
                        return companyName || "";
                      }}
                      value={client || {}}
                      onChange={(e, newValue) => setClient(newValue)}
                      sx={{ width: 240 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          onChange={(e) => {
                            debouncedFunctionForClient(e.target.value);
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Primary Operator
                    </Typography>
                    <CustomAutoComplete
                      disablePortal
                      id="combo-box-demo"
                      options={primaryOperatorList || []}
                      value={primaryOperator}
                      getOptionLabel={({ name }) => {
                        return name || "";
                      }}
                      onChange={(e, newValue) => setPrimaryOperator(newValue)}
                      sx={{ width: 220 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={errors.state}
                          helperText={errors.state}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Imei number
                    </Typography>
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

                          // setTrigger(true);
                        }
                      }}
                      width={"80%"}
                      size="small"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment>
                            <IconButton onClick={() => getLotList(true)}>
                              <SearchIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  {false && (
                    <Grid item>
                      <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                        {/* Submit */}
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
                        Submit
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            ) : null}
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
                      companySearchArray &&
                      companySearchArray.length > 0
                        ? companySearchArray.map((user, index) => {
                            return (
                              <TableRow key={index}>
                                <TableCell sx={{ textAlign: "center" }}>
                                  {index + 1}
                                </TableCell>

                                <TableCell
                                  sx={{
                                    textAlign: "center",
                                    cursor: "pointer",
                                    color: "blue",
                                  }}
                                  onClick={() => {
                                    debugger;
                                    // const path = `viewLot/${user.id}`;

                                    const path = `DevicesList/${user.id}`;
                                    window.open(path, "_self");
                                  }}
                                >
                                  {user.systemLotId || "NA"}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  {moment(user?.createdAt).format(
                                    "DD-MM-YYYY hh:mm A"
                                  ) ?? "NA"}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  {user?.client?.companyName ?? "NA"}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  {user?.modelId?.model || "NA"}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  {user?.provider?.name || "NA"}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  {user.operators?.name || "NA"}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  {user?.state?.name || "NA"}
                                </TableCell>

                                <TableCell sx={{ textAlign: "center" }}>
                                  {user?.testedQuantity ?? 0}/
                                  {user?.orderQuantity ?? 0}
                                </TableCell>

                                <TableCell sx={{ textAlign: "center" }}>
                                  {user?.isCompleted
                                    ? "completed"
                                    : "incomplete"}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        : filterCompany.map((user, index) => {
                            return (
                              <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{user.companyId}</TableCell>
                                <TableCell>{user.companyName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                  {user.lastIssueDate
                                    ? moment
                                        .utc(user.lastIssueDate)
                                        .utcOffset("+05:30")
                                        .format("DD/MM/YYYY hh:mm a")
                                    : null}
                                </TableCell>
                                <TableCell>{user.lastIssueQuantity}</TableCell>
                                {/* <TableCell>
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={user.isActive || "false"}
                                    // label="Status"
                                    size="small"
                                    width="1.1rem"
                                    height="3rem"
                                    onChange={(event) =>
                                      handleChange(event, user)
                                    }
                                  >
                                    <MenuItem value="true">Active</MenuItem>
                                    <MenuItem value="false">Inactive</MenuItem>
                                  </Select>
                                </TableCell> */}
                                <TableCell>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      textAlign: "center",
                                      color: "black",
                                    }}
                                  >
                                    <Tooltip title="Account settings">
                                      <IconButton
                                        onClick={(event) =>
                                          handleClick(event, user?.id)
                                        }
                                        size="small"
                                        sx={{ ml: 2 }}
                                        aria-controls={
                                          open ? "account-menu" : undefined
                                        }
                                        aria-haspopup="true"
                                        aria-expanded={
                                          open ? "true" : undefined
                                        }
                                      >
                                        <Avatar
                                          alt="Cindy Baker"
                                          // src={`${profileName.userPhotoPath == null
                                          //         ? ""
                                          //         : profileName.userPhotoPath
                                          //     }`}
                                          // size="small"
                                          sx={{ width: "25px", height: "25px" }}
                                        >
                                          <ManageAccountsIcon />
                                        </Avatar>
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                  <Menu
                                    anchorEl={anchorEl}
                                    key={user?.id}
                                    id="account-menu"
                                    open={open}
                                    onClose={() => handleClose(user?.id)}
                                    onClick={handleClose}
                                    PaperProps={{
                                      elevation: 0,
                                      sx: {
                                        overflow: "visible",
                                        filter:
                                          "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                        mt: 1.5,
                                        "& .MuiAvatar-root": {
                                          width: 32,
                                          height: 32,
                                          ml: -0.5,
                                          mr: 1,
                                        },
                                        "&:before": {
                                          content: '""',
                                          display: "block",
                                          position: "absolute",
                                          top: 0,
                                          right: 14,
                                          width: 10,
                                          height: 10,
                                          bgcolor: "background.paper",
                                          transform:
                                            "translateY(-50%) rotate(45deg)",
                                          zIndex: 0,
                                        },
                                      },
                                    }}
                                    transformOrigin={{
                                      horizontal: "right",
                                      vertical: "top",
                                    }}
                                    anchorOrigin={{
                                      horizontal: "right",
                                      vertical: "bottom",
                                    }}
                                  >
                                    <MenuItem
                                      onClick={() =>
                                        navigateToViewProfile(user.id)
                                      }
                                    >
                                      <Avatar
                                        sx={{ width: "20px", height: "20px" }}
                                      />{" "}
                                      View Profile
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() =>
                                        navigateToEditProfile(user.id)
                                      }
                                    >
                                      <EditNoteIcon
                                        sx={{ width: "25px", height: "25px" }}
                                      />{" "}
                                      Edit Profile
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                      <CancelIcon sx={{ color: "grey" }} />{" "}
                                      Cancel
                                    </MenuItem>
                                  </Menu>
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
  "Lot id",
  "Created At",
  "Client Name",
  "Device Modal",
  "Sim Provider",
  "Sim Operator",
  "State",
  "Device Count",

  "Status",
];

export default DeviceLotList;
