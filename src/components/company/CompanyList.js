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
import { useNavigate } from "react-router-dom";
import { companyAction } from "./companyFetchData";
import CompanyProfile from "./CompanyProfile";
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
} from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(14 57 115 / 86%)",
    },
  },
});

function CompanyList() {
  // let companySearchArray = [];
  const timer = useRef(null);
  const [companySearchArray, setCompanySearchArray] = useState([]);
  const [filterData, SetfilterData] = useState(false);
  const [companyListData, SetCompanyListData] = useState([]);
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
  const [totalCount, setTotalCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const exportDataList = (exportArray) => {
    console.log(exportArray, "exportarray");
    let exportDataArray = [];
    exportArray &&
      exportArray.length > 0 &&
      exportArray.forEach((item, index) => {
        let objExport = {
          col1: index + 1,
          col2: item.companyId ? item.companyId : "NA",
          col3: item.companyName,
          col4: item.companyCode,

          col5: item.companyAddress ? item.companyAddress : "NA",
          col6: item.state && item.state.name ? item.state.name : "NA",
          col7: item.city ? item.city : "NA",
          col8: item.phoneNumber ? item.phoneNumber : "NA",
          col9: item.panNumber ? item.panNumber : "NA",
          col10: item.gstNumber ? item.gstNumber : "NA",

          col11: item.lastIssueDate
            ? moment(item.lastIssueDate).format("DD/MM/YYYY hh:mm a")
            : "NA",
          col12: item.lastIssueQuantity ? item.lastIssueQuantity : "NA",
          col13: item.isActive ? "Active" : "Inactive",
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
      name: "Client Id",
      width: "150px",
    },
    {
      name: "Client Name",
      width: "150px",
    },
    {
      name: "Client Code",
      width: "150px",
    },
    {
      name: "Email",
      width: "100px",
    },
    {
      name: "GST No.",
      width: "100px",
    },
    {
      name: "PAN No.",
      width: "100px",
    },
    {
      name: "Last Issue Date",
      width: "100px",
    },
    {
      name: "Last Issue Quantity",
      width: "100px",
    },
    {
      name: "Status",
      width: "100px",
    },
    {
      name: "Action",
      width: "100px",
    },
  ];

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

  async function getCompanies(type, exportType, searchTerm) {
    debugger;
    // setSearchKeyword(searchTerm);
    console.log(searchTerm);
    const data = {
      pageNo: type ? pageNo : 0,
      pageSize: type ? pageSize : 0,
      companyName: searchTerm,
    };
    // const data = { pageNo: 15, pageSize: 50 };

    const response = await companyAction.getClientsList(data);
    if (response !== null) {
      if (type) {
        console.log(response, "responsedatafgbhnj");
        SetCompanyListData(response.data);
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
    if (IdBool) {
      getCompanies(true, "");
    }
    setIdBool(false);
  }, [IdBool]);

  useEffect(() => {
    getCompanies(true, "");
  }, []);

  const loadData = () => {
    var companiess = [];
    const start = companySearchArray.length;
    for (let i = start; i < end; i++) {
      if (i < companyListData?.length) {
        companyListData &&
          companyListData.length > 0 &&
          // companySearchArray.push(companyListData[i]);
          companiess.push(companyListData[i]);

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
    console.log(companyListData);
    const data = keyword?.trim()?.toLowerCase();

    const filtered =
      companyListData &&
      companyListData.length > 0 &&
      companyListData.filter((item) => {
        return (
          item?.companyName?.toLowerCase().includes(data) ||
          item?.companyCode?.toLowerCase().includes(data)
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

  const handleChange = async (event, user) => {
    // if(status === 10 || status === 20){
    //   const payload = CompanyProfile.handleFormSubmit.payload;
    //   const status = payload.push({id: null, "isActive": true})
    //   const companyUserPostAPI = companyAction.updateCompanyProfile(status)
    //   console.log(companyUserPostAPI);
    // }
    // else{
    //   alert("status is not correct");
    // }
    debugger;
    const payload = {
      companyName: user?.companyName,
      companyAddress: user.address,
      state: user.state ? user.state.id : null,
      city: user.city,
      email: user.email,
      phoneNumber: user.contactNumber,
      panNumber: user.PanNumber,
      companyLogo: user.convertedUrl,
      companyCode: user.companyCode || null,
      id: user?.id || null,
      isActive: event.target.value == "false" ? false : true,
    };
    const companyUserPostAPI = await companyAction.updateCompanyProfile(
      payload
    );
    if (companyUserPostAPI) {
      setStatus(event.target.value);
    }
    getCompanies(true, "");
  };

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
    getCompanies();
  };

  const onPdfDownload = (type) => {
    if (searchKeyword) {
      handleSearch(searchKeyword, "pdf");
    } else {
      getCompanies(false, type);
    }
  };

  const onExcelDownload = (type) => {
    if (searchKeyword) {
      handleSearch(searchKeyword, "excel");
    } else {
      getCompanies(false, type);
    }
  };

  let topViewData = {
    pageTitle: "Clients List",

    addText: "Add Company",

    hideAddButton: false,
    addClick: "/CompanyProfile",

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
      setCompanySearchArray(companyListData);
      exportDataList(companyListData);
      setSearchKeyword("");
    }
  }

  function searchVehicle(getData, delay) {
    // console.log(searchTerm);
    const that = this;
    let latestArgs;

    // console.log(timer);
    return (...args) => {
      debugger;
      latestArgs = args;
      // setSearchKeyword(...args);
      console.log(timer.current);
      if (timer.current) {
        // alert("on");
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        debugger;
        getData.apply(that, latestArgs);
      }, delay);
    };
  }

  const debouncedFunction = searchVehicle(getCompanies, 1000);
  return (
    <div className="main_container">
      <Box className="main">
        <ThemeProvider theme={theme}>
          <TopView topViewData={topViewData}></TopView>
          <Grid container sx={{ marginTop: "0rem", background: "" }} rowGap={2}>
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
                <Grid item>
                  <TextField
                    id="outlined-basic"
                    label="Search Client Name"
                    variant="outlined"
                    value={searchKeyword}
                    inputProps={{
                      style: { width: "10rem", height: "0.7rem" },
                      autoComplete: "new-password",
                    }}
                    onChange={(e) => {
                      setSearchKeyword(e.target.value);
                      debouncedFunction(true, "", e.target.value);
                    }}
                    textAlign="center"
                  />
                </Grid>
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
            {false ? (
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
                      From Date
                    </Typography>
                    <TextField
                      name="toDate"
                      type="date"
                      size="small"
                      variant="outlined"
                      // value={toDate}
                      inputProps={{
                        // max: toDate,

                        style: {
                          width: "12rem",
                        },
                      }}
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </Grid>
                  <Grid item>
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

                  <Grid item>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      {/* Reset */}
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
                  </Grid>
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
                                <TableCell sx={{ textAlign: "center" }}>
                                  {user.companyId || "NA"}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  {user.companyName || "NA"}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  {user.companyCode || "NA"}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  {user.email || "NA"}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  {user.gstNumber || "NA"}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  {user.panNumber || "NA"}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  {user.lastIssueDate
                                    ? moment
                                        .utc(user.lastIssueDate)
                                        .utcOffset("+05:30")
                                        .format("DD/MM/YYYY hh:mm A")
                                    : null || "NA"}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  {user.lastIssueQuantity || "NA"}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  <Select
                                    sx={{
                                      color: user.isActive
                                        ? "green"
                                        : "#f44e4efa",
                                    }}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={user.isActive || "false"}
                                    // value={status}
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
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
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
                                          "drop-shadow(0px 1px 1px rgba(0,0,0,0.08))",
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
                                <TableCell>
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
                                    <MenuItem value={true}>Active</MenuItem>
                                    <MenuItem value={false}>Inactive</MenuItem>
                                  </Select>
                                </TableCell>
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
                                      elevation: 1,
                                      sx: {
                                        overflow: "visible",
                                        filter:
                                          "drop-shadow(0px 1px 2px rgba(0,0,0,0.32))",
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
  "Client Id",
  "Client Name",
  "Client Code",
  "Client Address",
  "State",
  "City",
  "Phone Number",
  "Pan Number",
  "GST No",
  "Last Issue Date",
  "last Issue Quantity",
  "Client Status",
];

export default CompanyList;
