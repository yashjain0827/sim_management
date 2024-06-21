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
import PopupState, { bindToggle, bindPopper } from "material-ui-popup-state";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { Search } from "@mui/icons-material";
import InfoIcon from "@mui/icons-material/Info";
import React, { useEffect, useMemo, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import moment from "moment";
import { DashboardAction } from "../actions/dashboard";
import { BoxPackaging } from "../actions/boxPackaging";

import ExportReport from "../CommonComponents/Export";
import ExportPdf from "../CommonComponents/exportPdf";
import DeviceStatusUpdate from "./CreateBox";
import { useNavigate } from "react-router-dom";
import TopView from "../CommonComponents/topView";
import { styled } from "@mui/material/styles";
import { companyAction } from "../company/companyFetchData";
import ImportExcel from "./ImportExcel";
import LoadingComponent from "../CommonComponents/LoadingComponts";
import debouce from "lodash.debounce";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { userService } from "../services";
import config from "../../config/config";
import FilterDataDrawer from "./FIlterDataDrawer";
import ExportAllDataModal from "./exportAllDataModal";
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
// const useStyles = makeStyles((theme) => ({
//   customDivider: {
//     backgroundColor: "black"
//   }
// }));
const Dashboard = () => {
  // const classes = useStyles();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(
    moment(moment().startOf("day")).format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(
    moment(moment().endOf("day")).format("YYYY-MM-DD")
  );
  const [allExportModalOpen, setAllExportModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [data, setData] = useState([]);
  const [AlldeviceList, setAlldeviceList] = useState([]);
  //console.log(data, "data");
  const [totalCount, setTotalCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [IdBool, setIdBool] = useState(false);
  const [search, setSearch] = useState("");
  //console.log(search);
  const [exportDataPdf, setExportDataPdf] = useState([]);
  const [exportDataExcel, setExportDataExcel] = useState([]);
  const [tabStatus, setTabStatus] = useState(null);
  const [showOldFromDate, setShowOldFromDate] = useState(true);
  const [stateList, setStateList] = useState([]);
  const [softwareVersionList, setSoftwareVersionList] = useState([]);
  const [softwareVersionId, setSoftwareVersionId] = useState("");
  const [state, setState] = useState(null);
  const [userStateList, setUserStateList] = useState([]);
  const [localUserDetails, setLocalUserDetails] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [showIssueData, setShowIssueData] = useState(false);
  const [configurationId, setConfigurationId] = useState("");
  const [sentConfigId, setSentConfigId] = useState();
  const [clientList, setClientList] = useState([]);
  const [clientId, setClientId] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [activeId, setActiveId] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [onlineDevice, setOnlineDevice] = useState(false);
  const [lastOnline, setLastOnline] = useState({});
  const [clientNameArray, setClientNameArray] = useState([]);
  const [client, setClient] = useState();
  const [totalData, setTotalData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [simOperator, setSimOperator] = useState([]);
  const [SIM, setSIM] = useState(null);
  const [softwareVersion, setSoftwareVersion] = useState("");
  const [open, setOpen] = useState(false);
  const [newSoftwareVersionList, setNewSoftwareVersionList] = useState([]);
  // const [permission, setPermission] = useState([]);
  console.log(search, "clientId");

  let configurationList = [
    { name: "Done configured", id: true },
    { name: "Not  Done configured", id: false },
  ];
  let SentconfigurationList = [
    { name: "Sent configured", id: true },
    { name: "Not Sentconfigured", id: false },
  ];

  let ActivationList = [
    { name: "Activated", id: true },
    { name: "Not Activated", id: false },
  ];
  useEffect(() => {
    const userDetails = localStorage.getItem("data");
    const getPermissionState = JSON.parse(userDetails);
    setLocalUserDetails(getPermissionState.mobilePermissionDTOList);
  }, []);

  console.log("localUserDetails", AlldeviceList);

  const getAllStates = () => {
    BoxPackaging.getAllStatesList()
      .then((res) => {
        if (res != null) {
          setStateList((previous) => {
            return previous.concat(res);
          });
        } else {
          setStateList([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getUserAllStates = () => {
    BoxPackaging.getAllStatesList()
      .then((res) => {
        if (res != null) {
          setUserStateList((previous) => {
            return previous.concat(res);
          });
        } else {
          setUserStateList([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchSoftwareVirsionList = () => {
    DashboardAction.fetchSoftwareVirsionList().then((res) => {
      if (res !== null) {
        setSoftwareVersionList(res.data && res.data.softwareVersionList);
      } else {
      }
    });
  };
  //console.log(exportDataPdf)
  const exportDataList = (exportArray, exportType) => {
    console.log(exportArray, exportType, "exportarray");
    let exportDataArray = [];
    exportArray.forEach((item, index) => {
      let objExport = {
        col1: index + 1,
        col2: item.updatedAt
          ? moment(item.updatedAt).format("DD/MM/YYYY hh:mm A")
          : "NA",
        col3: item.createdBy ? item.createdBy.name : "NA",
        col4: item.imeiNo ? item.imeiNo : "NA",
        col5: item.iccidNo ? item.iccidNo : "NA",
        col6: item.uuidNo ? item.uuidNo : "NA",

        col7: item.softwareVersion ? item.softwareVersion : "",
        col8: item.status ? item.status : "NA",

        col9: item && item.state && item.state.name ? item.state.name : "NA",
        col10:
          item && item.clientName && item.clientName ? item.clientName : "NA",
        col11: item && item.sim1Provider ? item.sim1Provider : "NA",
        col12: item.sim1ActivationDate
          ? moment.utc(item.sim1ActivationDate).format("DD/MM/YYYY")
          : "NA",
        col13: item.sim1ExpiryDate
          ? moment.utc(item.sim1ExpiryDate).format("DD/MM/YYYY")
          : "NA",
        col14: item.sim1Operator ? item.sim1Operator : "NA",
        col15: item.sim2Operator ? item.sim2Operator : "NA",
        // col17: item.sim2Provider ? item.sim2Provider : "NA",
        col16:
          item && item.sim1Number && exportType == "excel"
            ? item.sim1Number
            : "NA",
        col17:
          item && item.sim2Number && exportType == "excel"
            ? item?.sim2Number
            : "NA",

        col18:
          item && item.issueDate && exportType === "excel"
            ? moment.utc(item.issueDate).format("DD/MM/YYYY hh:mm A")
            : "NA",
        col19: item.packedDate
          ? moment.utc(item?.packedDate).format("DD/MM/YYYY hh:mm A")
          : "NA",
        col20: item?.packet ?? "NA",
        col21: `${item.detail}, Sim1 Number: ${
          item.sim1Number ? item.sim1Number : "NA"
        }, Sim1 Operator: ${
          item.sim1Operator ? item.sim1Operator : "NA"
        },Sim1Provider: ${
          item.sim1Provider ? item.sim1Provider : "NA"
        }, Sim2Number: ${
          item.sim2Number ? item.sim2Number : "NA"
        }, Sim2Operator: ${
          item.sim2Operator ? item.sim2Operator : "NA"
        }, Sim Activation Date: ${
          item.sim1ActivationDate
            ? moment.utc(item.sim1ActivationDate).format("DD/MM/YYYY hh:mm A")
            : "NA"
        }, Sim Expiry Date: ${
          item.sim1ExpiryDate
            ? moment.utc(item.sim1ExpiryDate).format("DD/MM/YYYY hh:mm A")
            : "NA"
        }, last Polling Date: ${moment
          .utc(item.packedDate)
          .format("DD/MM/YYYY hh:mm A")}`,
      };
      exportDataArray.push(objExport);
    });

    setExportDataPdf(exportDataArray);

    let objExport = {};

    tableHeadForExportForExcel.forEach((element, index) => {
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
      name: "Updated At",
      width: "150px",
    },
    {
      name: "Created By",
      width: "150px",
    },
    {
      name: "IMEI Number",
      width: "100px",
    },
    {
      name: "ICCID Number",
      width: "100px",
    },

    {
      name: "UUID Number",
      width: "100px",
    },
    {
      name: "Sim1 No.",
      width: "100px",
    },
    // {
    //   name: "Sim1 Activation Date",
    //   width: "150px"
    // },
    // {
    //   name: "Sim1 Expiry Date",
    //   width: "150px"
    // },
    {
      name: "Sim1 Operator",
      width: "100px",
    },
    {
      name: "Sim Provider",
      width: "100px",
    },
    {
      name: "Sim2 No.",
      width: "100px",
    },
    // {
    //   name: "Sim2 Activation Date",
    //   width: "150px"
    // },
    // {
    //   name: "Sim2 Expiry Date",
    //   width: "150px"
    // },
    {
      name: "Sim2 Operator",
      width: "100px",
    },

    {
      name: "Sim Activation Date",
      width: "150px",
    },
    {
      name: "Sim Expiry Date",
      width: "150px",
    },
    {
      name: "Software Version",
      width: "200px",
    },
    {
      name: "Status",
      width: "150px",
    },
    {
      name: "Last Polling Date",
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
      name: "Details",
      width: "100px",
    },
  ];

  const lastOnlineDaysAgoObject = [
    {
      name: 2,
      value: "TWO_DAYS_AGO",
    },
    {
      name: 3,
      value: "THREE_DAYS_AGO",
    },
    {
      name: 7,
      value: "SEVEN_DAYS_AGO",
    },
    {
      name: 10,
      value: "TEN_DAYS_AGO",
    },
    {
      name: 15,
      value: "FIFTEEN_DAYS_AGO",
    },
    {
      name: 20,
      value: "TWENTY_DAYS_AGO",
    },
    {
      name: 30,
      value: "THIRTY_DAYS_AGO",
    },
    {
      name: "More Than 30",
      value: "MORE_THEN_THIRTY_DAYS_AGO",
    },
  ];
  let userId = localStorage.getItem("userID");

  const ExportAllData = async (email) => {
    let payload = {
      userId: JSON.parse(userId),
      // token: JSON.parse(Token),
      pageNo: 0,
      pageSize: 0,
      fromDate: !showOldFromDate ? Date.parse(fromDate) : 6268266000,
      toDate: Date.parse(toDate),
      stateId: state ? state.id : null,
      search: search ? search : "",
      statusMaster:
        tabStatus == "onlineDevice" || tabStatus == null ? null : tabStatus,
      showTabData: tabStatus ? false : true,
      softwareVersion: softwareVersionId,
      isConfigActive: activeId ? activeId.id : null,
      isConfigDone: configurationId ? configurationId.id : null,
      isConfigSent: sentConfigId ? sentConfigId.id : null,
      clientIds: clientId ? [clientId] : null,
      onlineDevice: onlineDevice ? onlineDevice : false,
      lastOnline: lastOnline ? lastOnline.value : null,
      simOperator: SIM ? SIM : null,
      softwareVersionList: newSoftwareVersionList
        ? newSoftwareVersionList
        : null,
      notifyEmailId: email && email,
    };

    const res = await DashboardAction.exportDataToEmail(payload);
  };

  const showData = async (type, exportType, email) => {
    setLoading(true);
    let payload = {
      userId: JSON.parse(userId),
      // token: JSON.parse(Token),
      pageNo: type ? pageNo : 0,
      pageSize: type ? pageSize : 0,
      fromDate: !showOldFromDate ? Date.parse(fromDate) : 6268266000,
      toDate: Date.parse(toDate),
      stateId: state ? state.id : null,
      search: search ? search : "",
      statusMaster:
        tabStatus == "onlineDevice" || tabStatus == null ? null : tabStatus,
      showTabData: tabStatus ? false : true,
      softwareVersion: softwareVersionId,
      isConfigActive: activeId ? activeId.id : null,
      isConfigDone: configurationId ? configurationId.id : null,
      isConfigSent: sentConfigId ? sentConfigId.id : null,
      clientIds: clientId ? [clientId] : null,
      onlineDevice: onlineDevice ? onlineDevice : false,
      lastOnline: lastOnline ? lastOnline.value : null,
      simOperator: SIM ? SIM : null,
      softwareVersionList: newSoftwareVersionList
        ? newSoftwareVersionList
        : null,
    };

    const res = await DashboardAction.getAllDashboardData(payload);

    if (res) {
      setAlldeviceList(res.data);
      if (type) {
        setData(res.data);
        setTotalCount(res);
        setLoading(false);
      } else {
        if (exportType == "excel") {
          // setExportDataExcel(res.data);
          exportDataList(res.data, exportType);
          setLoading(false);

          setTimeout(() => {
            document.getElementById("exportDataList").click();
            setLoading(false);
          }, 500);
        } else if (exportType == "pdf") {
          // setExportDataPdf(res.data);
          exportDataList(res.data);

          setTimeout(() => {
            document.getElementById("exportPdfButton").click();
            setLoading(false);
          }, 500);
        }
        setLoading(false);
      }

      if (exportType == "excel") {
        // setExportDataExcel(res.data);
        exportDataList(res.data, exportType);
        setLoading(false);

        setTimeout(() => {
          document.getElementById("exportDataList").click();
          setLoading(false);
        }, 500);
      } else if (exportType == "pdf") {
        // setExportDataPdf(res.data);
        exportDataList(res.data);

        setTimeout(() => {
          document.getElementById("exportPdfButton").click();
          setLoading(false);
        }, 500);
      }
    } else {
      if (!exportType) {
        setData([]);
        setTotalCount(0);
      }
    }
  };

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

  const onPdfDownload = (type) => {
    showData(true, type);
  };

  const onExcelDownload = (type) => {
    showData(true, type);
  };

  const handleSubmit = (button) => {
    // setShowOldFromDate(false);
    showData(button, true, null);
    // setIdBool(true);
  };

  function stateHandler(data) {
    if (data) {
      setState(data);
    } else {
      setState({ id: "", name: "" });
    }
  }

  async function stateHandlerUser(e, localUser, item, index) {
    const payload = {
      deviceId: item.id,
      stateId: localUser && localUser.id,
    };
    const currentArray = [...data];
    currentArray[index].state = localUser;
    console.log("currentArray: ", currentArray, index);
    setData(currentArray);
    console.log("payload", payload);
    const api = await DashboardAction.updateStates(payload);
    console.log("api", api);
    // if (localUser) {
    //   console.log("localUser",localUser);
    //   setUserState(localUser);
    // } else {
    //   setUserState({ id: "", name: "" });
    // }
  }

  async function getClientList(type, exportType) {
    const response = await companyAction.getCompanyList();
    if (response !== null) {
      setClientList(response && response.data);
      // setClientData(response ? response.data : []);
    } else {
      console.log("error");
    }
  }

  const fetchSimOperator = async () => {
    const response = await DashboardAction.fetchSimOperator();
    if (response !== null) {
      setSimOperator(response || response.data);
    } else {
      setSimOperator([]);
      console.log("error", response.message);
    }
  };
  // useEffect(() => {
  //   fetchSimOperator();
  // }, []);

  const globalSearcValueHandler = (e) => {
    setSearch(e.target.value);
    setIdBool(true);
    if (e.target.value === "") {
      setIdBool(true);
      setPageNo(0);
    }
  };

  const getFilteredBoxList = () => {
    if (!searchValue) {
      return setData(AlldeviceList);
    } else if (searchValue) {
      // alert("kkk")
      const filteredUserInfo =
        data &&
        data.filter((user) =>
          user.imeiNo.toLowerCase().trim().includes(searchValue.toLowerCase())
        );
      //   document.getElementById("input").focus();
      // console.log(filteredUserInfo, "filteredUserInfo");
      setData(filteredUserInfo);
    }
  };

  const ExcelImportModal = () => {
    setOpenModal(true);
  };
  const closeExcelImportModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    getFilteredBoxList();
  }, [searchValue]);

  const debouncedResults = useMemo(() => {
    return debouce(globalSearcValueHandler, 1000);
  }, []);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  const filteredValue = [
    {
      typeId: 1,
      label: "Software Version",
      value: softwareVersion || "",
      style: {},
      size: "small",
      isDisabled: true,
    },
    {
      typeId: 2,
      label: "Last Offline Since",
      option: lastOnlineDaysAgoObject ? lastOnlineDaysAgoObject : [],
      value: lastOnline || {},
      function: (event, newValue) => {
        lastOnlineDevice(newValue);
      },
    },
    {
      typeId: 2,
      label: "Select Clients",
      option: clientNameArray ? clientNameArray : [],
      value: client || {},
      function: (event, newValue) => {
        clientFilterFunction(newValue);
      },
    },
    {
      typeId: 3,
      label: "SIM Provider",
      option: simOperator ? simOperator : [],
      value: SIM || "",
      function: (event, newValue) => {
        fetchSimOperatorList(newValue);
      },
    },
  ];

  console.log(filteredValue, "bdjdf");
  let topViewData = {
    pageTitle: "All Devices",
    /* ================= */
    addText: "Add Company",
    // hideAddButton: !webPermission.includes("ADD_COMPANY"),
    hideAddButton: true,
    addClick: "/",
    /* ====================== */
    editText: "",
    hideEditButton: true,
    editClick: null,
    /* =========================== */
    cancelText: null,
    hideCancelButton: true,
    cancelClick: null,
    /* ================== */
    updateText: null,
    hideUpdateButton: true,
    updateClick: null,
    /* ================== */
    hidePdfExport: false,
    exportPdfClick: "",
    onPdfDownload: onPdfDownload,
    /* ================= */
    hideExcelExport: false,
    exportExcelClick: "",
    onExcelDownload: onExcelDownload,
    /* ==================== */
    hideExcelImport: false,
    excelImportClick: ExcelImportModal,
    /* ==================== */
    filter: true,
    filterHandler: null,
    /* ====================== */

    searchFieldHandler: debouncedResults,
    searchInput: search,
    searchField: false,
    filteredValue: filteredValue,
  };

  useEffect(() => {
    if (IdBool) {
      showData(true, null);
    }
    // else {
    //   showData(true);
    // }
    setIdBool(false);
  }, [IdBool, tabStatus]);

  useEffect(() => {
    getAllStates();
    // getClientList();
    fetchClientsAPI();
    fetchSoftwareVirsionList();
    fetchSimOperator();
    showData(true);
  }, []);
  ////;

  // useEffect(() => {
  //   getUserAllStates();
  // }, []);
  const onlineDeviceHandler = () => {
    setOnlineDevice(true);
    setIdBool(true);
  };

  const tabStatusHandler = (tabName) => {
    setOnlineDevice(false);
    console.log(tabName, "tabName");
    if (tabName === "ISSUED_DEVICES") {
      setIdBool(true);
      setShowIssueData(true);
      setHasPermission(false);
    } else {
      setIdBool(true);
      setShowIssueData(false);
    }
    if (tabName != null) {
      setIdBool(true);
      // setShowOldFromDate(true);
    }
    if (tabName == "onlineDevice") {
      setOnlineDevice(true);
    }
    if (tabName === "filterConfiguration") {
      setOpen(true);
      // setLoading(false);
      setIdBool(false);
    }
    setTabStatus(tabName);
    setPageNo(0);
    setPageSize((pre) => {
      return pre;
    });
  };

  useEffect(() => {
    if (
      localUserDetails &&
      localUserDetails.length > 0 &&
      data &&
      data.length > 0
    ) {
      const isPresent = localUserDetails.find(
        (val) => val.name === "GET_ALL_STATE"
      );
      // console.log("adjkcljksdcjs", isPresent);
      if (isPresent && Object.keys(localUserDetails).length > 0) {
        setHasPermission(true);
      }
    }
    // else if (showIssueData === true) {
    //   setHasPermission(false);
    // }
  }, [localUserDetails, data, showIssueData]);

  const lastOnlineDevice = (newValue) => {
    if (newValue !== null) {
      setLastOnline(newValue);
      // setIdBool(true);
    } else {
      setLastOnline(null);
      setIdBool(true);
    }
  };

  useEffect(() => {
    if (lastOnline && Object.keys(lastOnline).length > 0) {
      showData(true, null);
    }
  }, [lastOnline]);

  const fetchClientsAPI = () => {
    companyAction.getCompanyList().then((response) => {
      setClientList(response && response);
      setClientData(response ? response.data : []);
    });
  };

  // useEffect(() => {
  //   fetchClientsAPI();
  // }, []);

  // filter the data through client name
  useEffect(() => {
    const transformedData =
      clientData &&
      clientData
        .filter(
          (ele) =>
            ele && ele.companyName !== undefined && ele.companyName !== null
        )
        .map((ele) => ({ id: ele.id, name: ele.companyName }));

    setClientNameArray(transformedData);
  }, [clientData]);

  console.log("hh", clientNameArray);

  const clientFilterFunction = (newValue) => {
    setClient(newValue);
    if (newValue !== null) {
      setClientId(newValue?.id);
      setIdBool(true);
    } else {
      setClientId(null);
      setIdBool(true);
    }
  };

  const fetchSimOperatorList = (newValue) => {
    if (newValue !== null) {
      setSIM(newValue);
      setIdBool(true);
    } else {
      setSIM(null);
      setIdBool(true);
    }
  };

  console.log(simOperator);

  const getSoftwareVersion = async () => {
    const apiEndPoint = `${config.baseUrl}${config.apiName.getSoftwareVersion}`;
    const response = await userService.get(apiEndPoint);
    try {
      if (
        response &&
        response?.data?.responseCode === 200 &&
        response?.data?.data
      ) {
        setSoftwareVersion(response.data.data);
        // setOldSoftwareVersion(response.data.data);
      } else setSoftwareVersion("");
    } catch (error) {
      alert(error.message);
      setSoftwareVersion("");
    }
  };

  useEffect(() => {
    getSoftwareVersion();
  }, []);

  const handleSingleUserInformation = (item) => {
    console.log(item, "jhgbn");
    const serializableData = {
      userId: item ? item : null,
    };
    if (item) {
      navigate("/viewDeviceDetails", {
        state: {
          user: serializableData,
        },
      });
    } else {
      alert("No Data Found!");
    }
    // navigate("/viewDeviceDetails", {
    //   state: {
    //     user: serializableData
    //   }
    // });
  };

  return (
    <div className="main_container">
      <LoadingComponent isLoading={loading} />
      <Box className="main">
        <ThemeProvider theme={theme}>
          <Grid container alignItems={"center"}>
            <Grid item xs={11}>
              <TopView topViewData={topViewData}></TopView>
            </Grid>
            <Grid item xs={1} sx={{ paddingLeft: 3, textAlign: "center" }}>
              <Button
                sx={{ color: "white", padding: "6px 8px" }}
                variant="contained"
                onClick={() => setAllExportModalOpen(true)}
              >
                Export All
              </Button>
            </Grid>
          </Grid>

          <ExportAllDataModal
            open={allExportModalOpen}
            setAllExportModalOpen={setAllExportModalOpen}
            emaill={email}
            setEmail={setEmail}
            fetchData={(email) => ExportAllData(email)}
          ></ExportAllDataModal>

          <ImportExcel
            openModal={openModal}
            setOpenModal={setOpenModal}
            showData={showData}
            closeExcelImportModal={closeExcelImportModal}
          />

          <Grid item xs={12} container>
            {/* <Grid item container spacing={3} sx={{ height: "0px" }}>
              <Grid item xs={12} sm={4} md={4} lg={2} xl={1.5}>
                <TextField
                  id="outlined-basic"
                  label="Current Software Version"
                  variant="outlined"
                  value={softwareVersion || "NA"}
                  sx={{
                    top: "-50px",
                    left: "20.1rem",
                    zIndex: "100"
                  }}
                  size="small"
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={2} xl={1.5}>
                <CustomAutoComplete
                  disablePortal
                  id="combo-box-demo"
                  options={
                    lastOnlineDaysAgoObject ? lastOnlineDaysAgoObject : []
                  }
                  value={lastOnline || {}}
                  fullWidth
                  getOptionLabel={({ name }) => (name ? name : "")}
                  onChange={(e, newValue) => lastOnlineDevice(newValue)}
                  sx={{ width: 220 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputLabelProps={{ shrink: true }}
                      label="Last Offline since"
                      sx={{ top: "-50px", left: "19.5rem", zIndex: "100" }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={2} xl={1.5}>
                <CustomAutoComplete
                  disablePortal
                  id="combo-box-demo"
                  options={clientNameArray || []}
                  value={client || ""}
                  fullWidth
                  getOptionLabel={(option) => (option.name ? option.name : "")}
                  onChange={(event, newValue) => clientFilterFunction(newValue)}
                  sx={{ width: 220 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputLabelProps={{ shrink: true }}
                      label="Select Clients"
                      sx={{ top: "-50px", left: "20.5rem", zIndex: 100 }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4} lg={2} xl={1.5}>
                <CustomAutoComplete
                  disablePortal
                  id="combo-box-demo"
                  options={simOperator || []}
                  value={SIM || []}
                  fullWidth
                  itemType="array"
                  getOptionLabel={(option) => (option ? option : "")}
                  onChange={(e, newValue) => fetchSimOperatorList(newValue)}
                  sx={{ width: 220 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputLabelProps={{ shrink: true }}
                      label="SIM Provider"
                      sx={{ top: "-50px", left: "21.5rem", zIndex: 100 }}
                    />
                  )}
                />
              </Grid>
            </Grid> */}
            <Grid item xs={12} sm={4} md={4} lg={2} xl={1}>
              <div style={{ display: "none" }}>
                <ExportPdf
                  exportData={exportDataPdf || []}
                  labelHeader={tableHeadForExport || []}
                  title="Watsoo Device Management"
                  reportName="Watsoo Device Management"
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={2} xl={1.5}>
              <div style={{ display: "none" }}>
                <ExportReport
                  exportData={exportDataExcel || []}
                  labelHeader={tableHeadForExportForExcel || []}
                  exportHeading={["Watsoo Device Management"]}
                />
              </div>
            </Grid>
          </Grid>

          <Grid
            container
            sx={{ marginTop: "2px" }}
            rowGap={2}
            md={{ margin: "2px 0px" }}
            xl={{ margin: "2px 0px" }}
            lg={{ margin: "5px 0px" }}
          >
            <Grid
              item
              xs={12}
              container
              // justifyContent={"space-between"}
              flexWrap="nowrap"
              alignItems={"center"}
            >
              <Grid
                // item
                // xs={12}
                // container
                justifyContent={"flex-start"}
                alignItems="center"
                // spacing={1}
                sx={{ paddingTop: "0px" }}
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: "5px",
                  width: "100%",
                }}
              >
                <Grid style={{ marginTop: "1.4rem", width: "100%" }}>
                  {/* <Typography
                    // variant="subtitle2"
                    // gutterBottom
                    sx={{ color: "rgb(14 57 115 / 86%)" }}
                  >
                    FromDate
                  </Typography> */}
                  <TextField
                    name="fromDate"
                    //label="With normal TextField"
                    type="date"
                    size="small"
                    label="FromDate"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    inputProps={
                      {
                        // max: toDate,
                        // style: {
                        //   width: "12rem",
                        // },
                      }
                    }
                    fullWidth
                    value={fromDate}
                    onChange={(e) => {
                      setShowOldFromDate(false);
                      setFromDate(e.target.value);
                    }}
                  />
                </Grid>
                <Grid style={{ marginTop: "1.4rem", width: "100%" }}>
                  {/* <Typography
                    // variant="subtitle2"
                    // gutterBottom
                    sx={{ color: "rgb(14 57 115 / 86%)" }}
                  >
                    ToDate
                  </Typography> */}
                  <TextField
                    name="toDate"
                    type="date"
                    label="ToDate"
                    size="small"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={toDate}
                    inputProps={
                      {
                        // max: toDate,
                        // style: {
                        //   width: "12rem",
                        // },
                      }
                    }
                    onChange={(e) => {
                      setToDate(e.target.value);
                    }}
                  />
                </Grid>

                <Grid style={{ marginTop: "1.4rem", width: "100%" }}>
                  {/* <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                    Search
                  </Typography> */}
                  <TextField
                    name="search"
                    label="Search With IMEI number"
                    type="text"
                    size="small"
                    variant="outlined"
                    inputProps={{}}
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      // if (e.target.value == "") {
                      //   setIdBool(true);
                      //   setPageNo(0);
                      // }
                    }}
                    InputProps={{
                      startAdornment: (
                        <IconButton
                          onClick={() => {
                            // setIdBool(true);
                          }}
                        >
                          <Search color="primary" position="start" />
                        </IconButton>
                      ),
                      endAdornment:
                        search !== "" ? (
                          <IconButton
                            onClick={() => {
                              setSearchValue("");
                            }}
                          >
                            <ClearRoundedIcon />
                          </IconButton>
                        ) : (
                          ""
                        ),
                    }}
                  />
                </Grid>
                {showIssueData === true && (
                  <Grid style={{ marginTop: "1.4rem", width: "100%" }}>
                    <CustomAutoComplete
                      disablePortal
                      id="combo-box-demo"
                      options={stateList ? stateList : []}
                      value={state}
                      fullWidth
                      getOptionLabel={({ name }) => {
                        return name;
                      }}
                      onChange={(e, newValue) => stateHandler(newValue)}
                      // sx={{ width: 200 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          InputLabelProps={{ shrink: true }}
                          label="Select State"
                        />
                      )}
                    />
                  </Grid>
                )}

                <Grid style={{ marginTop: "1.4rem", width: "100%" }}>
                  <CustomAutoComplete
                    disablePortal
                    id="combo-box-demo"
                    options={softwareVersionList ? softwareVersionList : []}
                    // value={softwareVersionList}
                    fullWidth
                    getOptionLabel={(value) => {
                      return value;
                    }}
                    onChange={(e, newValue) => setSoftwareVersionId(newValue)}
                    // sx={{ width: 200 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        InputLabelProps={{ shrink: true }}
                        label="Select Software Version"
                      />
                    )}
                  />
                </Grid>
                <Grid style={{ marginTop: "1.4rem", width: "100%" }}>
                  <CustomAutoComplete
                    disablePortal
                    id="combo-box-demo"
                    options={SentconfigurationList ? SentconfigurationList : []}
                    // value={configurationId}
                    getOptionLabel={({ name }) => {
                      return name;
                    }}
                    fullWidth
                    onChange={(e, newValue) => setSentConfigId(newValue)}
                    // sx={{ width: 200 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        InputLabelProps={{ shrink: true }}
                        label="Sent Configuration Stataus"
                      />
                    )}
                  />
                </Grid>
                <Grid style={{ marginTop: "1.4rem", width: "100%" }}>
                  <CustomAutoComplete
                    disablePortal
                    id="combo-box-demo"
                    options={configurationList ? configurationList : []}
                    // value={configurationId}
                    getOptionLabel={({ name }) => {
                      return name;
                    }}
                    fullWidth
                    onChange={(e, newValue) => setConfigurationId(newValue)}
                    // sx={{ width: 200 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        InputLabelProps={{ shrink: true }}
                        label="Done Configuration Stataus"
                        // placeholder="Done Configuration Stataus"
                      />
                    )}
                  />
                </Grid>
                <Grid style={{ marginTop: "1.4rem", width: "100%" }}>
                  <CustomAutoComplete
                    disablePortal
                    id="combo-box-demo"
                    options={ActivationList ? ActivationList : []}
                    // value={configurationId}
                    getOptionLabel={({ name }) => {
                      return name;
                    }}
                    fullWidth
                    onChange={(e, newValue) => setActiveId(newValue)}
                    // sx={{ width: 200 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        InputLabelProps={{ shrink: true }}
                        label="Activation Stataus"
                      />
                    )}
                  />
                </Grid>
                {showIssueData === true && (
                  <Grid item style={{ marginTop: "1.4rem", width: "100%" }}>
                    <CustomAutoComplete
                      disablePortal
                      id="combo-box-demo"
                      options={clientList ? clientList : []}
                      // value={configurationId}
                      getOptionLabel={({ companyName }) => {
                        return companyName;
                      }}
                      fullWidth
                      onChange={(e, newValue) => setClientId(newValue)}
                      //  sx={{ width:"100%" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          InputLabelProps={{ shrink: true }}
                          label="Select Clients"
                        />
                      )}
                    />
                  </Grid>
                )}
                <Grid item sx={{ marginTop: "20px" }}>
                  <Button
                    sx={{ color: "white" }}
                    variant="contained"
                    onClick={() => handleSubmit("show")}
                  >
                    Show
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              container
              justifyContent={"flex-start"}
              columnGap={4}
              sx={{ margin: "2px 0px" }}
            >
              <Grid item>
                <Button
                  onClick={() => tabStatusHandler(null)}
                  variant={
                    tabStatus == null || tabStatus == ""
                      ? "contained"
                      : "outlined"
                  }
                  sx={{
                    padding: "0.5rem",
                    margin: "2px 0px",
                    border: "1px solid rgb(14 57 115 / 86%)",
                    color: tabStatus == null ? "black" : "black",
                    backgroundColor: tabStatus == null ? "#61ABE2" : "#DFF1FF",
                  }}
                >
                  Total Devices :
                  <span style={{ fontWeight: "bold" }}>
                    {totalCount && totalCount.totalDevice
                      ? totalCount.totalDevice
                      : 0}
                  </span>
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => tabStatusHandler("TESTED")}
                  variant={tabStatus == "TESTED" ? "contained" : "outlined"}
                  sx={{
                    padding: "0.5rem",
                    margin: "2px 0px",
                    border: "1px solid rgb(14 57 115 / 86%)",
                    color: tabStatus == "TESTED" ? "black" : "black",
                    backgroundColor:
                      tabStatus == "TESTED" ? "#61ABE2" : "#DFF1FF",
                  }}
                >
                  TESTED Devices :
                  <span style={{ fontWeight: "bold" }}>
                    {totalCount && totalCount.testedCount
                      ? totalCount.testedCount
                      : 0}
                  </span>
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => tabStatusHandler("DEVICE_PACKED")}
                  variant={
                    tabStatus == "DEVICE_PACKED" ? "contained" : "outlined"
                  }
                  sx={{
                    padding: "0.5rem",
                    margin: "2px 0px",
                    border: "1px solid rgb(14 57 115 / 86%)",
                    color: tabStatus == "DEVICE_PACKED" ? "black" : "black",
                    backgroundColor:
                      tabStatus == "DEVICE_PACKED" ? "#61ABE2" : "#DFF1FF",
                  }}
                >
                  PACKED devices :
                  <span style={{ fontWeight: "bold" }}>
                    {totalCount && totalCount.devicePackedCount
                      ? totalCount.devicePackedCount
                      : 0}
                  </span>
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => tabStatusHandler("BOX_PACKED")}
                  variant={tabStatus == "BOX_PACKED" ? "contained" : "outlined"}
                  sx={{
                    padding: "0.5rem",
                    margin: "2px 0px",
                    border: "1px solid rgb(14 57 115 / 86%)",
                    color: tabStatus == "BOX_PACKED" ? "black" : "black",
                    backgroundColor:
                      tabStatus == "BOX_PACKED" ? "#61ABE2" : "#DFF1FF",
                  }}
                >
                  Box packed Devices :
                  <span style={{ fontWeight: "bold" }}>
                    {totalCount && totalCount.boxPackedCount
                      ? totalCount.boxPackedCount
                      : 0}
                  </span>
                </Button>
              </Grid>
              <Grid
                item
                style={{ display: "inline-flex", position: "relative" }}
              >
                <Divider
                  orientation="vertical"
                  variant="middle"
                  style={{ backgroundColor: "black", marginTop: "-1px" }}
                  spacing={1}
                />

                <Divider
                  orientation="vertical"
                  variant="middle"
                  style={{ backgroundColor: "black", marginTop: "-1px" }}
                />
              </Grid>

              <Grid item>
                <Button
                  onClick={() => tabStatusHandler("ISSUED_DEVICES")}
                  variant={
                    tabStatus == "ISSUED_DEVICES" ? "contained" : "outlined"
                  }
                  sx={{
                    padding: "0.5rem",
                    margin: "2px 0px",
                    border: "1px solid rgb(14 57 115 / 86%)",
                    color: tabStatus == "ISSUED_DEVICES" ? "black" : "black",
                    backgroundColor:
                      tabStatus == "ISSUED_DEVICES" ? "#f6f6b3" : "#f5f5dc",
                  }}
                >
                  <span>Total Issued Devices :</span>{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {totalCount && totalCount.deviceIssuedCount
                      ? totalCount.deviceIssuedCount
                      : 0}
                  </span>
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => tabStatusHandler("onlineDevice")}
                  variant={
                    tabStatus == "onlineDevice" ? "contained" : "outlined"
                  }
                  sx={{
                    padding: "0.5rem",
                    margin: "2px 0px",
                    border: "1px solid rgb(14 57 115 / 86%)",
                    color: tabStatus == "onlineDevice" ? "black" : "black",
                    backgroundColor:
                      tabStatus == "onlineDevice" ? "#f6f6b3" : "#f5f5dc",
                  }}
                >
                  Today Online Devices :
                  <span style={{ fontWeight: "bold" }}>
                    {totalCount && totalCount.totalOnlineDevice
                      ? totalCount.totalOnlineDevice
                      : 0}
                  </span>
                </Button>
              </Grid>
              {/* <Grid item>
                <CustomAutoComplete
                  disablePortal
                  id="combo-box-demo"
                  options={
                    lastOnlineDaysAgoObject ? lastOnlineDaysAgoObject : []
                  }
                  value={lastOnline || {}}
                  fullWidth
                  getOptionLabel={({ name }) => (name ? name : "")}
                  onChange={(e, newValue) => lastOnlineDevice(newValue)}
                  sx={{ width: 220 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputLabelProps={{ shrink: true }}
                      label="Last Offline since"
                    />
                  )}
                />
              </Grid> */}
              <Grid
                item
                style={{ display: "inline-flex", position: "relative" }}
              >
                <Divider
                  orientation="vertical"
                  variant="middle"
                  style={{ backgroundColor: "black", marginTop: "-1px" }}
                  spacing={1}
                />

                <Divider
                  orientation="vertical"
                  variant="middle"
                  style={{ backgroundColor: "black", marginTop: "-1px" }}
                />
              </Grid>
              <Grid item>
                <FilterDataDrawer
                  setOpen={setOpen}
                  open={open}
                  right={"right"}
                  tabStatus={"filterConfiguration"}
                  tabStatusHandler={tabStatusHandler}
                  softwareVersionList={softwareVersionList}
                  setSoftwareVersionId={setSoftwareVersionId}
                  setNewSoftwareVersionList={setNewSoftwareVersionList}
                  IdBool={IdBool}
                  setIdBool={setIdBool}
                  setPageSize={setPageSize}
                  setPageNo={setPageNo}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ width: "100%", mb: 2 }} elevation={1}>
                <TableContainer component={Paper} elevation={1}>
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow
                        sx={{ backgroundColor: "rgb(14 57 115 / 86%)" }}
                      >
                        {TableHeadData.map((ele, index) => {
                          return (
                            <>
                              {showIssueData === true &&
                              ele.name === "Client Name" ? (
                                <TableCell
                                  key={index}
                                  sx={{ minWidth: ele.width, color: "white" }}
                                >
                                  {ele.name}
                                </TableCell>
                              ) : ele.name !== "Client Name" ? (
                                <>
                                  <TableCell
                                    sx={{ minWidth: ele.width, color: "white" }}
                                  >
                                    {ele.name}
                                  </TableCell>
                                </>
                              ) : (
                                ""
                              )}
                            </>
                          );
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data &&
                        data.length > 0 &&
                        data.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              {moment(item.updatedAt).format(
                                "DD/MM/YYYY hh:mm A"
                              )}
                            </TableCell>
                            <TableCell>{`${
                              item.createdBy ? item.createdBy.name : "NA"
                            }`}</TableCell>
                            <TableCell>
                              {item.imeiNo ? item.imeiNo : "NA"}
                            </TableCell>
                            <TableCell>
                              {item.iccidNo ? item.iccidNo : "NA"}
                            </TableCell>
                            <TableCell>
                              {item.uuidNo ? item.uuidNo : "NA"}
                            </TableCell>
                            <TableCell>
                              {item.sim1Number ? item.sim1Number : "NA"}
                            </TableCell>{" "}
                            {/* <TableCell>
                              {item.sim1ActivationDate ?  moment
                                .utc(item.sim1ActivationDate)
                                .format("DD/MM/YYYY hh:mm A") : "NA"}
                            </TableCell>{" "}
                            <TableCell>
                              {item.sim1ExpiryDate ?  moment
                                .utc(item.sim1ExpiryDate)
                                .format("DD/MM/YYYY hh:mm A") : "NA"}
                            </TableCell>{" "} */}
                            <TableCell>
                              {item.sim1Operator ? item.sim1Operator : "NA"}
                            </TableCell>{" "}
                            <TableCell>
                              {item.sim1Provider ? item.sim1Provider : "NA"}
                            </TableCell>{" "}
                            <TableCell>
                              {item.sim2Number ? item.sim2Number : "NA"}
                            </TableCell>{" "}
                            {/* <TableCell>
                              {item.sim2ActivationDate ? moment
                                .utc(item.sim2ActivationDate)
                                .format("DD/MM/YYYY hh:mm A") : "NA"}
                            </TableCell>{" "}
                            <TableCell>
                              {item.sim2ExpiryDate ? moment
                                .utc(item.sim2ExpiryDate)
                                .format("DD/MM/YYYY hh:mm A") : "NA"}
                            </TableCell>{" "} */}
                            <TableCell>
                              {item.sim2Operator ? item.sim2Operator : "NA"}
                            </TableCell>
                            {/*  <TableCell>
                              {item.sim2Provider ? item.sim2Provider : "NA"}
                            </TableCell> */}
                            {/* <TableCell>
                            {item.sim2ExpiryDate ? moment
                                .utc(item.sim2ExpiryDate)
                                .format("DD/MM/YYYY hh:mm A") : "NA"}
                            </TableCell> */}
                            <TableCell>
                              {item.sim1ActivationDate
                                ? moment
                                    .utc(item.sim1ActivationDate)
                                    .format("DD/MM/YYYY ")
                                : "NA"}
                            </TableCell>{" "}
                            <TableCell>
                              {item.sim1ExpiryDate
                                ? moment
                                    .utc(item.sim1ExpiryDate)
                                    .format("DD/MM/YYYY ")
                                : "NA"}
                            </TableCell>{" "}
                            <TableCell>
                              {item.softwareVersion
                                ? item.softwareVersion
                                : "NA"}
                            </TableCell>
                            <TableCell>
                              {item.boxNo ? item.boxNo : "NA"}
                            </TableCell>
                            <TableCell>
                              {item.packedDate
                                ? moment
                                    .utc(item?.packedDate)
                                    .format("DD/MM/YYYY hh:mm A")
                                : "NA"}
                            </TableCell>
                            {showIssueData === true && (
                              <TableCell>
                                {item.clientName && item.clientName !== null
                                  ? item.clientName
                                  : "NA"}
                              </TableCell>
                            )}
                            <TableCell sx={{ width: 100 }}>
                              {/* <CustomAutoComplete
                                disablePortal
                                id="combo-box-demo"
                                options={stateList ? stateList : []}
                                value={state || ""}
                                getOptionLabel={({ name }) => {
                                  return name || "";
                                }}
                                onChange={(e, newValue) =>
                                  stateHandler(newValue)
                                }
                                sx={{ width: 130, height: 38 }}
                                renderInput={(params) => (
                                  <TextField {...params} />
                                )}
                              /> */}
                              {/* {localUserDetails.map((userDetails, index) => {
                                if (userDetails.name === "GET_ALL_STATE") {
                                  console.log(userDetails,"usueueueu-1");
                                  return (
                                    <React.Fragment key={index}>
                                      <CustomAutoComplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={
                                          setUserStateList ? userStateList : []
                                        }
                                        value={item?.state || ""}
                                        getOptionLabel={({ name }) =>
                                          name || ""
                                        }
                                        onChange={(e, newValue) =>
                                          stateHandlerUser(
                                            e,
                                            newValue,
                                            item,
                                            index
                                          )
                                        }
                                        sx={{ width: 180, height: 38 }}
                                        renderInput={(params) => (
                                          <TextField {...params} />
                                        )}
                                      />
                                    </React.Fragment>
                                  );
                                        
                                } else {
                                  console.log(userDetails,"usueueueu-2");
                                  return null;
                                }
                              })} */}
                              {/* {hasPermission ? (
                                <CustomAutoComplete
                                  disablePortal
                                  id="combo-box-demo"
                                  options={
                                    setUserStateList ? userStateList : []
                                  }
                                  value={item?.state || ""}
                                  getOptionLabel={({ name }) => name || ""}
                                  onChange={(e, newValue) =>
                                    stateHandlerUser(e, newValue, item, index)
                                  }
                                  sx={{ width: 180, height: 38 }}
                                  renderInput={(params) => (
                                    <TextField {...params} />
                                  )}
                                />
                              ) : ( */}
                              {/* {item?.state ? item.state.name : "NA"} */}
                              {item.state && item.state.name !== null
                                ? item.state.name
                                : "NA"}
                              {/* )} */}
                            </TableCell>
                            <TableCell>
                              <PopupState>
                                {(popupState) => (
                                  <div>
                                    <IconButton
                                      sx={{ padding: 0 }}
                                      {...bindToggle(popupState)}
                                    >
                                      <InfoIcon />
                                    </IconButton>
                                    <Popper
                                      {...bindPopper(popupState)}
                                      transition
                                    >
                                      {({ TransitionProps }) => (
                                        <Fade
                                          {...TransitionProps}
                                          timeout={250}
                                        >
                                          <Paper
                                            sx={{
                                              maxWidth: "20rem",
                                              overflowWrap: "break-word",
                                              padding: "0.5rem",
                                            }}
                                            elevation={10}
                                          >
                                            <Typography
                                              variant="body2"
                                              gutterBottom
                                            >
                                              {item &&
                                                item.detail &&
                                                item.detail
                                                  .split(",")
                                                  .join("\n")}
                                            </Typography>

                                            <ManageAccountsIcon
                                              fontSize="large"
                                              alignItems="center"
                                              sx={{
                                                cursor: "pointer",
                                                color: "#1976d2",
                                                width: "100%",
                                              }}
                                              title="Details"
                                              onClick={() =>
                                                handleSingleUserInformation(
                                                  item
                                                )
                                              }
                                            />
                                          </Paper>
                                        </Fade>
                                      )}
                                    </Popper>
                                  </div>
                                )}
                              </PopupState>
                            </TableCell>
                            {/* <TableCell>{item.detail.split(",").join("\n")}</TableCell> */}
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  sx={{}}
                  component="div"
                  rowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
                  count={
                    totalCount.totalElements ? totalCount.totalElements : 0
                  }
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

var tableHeadForExport = [
  "Sno.",
  "Updated At",
  "Created By",
  "IMEI Number",
  "ICCID Number",
  "UUID Number",
  "Software Version",
  "Status",
  "Last Polling Date",
  "State",
  "Client Name",
  "Details",
];

var tableHeadForExportForExcel = [
  "Sno.",
  "Updated At",
  "Created By",
  "IMEI Number",
  "ICCID Number",
  "UUID Number",
  "Software Version",
  "Status",
  "State",
  "Client Name",
  "sim Provider",
  "sim Activation Date",
  "expiry Date",
  "Sim1 Operator",
  "Sim2 Operator",
  "Sim1 Number",
  "Sim2 Number",
  "Issue Date",
  "Packet Date",

  "Packet",
  "Details",
];

export default Dashboard;

//split a string at comma and continue to next line?

// let abc =
//   ":IMEI:866567067547647,UID:221067547647,CCID: \r\n8991102205619463809F,DFV:NKC170123_V1.31PV1.0,APN:TAISYSNET,G_Fix:D,MTCP:86,STCP:0,TTCP:0";

// console.log(abc.split(",").join("\n"), "hii");

//how to generate pdf?
