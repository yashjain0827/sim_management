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
import { DeviceAction } from "../actions/device";
import { BoxPackaging } from "../actions/boxPackaging";

import ExportReport from "../CommonComponents/Export";
import ExportPdf from "../CommonComponents/exportPdf";
// import DeviceStatusUpdate from "./CreateBox";
import { useNavigate } from "react-router-dom";
import TopView from "../CommonComponents/topView";
import { styled } from "@mui/material/styles";
import { companyAction } from "../company/companyFetchData";
import ImportExcel from "./importExcel";
import LoadingComponent from "../CommonComponents/LoadingComponts";
import debouce from "lodash.debounce";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { userService } from "../services";
import config from "../../config/config";
// import FilterDataDrawer from "./FIlterDataDrawer";
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

const IccidList = () => {
  const localStorageData = JSON.parse(localStorage.getItem("data"));
  const importIccidPermission = localStorageData.webPermissionDTOList.filter(
    (ele) => {
      return ele.name == "IMPORT_ICCID" && ele.forWeb;
    }
  );
  // const classes = useStyles();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(
    moment(moment().startOf("day")).format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(
    moment(moment().endOf("day")).format("YYYY-MM-DD")
  );
  const [data, setData] = useState([]);
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

  const [showIssueData, setShowIssueData] = useState(false);

  const [searchValue, setSearchValue] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [providerList, setProviderList] = useState([]);
  const [operatorList, setOperatorList] = useState([]);

  const fetchAllProviders = async () => {
    const response = await DeviceAction.getProviders();

    if (response) {
      console.log(response);
      setProviderList(response);
    } else {
      setProviderList([]);
    }
  };
  const fetchAllOperator = async () => {
    const response = await DeviceAction.getOperators();

    if (response) {
      console.log(response);

      setOperatorList(response);
    } else {
      setOperatorList([]);
    }
  };
  useEffect(() => {
    fetchAllOperator();
    fetchAllProviders();
  }, []);

  const exportDataList = (exportArray, exportType) => {
    console.log(exportArray, "exportarray");
    let exportDataArray = [];
    exportArray.forEach((item, index) => {
      let objExport = {
        col1: index + 1,
        col2: item.iccidNo ? item.iccidNo : "NA",
        col3: item.provider ? item.provider : "NA",

        col4: item.sim1Operator ? item.sim1Operator : "NA",
        col5: item.sim2Operator ? item.sim2Operator : "NA",

        col6: item.simActivationDate
          ? moment(item.simActivationDate).format("DD-MM-YYYY")
          : "",
        col7: item.simExpiryDate
          ? moment(item.simExpiryDate).format("DD-MM-YYYY")
          : "",

        col8: item && item.sim1 ? item.sim1 : "NA",
        col9: item && item.sim2 ? item.sim2 : "NA",
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
      name: "ICCID",
      width: "150px",
    },
    {
      name: "Provider",
      width: "150px",
    },
    {
      name: "Sim1 Operator",
      width: "100px",
    },
    {
      name: "Sim2 Operator",
      width: "100px",
    },
    {
      name: "Sim Activation Date",
      width: "100px",
    },

    {
      name: "Sim Expiry",
      width: "100px",
    },
    {
      name: "Sim1 No.",
      width: "100px",
    },

    {
      name: "Sim2 No.",
      width: "100px",
    },
  ];

  const showData = async (type, exportType, term) => {
    console.log(term);
    debugger;
    setLoading(true);
    let payload = {
      search: term,
      pageNo: type ? pageNo : 0,
      pageSize: type ? pageSize : 0,
    };

    const res = await DeviceAction.getIccidList(payload);

    if (res) {
      console.log(res);
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
        exportDataList(res.data);
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

  const ExcelImportModal = () => {
    setOpenModal(true);
  };
  const closeExcelImportModal = () => {
    setOpenModal(false);
  };

  const searchHandler = (getData, delay) => {
    debugger;

    let timer;
    /*   below function is debouncedFunction1 we can accept all the argument passed to the debouncedFunction1
   in the arguments object */
    return (...args) => {
      debugger;
      console.log(args[0].target.value);
      let term = args[0].target.value;
      // setSearch([...args]);
      console.log(term);
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        // console.log(this);
        getData(true, "", term);
      }, delay);
    };
  };

  useEffect(() => {
    showData(true);
  }, [searchValue]);

  const debouncedResults = searchHandler(showData, 1000);

  //   useEffect(() => {
  //     return () => {
  //       debouncedResults.cancel();
  //     };
  //   });

  //   console.log(filteredValue, "bdjdf");
  let topViewData = {
    pageTitle: "ICCID LIST",
    /* ================= */
    addText: "",
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
    hideExcelImport:
      importIccidPermission && importIccidPermission.length > 0 ? false : true,
    excelImportClick: ExcelImportModal,
    /* ==================== */
    filter: true,
    filterHandler: null,
    /* ====================== */

    searchFieldHandler: debouncedResults,
    searchInput: search,
    searchField: false,

    filteredValue: null,
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
    showData(true);
  }, []);

  return (
    <div className="main_container">
      <Box className="main">
        <ThemeProvider theme={theme}>
          <TopView topViewData={topViewData}></TopView>
          <ImportExcel
            openModal={openModal}
            setOpenModal={setOpenModal}
            showData={showData}
            closeExcelImportModal={closeExcelImportModal}
            setSearchValue={setSearchValue}
            providerList={providerList}
            operatorList={operatorList}
            loading={loading}
            setLoading={setLoading}
          >
            <LoadingComponent isLoading={loading} />
          </ImportExcel>

          <Grid item xs={12} container>
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
                  labelHeader={tableHeadForExport || []}
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
                              {item.iccidNo ? item.iccidNo : "NA"}
                            </TableCell>
                            <TableCell>
                              {item.provider ? item.provider : "NA"}
                            </TableCell>
                            <TableCell>
                              {item.sim1Operator ? item.sim1Operator : "NA"}
                            </TableCell>{" "}
                            <TableCell>
                              {item.sim2Operator ? item.sim2Operator : "NA"}
                            </TableCell>
                            <TableCell>
                              {item.simActivationDate
                                ? moment(item.simActivationDate).format(
                                    "DD/MM/YYYY"
                                  )
                                : "NA"}
                            </TableCell>{" "}
                            <TableCell>
                              {item.simExpiryDate
                                ? moment(item.simExpiryDate).format(
                                    "DD/MM/YYYY"
                                  )
                                : "NA"}
                            </TableCell>{" "}
                            <TableCell>
                              {item.sim1 ? item.sim1 : "NA"}
                            </TableCell>{" "}
                            <TableCell>
                              {item.sim2 ? item.sim2 : "NA"}
                            </TableCell>{" "}
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
  "ICCID Number",
  "Provider",
  "Sim1 Operator",
  "Sim2 Operator",
  "Sim Activation Date",
  "Sim Expiry",
  "Sim1 Number",
  "SIm2 Number",
];

export default IccidList;
