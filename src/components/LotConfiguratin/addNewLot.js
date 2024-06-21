import React, { useState, useEffect, useRef } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { LotAction } from "../../components/actions/Lot";
import { DeviceAction } from "../../components/actions/device";
import { companyAction } from "../company/companyFetchData";
import { BoxPackaging } from "../actions/boxPackaging";
import { styled } from "@mui/material/styles";
import TopView from "../CommonComponents/topView";
import ExportReport from "../CommonComponents/Export";
import ExportPdf from "../CommonComponents/exportPdf";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import RefreshIcon from "../../img/Icons/Refresh.svg";
// import Person2Icon from '@mui/icons-material/Person2';
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CommandDetailCard from "./commandDetailCard";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import AddCircleIcon from "@mui/icons-material/AddCircle";

// import CompanyProfile from "./CompanyProfile";

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
import ClientConfigurationUpdate from "./clientConfigurationUpdate";

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
function AddNewLot() {
  // let companySearchArray = [];
  const navigate = useNavigate();
  const timerForClient = useRef(null);

  const [lotList, setLotList] = useState([]);
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
  const [externalVoltage, setExternalVoltage] = useState();
  const [company, setCompany] = useState();
  const [companyListData, setCompanyListData] = useState([]);
  const [state, setState] = useState();
  const [stateList, setStateList] = useState([]);
  const [deviceCount, setDeviceCount] = useState();
  const [masterCommands, setMasterCommands] = useState([]);
  const [clientModalCommands, setClientModalCommands] = useState([]);
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
  const [clientConfigurationModal, setClientConfigurationModal] =
    useState(false);
  const [esmMasterList, setEsmMasterList] = useState([]);
  const [esmMaster, setEsmMaster] = useState([]);

  const clientConfigurationModalHandler = () => {
    setClientConfigurationModal(true);
  };

  async function fetchEsmMaster() {
    const response = await LotAction.emsMaster();
    if (response) {
      setEsmMasterList(response);
    } else {
      setEsmMasterList([]);
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
  async function fetchPrimaryOperator() {
    const response = await DeviceAction.getOperators();
    if (response) {
      setPrimaryOperatorList(response);
    } else {
      setPrimaryOperatorList([]);
    }
  }
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

  async function fetchStateList() {
    const response = await BoxPackaging.getAllStatesList();
    if (response) {
      setStateList(response);
    } else {
      setStateList([]);
    }
  }

  useEffect(() => {
    fetchDeviceModal();
    fetchSimProviders();
    fetchPrimaryOperator();
    // fetchCompanyData();
    fetchStateList();
    fetchEsmMaster();
  }, []);

  function checkCommandCheckListForLot() {
    let data = {
      modelId: deviceModal?.id,
      stateId: state?.id,
      providerId: simProvider?.id,
      clientId: client?.id,
      operatorId: primaryOperator?.id,
    };
    LotAction.getCommandCheckList(data)
      .then((res) => {
        if (res.data) {
          const { commands, modelConfigs } = res.data;
          const array1 = commands.map((ele) => {
            return { ...ele, keyToVerify: JSON.parse(ele.keyToVerify) };
          });
          console.log(array1);
          const array2 = modelConfigs.map((ele) => {
            return { ...ele, keyToVerify: JSON.parse(ele.keyToVerify) };
          });
          console.log(array1);
          setMasterCommands(array1);
          setClientModalCommands(array2);
        } else {
          setMasterCommands([]);
          setClientModalCommands([]);
        }
      })
      .catch((err) => console.log(err));
  }

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
            ? moment.utc(item.lastIssueDate).format("DD/MM/YYYY hh:mm a")
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
      name: "LOT  Id",
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
    let data = {};
    const response = await LotAction.getLotList(data);
    if (response !== null) {
      if (type) {
        setLotList(response.data);
        setCompanySearchArray(response.data);
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
  }, []);

  function addLot() {
    let data = {
      modelId: deviceModal?.id || null,
      stateId: state?.id || null,
      orderQuantity: deviceCount || null,
      clientId: client?.id || null,
      emsMasterId: esmMaster?.id || null,
      emsMasterCode: esmMaster?.code || null,

      userId: JSON.parse(localStorage.getItem("data")).id,
      operatorId: primaryOperator.id || null,
      providerId: simProvider.id || null,
      externalVoltage: externalVoltage || null,
    };
    console.log(data);

    LotAction.addLot(data)
      .then((res) => {
        if (res.responseCode == 201 || res.responseCode == 200) {
          console.log(res);
          navigate("/deviceLot");
        } else {
          alert(res.message);
        }
      })
      .catch((err) => console.log(err));
  }

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
    pageTitle: "Add Lot",

    addText: "Add Company",

    hideAddButton: true,
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

    hidePdfExport: true,
    exportPdfClick: "",
    onPdfDownload: onPdfDownload,

    hideExcelExport: true,
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
        {clientConfigurationModal && (
          <ClientConfigurationUpdate
            title={"Update Client Configuration "}
            open={clientConfigurationModal}
            setOpen={setClientConfigurationModal}
            clientModalCommands={clientModalCommands}
            modelId={deviceModal}
            stateId={state}
            orderQuantity={deviceCount}
            clientId={client}
            operatorId={primaryOperator}
            providerId={simProvider}
            checkCommandCheckListForLot={checkCommandCheckListForLot}
          />
        )}
        <ThemeProvider theme={theme}>
          <TopView topViewData={topViewData}></TopView>
          <Grid container sx={{ marginTop: "0rem", background: "" }} rowGap={1}>
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
            ></Grid>

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
                sx={{ paddingTop: "0px", background: "" }}
                flexWrap={"wrap"}
              >
                <Grid item>
                  <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                    Device Modal
                  </Typography>
                  <CustomAutoComplete
                    disablePortal
                    required
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
                    State
                  </Typography>
                  <CustomAutoComplete
                    disablePortal
                    required
                    id="combo-box-demo"
                    options={stateList || []}
                    value={state}
                    getOptionLabel={({ name }) => {
                      return name || "";
                    }}
                    onChange={(e, newValue) => setState(newValue)}
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
                    Device Count
                  </Typography>
                  <TextField
                    name="deviceCount"
                    type="number"
                    //   label="ToDate"
                    size="small"
                    variant="outlined"
                    value={deviceCount}
                    // fullWidth
                    InputLabelProps={{ shrink: true }}
                    //   value={toDate}
                    inputProps={
                      {
                        // max: toDate,
                        // style: {
                        //   width: "12rem",
                        // },
                      }
                    }
                    onChange={(e) => {
                      setDeviceCount(e.target.value);
                    }}
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
                    Client Name
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
                    ESM Master
                  </Typography>
                  <CustomAutoComplete
                    disablePortal
                    id="combo-box-demo"
                    options={esmMasterList || []}
                    value={esmMaster}
                    getOptionLabel={({ name }) => {
                      return name || "";
                    }}
                    onChange={(e, newValue) => setEsmMaster(newValue)}
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
                    External Voltage
                  </Typography>
                  <TextField
                    name="externalVoltage"
                    type="number"
                    //   label="ToDate"
                    size="small"
                    variant="outlined"
                    value={externalVoltage}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    //   value={toDate}
                    inputProps={
                      {
                        // max: toDate,
                        // style: {
                        //   width: "12rem",
                        // },
                      }
                    }
                    onChange={(e) => {
                      setExternalVoltage(e.target.value);
                    }}
                  />
                </Grid>
                {true && (
                  <Grid item>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      {/* Submit */}
                    </Typography>
                    <Button
                      sx={{
                        marginTop: "24px",
                        color: "white",
                        //   width: "8rem",
                        height: "2.5rem",
                      }}
                      variant="contained"
                      onClick={checkCommandCheckListForLot}
                    >
                      Submit
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ width: "100%", mb: 2 }} elevation={1}>
                {/* <Box component={Paper} elevation={1}> */}
                <Grid container rowGap={1} style={{ padding: 10 }}>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      backgroundColor: "rgb(14 57 115 / 86%)",
                      color: "#fff",
                      padding: "5px 8px",
                      fontSize: "1.1rem",
                      borderRadius: 1,
                    }}
                  >
                    <Typography>Master Configuration</Typography>
                  </Grid>
                  {/* <Grid item xs={12} className="p-2">
                    {masterCommands.map((ele, index) => {
                      return (
                        <Grid item sx={{ minWidth: 300 }}>
                          <CommandDetailCard {...ele}></CommandDetailCard>
                        </Grid>
                      );
                    })}
                  </Grid> */}
                  <Grid
                    item
                    xs={12}
                    // className="p-2"
                    container
                    columnGap={2}
                    minWidth={350}
                  >
                    {masterCommands.map((ele, index) => {
                      return (
                        <Grid item sx={{ minWidth: 300 }}>
                          <CommandDetailCard {...ele}></CommandDetailCard>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>
                {/* </Box> */}
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ width: "100%", mb: 2 }} elevation={1}>
                {/* <Box component={Paper} elevation={1}> */}
                <Grid container rowGap={1} style={{ padding: 10 }}>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      backgroundColor: "rgb(14 57 115 / 86%)",
                      color: "#fff",
                      padding: "5px 8px",
                      fontSize: "1.1rem",
                      borderRadius: 1,
                      display: "flex",
                      justifyContent: "flex-start",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography>Client Configuration</Typography>{" "}
                    <IconButton onClick={clientConfigurationModalHandler}>
                      <AddCircleIcon sx={{ color: "#fff" }} />
                    </IconButton>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    // className="p-2"
                    container
                    columnGap={2}
                    minWidth={350}
                  >
                    {clientModalCommands.map((ele, index) => {
                      return (
                        <Grid item sx={{ minWidth: 300 }}>
                          <CommandDetailCard {...ele}></CommandDetailCard>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>
                {/* </Box> */}
              </Paper>
            </Grid>
            <Grid
              item
              container
              justifyContent={"flex-end"}
              spacing={3}
              sx={{
                padding: "5px",
              }}
            >
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={() => window.open("deviceLot", "_self")}
                >
                  cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  sx={{ color: "white" }}
                  onClick={addLot}
                >
                  {" "}
                  Save
                </Button>
              </Grid>
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

export default AddNewLot;
