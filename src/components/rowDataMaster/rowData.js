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
} from "@mui/material";
import axios from "axios";
import LoadingComponent from "../CommonComponents/LoadingComponts";
import AutocompleteVirtualize from "./virtualizedScroll";
// CustomDropdown component with custom scroll behavior

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

function DeviceRowData() {
  const rawDataMap = JSON.parse(
    localStorage.getItem("data")
  ).rawDataPermissionMap;
  const navigate = useNavigate();
  const [rawDataIdMap, setRawDataIdMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [fromDate, setFromDate] = useState(
    moment(new Date()).subtract(10, "minutes").format("YYYY-MM-DD HH:mm")
  );
  const [toDate, setToDate] = useState(
    moment(new Date()).format("YYYY-MM-DD HH:mm")
  );
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState();
  const [deviceListForDropDown, setDeviceListForDropDown] = useState([]);
  const [exportDataPdf, setExportDataPdf] = useState([]);
  const [exportDataExcel, setExportDataExcel] = useState([]);
  const [deviceRowData, setDeviceRowData] = useState([]);
  const [deviceUrl, setDeviceUrl] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [tableHead, setTableHead] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [deviceOptionList, setDeviceOptionList] = useState([]);
  const [serverUrlList, setServerUrlList] = useState([]);
  const [selectedServer, setSelectedServer] = useState();
  const [rowDataApiUrl, setRowDataApiUrl] = useState("");
  const [exportHeader, setExportHeader] = useState([]);

  async function fetchCoreUrl() {
    setIsLoading(true);
    try {
      const res = await DeviceAction.getCoreUrl();
      debugger;
      let responseData = res?.data;
      // const serverUrlArray = responseData.map((ele) => {
      //   return ele.server;
      // });
      // setServerUrlList(serverUrlArray);
      if (rawDataMap != null) {
        let rawDataIdMap = {};
        rawDataMap &&
          rawDataMap.length > 0 &&
          rawDataMap.forEach((ele) => {
            if (!(ele in rawDataIdMap)) {
              rawDataIdMap[ele.rawServerId] = ele.imei.split(",");
            }
          });
        console.log(rawDataIdMap);

        const array = responseData.filter((ele) => {
          return ele.id in rawDataIdMap;
        });
        console.log(array);
        setDataUrl(array);
        setRawDataIdMap(rawDataIdMap);
      } else {
        console.log(responseData);

        setDataUrl(responseData);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);

      console.log(err);
    }
  }

  async function selectedServerHandler(data) {
    debugger;
    if (data) {
      debugger;
      console.log(data);

      setDeviceRowData([]);
      setSelectedServer(data);
      setSelectedDevice();
      setDeviceOptionList([]);

      setFromDate(
        moment(new Date()).subtract(10, "minutes").format("YYYY-MM-DD HH:mm")
      );
      setToDate(moment(new Date()).format("YYYY-MM-DD HH:mm"));
      const responseData = JSON.parse(data?.data);
      setRowDataApiUrl(responseData?.dataUrl);
      console.log(responseData);
      setDeviceUrl(responseData?.deviceUrl);
      // const array2 = await fetchDevices(responseData.deviceUrl);
      // console.log(array2.data);

      // setDeviceOptionList(array2?.data);

      const { data: data1 } = await fetchDevices(responseData.deviceUrl);
      console.log(data1);
      if (Object.keys(rawDataIdMap)?.length > 0) {
        console.log(rawDataIdMap);
        const array = rawDataIdMap[data.id];
        setDeviceList(array);
        setDeviceOptionList(array);
      } else {
        setDeviceList(data1);
        setDeviceOptionList(data1);
      }

      setTableHead(responseData.table);
      const tableHeadForExport = responseData.table.map((ele) => {
        return ele.key;
      });
      setExportHeader(tableHeadForExport);
    } else {
      setDeviceRowData([]);
      setSelectedServer();

      setSelectedDevice();
      setFromDate(
        moment(new Date()).subtract(10, "minutes").format("YYYY-MM-DD HH:mm")
      );
      setToDate(moment(new Date()).format("YYYY-MM-DD HH:mm"));
    }
  }

  async function fetchDevices(baseUrl) {
    try {
      return await DeviceAction.getDevices(baseUrl);
    } catch (err) {
      console.log(err);
    }
  }

  const handleChangePage = (event, newPage) => {
    setPageNo(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value));
    setPageNo(0);
  };

  const exportDataList = (exportArray) => {
    debugger;
    console.log(exportArray, "exportarray");
    let exportDataArray = [];
    deviceRowData &&
      deviceRowData.length > 0 &&
      deviceRowData.forEach((item, index) => {
        let objExport = {};
        tableHead.map((ele, i) => {
          return (objExport[`col${i + 1}`] = ele.isDate
            ? moment(item[ele.value]).format("DD-MM-YYYY HH:mm")
            : ele.value == "id"
            ? index + 1
            : item[ele.value]);
        });
        // let objExport = {
        //   col1: index + 1,
        //   col2: item.companyId ? item.companyId : "NA",
        //   col3: item.companyName,
        //   col4: item.companyCode,

        //   col5: item.companyAddress ? item.companyAddress : "NA",
        //   col6: item.state && item.state.name ? item.state.name : "NA",
        //   col7: item.city ? item.city : "NA",
        //   col8: item.phoneNumber ? item.phoneNumber : "NA",
        //   col9: item.panNumber ? item.panNumber : "NA",
        //   col10: item.gstNumber ? item.gstNumber : "NA",

        //   col11: item.lastIssueDate
        //     ? moment.utc(item.lastIssueDate).format("DD/MM/YYYY hh:mm a")
        //     : "NA",
        //   col12: item.lastIssueQuantity ? item.lastIssueQuantity : "NA",
        //   col13: item.isActive ? "Active" : "Inactive",
        // };
        exportDataArray.push(objExport);
      });
    console.log(exportDataArray);

    setExportDataPdf(exportDataArray);

    let objExport = {};

    tableHead.forEach((element, index) => {
      objExport[`col${index + 1}`] = element.key;
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

  function getRowData(type, exportType) {}

  const onPdfDownload = (type) => {
    exportDataList(deviceRowData);
    setTimeout(() => {
      document.getElementById("exportPdfButton").click();
    }, 500);
  };

  const onExcelDownload = (type) => {
    exportDataList(deviceRowData);

    setTimeout(() => {
      document.getElementById("exportDataList").click();
    }, 500);
  };

  let topViewData = {
    pageTitle: "Device Raw Data",

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

  useEffect(() => {
    fetchCoreUrl();

    return () => {};
  }, []);

  async function showRowDataHandler() {
    setIsLoading(true);
    let data = {
      imeiNo: selectedDevice,
      fromDate: moment(fromDate).utc(),
      toDate: moment(toDate).utc(),
    };
    console.log(data);
    try {
      const response = await axios.post(rowDataApiUrl, data);
      console.log(response?.data?.data);
      setDeviceRowData(response?.data?.data);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  }
  function handleChange(event, rowData) {
    setSelectedDevice(rowData);
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
                  labelHeader={exportHeader || []}
                  title={
                    `${selectedServer?.server} (${moment(fromDate).format(
                      "DD-MM-YYYY HH:mm"
                    )} - ${moment(toDate).format("DD-MM-YYYY HH:mm")} )` ??
                    "server Report"
                  }
                  reportName={selectedServer?.server ?? "server Report"}
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={2} xl={1.5}>
              <div style={{ display: "none" }}>
                <ExportReport
                  exportData={exportDataExcel || []}
                  labelHeader={exportHeader || []}
                  exportHeading={[
                    `${selectedServer?.server} (${moment(fromDate).format(
                      "DD-MM-YYYY HH:mm"
                    )} - ${moment(toDate).format("DD-MM-YYYY HH:mm")} )` ??
                      "server Report",
                  ]}
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
              ></Grid>
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
                      Core Url
                    </Typography>
                    <CustomAutoComplete
                      disablePortal
                      required
                      id="combo-box-demo"
                      options={dataUrl || []}
                      getOptionLabel={({ server }) => {
                        return server || "";
                      }}
                      value={selectedServer || {}}
                      onChange={(e, newValue) =>
                        selectedServerHandler(newValue)
                      }
                      sx={{ width: 240 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          // onChange={(e) => {
                          //   debouncedFunctionForClient(e.target.value);
                          // }}
                        />
                      )}
                    />
                  </Grid>{" "}
                  <Grid item xs={2}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Select device
                    </Typography>
                    {/* <div
                      // onScroll={handleScroll}
                      style={{
                        overflowY: "auto",
                        maxHeight: "400px",
                        background: "blue",
                      }}
                    > */}
                    <AutocompleteVirtualize
                      options={deviceOptionList || []}
                      size="small"
                      setSelectedDevice={setSelectedDevice}
                      handleChange={(event, rowData) =>
                        handleChange(event, rowData)
                      }
                      placeholder={"Select device"}
                      // disabled={isUpdate}
                      value={selectedDevice || []}
                    />
                    {/* </div> */}
                  </Grid>
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
                      onClick={showRowDataHandler}
                    >
                      Submit
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
                        {tableHead.map((ele, index) => (
                          <TableCell
                            key={ele.id}
                            sx={{
                              minWidth: ele.width,
                              color: "white",
                              textAlign: "center",
                            }}
                          >
                            {ele.key}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {deviceRowData.length > 0 &&
                        deviceRowData.map((row, index) => {
                          return (
                            <Row
                              row={row}
                              tableHead={tableHead}
                              index={index}
                            />
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* <TablePagination
                  sx={{}}
                  component="div"
                  rowsPerPageOptions={[10, 20, 50, 100]}
                  count={totalCount ? totalCount : 0}
                  rowsPerPage={pageSize}
                  page={pageNo}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                /> */}
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
function Row({ row, tableHead, index }) {
  console.log(row, tableHead);
  return (
    <TableRow key={row.id}>
      {" "}
      {tableHead.map((ele) => {
        return (
          <TableCell
            sx={{
              textAlign: "center",
              maxWidth: 270,
              wordWrap: "break-word",
            }}
          >
            {ele.value == "id"
              ? index + 1
              : ele.isDate
              ? moment(row[ele.value]).format("DD-MM-YYYY HH:mm")
              : row[ele.value]}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

export default DeviceRowData;
