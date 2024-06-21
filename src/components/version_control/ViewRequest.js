import React, { useEffect, useState } from "react";
import LoadingComponent from "../CommonComponents/LoadingComponts";
import TopView from "../CommonComponents/topView";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  Grid,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";
import { VersionAction } from "../actions/version";
import { styled } from "@mui/material/styles";
import { useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Delete } from "@mui/icons-material";
import moment from "moment";

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

const configTimeArray = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60];

const ViewRequest = () => {
  const createdBy = JSON.parse(localStorage.getItem("data")).name;
  const { id } = useParams();
  const [requestData, setRequestData] = useState();
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableDataOld, setTableDataOld] = useState([]);

  const [totalCount, setTotalCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [fromVersionList, setFromVersionList] = useState([]);
  const [toVersionList, setToVersionList] = useState([]);
  const [statusList, setStatusList] = useState([
    { label: "DONE", value: true },
    { label: "NOT DONE", value: false },
  ]);
  const [activeList, setActiveList] = useState(["Offline", "Online"]);

  const [offlineTimeConfig, setOfflineTimeConfig] = useState(configTimeArray);
  const [fromVersion, setFromVersion] = useState();
  const [toVersion, setToVersion] = useState();
  const [commandStatus, setCommandStatus] = useState();
  const [afterCommmandStatus, setAfterCommandStatus] = useState();
  const [selectedConfigTime, setSelectedConfigTime] = useState(15);

  const handleChangePage = (event, newPage) => {
    //console.log(newPage);
    setPageNo(newPage);
    // setIdBool(true);
  };

  const handleChangeRowsPerPage = (event) => {
    //console.log(event.target.value)
    setPageSize(parseInt(event.target.value));
    setPageNo(0);
    // setIdBool(true);
  };
  function fetchRequestById() {
    let data = {
      id: parseInt(id),
      fromVersion: fromVersion?.fromSoftwareVersion ?? "",
      currentVersion: toVersion?.currentSoftwareVersion ?? "",
      isDone: commandStatus?.value ?? null,
    };
    VersionAction.getRequestById(data)
      .then((res) => {
        debugger;
        console.log(res);
        setRequestData(res.data);
        const arr = res.data.deviceCommandList.map((ele) => {
          const result = checkOnlineStatus(selectedConfigTime, ele);
          console.log(result);
          return Object.assign(result, ele);
        });
        // console.log(result);

        console.log(arr);
        const map = new Map();
        const map2 = new Map();

        arr.forEach((element) => {
          map.set(element.fromSoftwareVersion, element);
        });
        arr.forEach((element) => {
          map2.set(element.currentSoftwareVersion, element);
        });
        console.log(map);
        let fromarray = [];
        let toVersion = [];
        for (const iterator of map.values()) {
          console.log(iterator);
          fromarray.push(iterator);
        }
        for (const iterator of map2.values()) {
          console.log(iterator);
          toVersion.push(iterator);
        }
        console.log(fromarray);
        setFromVersionList(fromarray);

        setTableData(arr);
        setTableDataOld(arr);
        const fromVersionList = res.data.deviceCommandList.map((ele) => {
          return ele.fromSoftwareVersion && ele.fromSoftwareVersion;
        });
        const ToVersionList = res.data.deviceCommandList.map((ele) => {
          return ele.currentSoftwareVersion && ele.currentSoftwareVersion;
        });
        console.log(fromVersionList, ToVersionList);
        // setFromVersionList(fromVersionList);
        setToVersionList(toVersion);
        // setTotalCount(res);
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    fetchRequestById();
  }, [fromVersion, toVersion, commandStatus]);

  const TableHeadData = [
    { name: "S No.", width: "50px", isVisible: true },

    { name: "Imie No.", width: "50px", isVisible: true },
    {
      name: "Created By",
      width: "100px",
      isVisible: true,
    },
    {
      name: "Created At",
      width: "100px",
      isVisible: true,
    },
    {
      name: "Previous SoftwareVersion",
      width: "100px",
      isVisible: true,
    },
    {
      name: "Current SoftwareVersion",
      width: "100px",
      isVisible: true,
    },
    {
      name: "Requested SoftwareVersion",
      width: "100px",
      isVisible: true,
    },
    {
      name: "Last Updated",
      width: "100px",
      isVisible: true,
    },
    // {
    //   name: "Status",
    //   width: "100px",
    //   isVisible: true,
    // },
    {
      name: "Request Status",
      width: "100px",
      isVisible: true,
    },
  ];

  let topViewData = {
    pageTitle: `Request_Info(${requestData?.reqCode ?? ""})`,
    /* ================= */
    addText: `Update_version`,
    // hideAddButton: !webPermission.includes("ADD_COMPANY"),
    hideAddButton: true,
    // createBoxPermission && createBoxPermission.length > 0 ? false : true,
    addClick: "/version_update",
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
    hidePdfExport: true,
    exportPdfClick: "/companyCreate",
    onPdfDownload: null,
    /* ================= */
    hideExcelExport: true,
    exportExcelClick: "",
    onExcelDownload: null,
    /* ==================== */
    hideExcelImport: true,
    excelImportClick: "",
    /* ==================== */
    filter: true,
    filterHandler: null,
    /* ====================== */

    searchFieldHandler: null,
    searchInput: null,
    searchField: true,
  };

  function checkOnlineStatus(time, data) {
    debugger;
    console.log(data);
    let commandSendTime, lastPollingDate, currentTime;
    if (data.commandSendDate && data.lastPollingDate) {
      commandSendTime = new Date(data.commandSendDate).getTime();
      lastPollingDate = new Date(data.lastPollingDate).getTime();
      currentTime = new Date().getTime();
      debugger;
      if (
        commandSendTime > lastPollingDate &&
        currentTime - commandSendTime > time * 60 * 1000
      ) {
        return { color: "#80808085", status: "Offline" };
      } else {
        return { color: "rgb(16 255 0 / 28%)", status: "Online" };
      }
    } else if (!data.isDone) {
      return { color: "#ff05006e", status: null };
    } else {
      return { color: "rgb(16 255 0 / 28%)", status: "Online" };
    }
    console.log(commandSendTime, lastPollingDate);
  }
  function getOnlineOfflineAccordingToTimeConfig(data) {
    console.log(tableDataOld);
    if (data) {
      setAfterCommandStatus(data);
      if (data == "Offline") {
        const arr = tableDataOld.filter((ele) => {
          return ele.color == "#80808085";
        });
        setTableData(arr);
      } else {
        const arr = tableDataOld.filter((ele) => {
          return ele.color !== "#80808085";
        });
        setTableData(arr);
      }
    } else {
      setAfterCommandStatus();
      // setTableData(tableDataOld);
    }
  }
  function getListAccordingToNewTimeConfig(data) {
    debugger;
    console.log(tableDataOld);
    if (data) {
      // setOfflineTimeConfig(data);
      setSelectedConfigTime(data);
      const arr = tableDataOld.map((ele) => {
        const result = checkOnlineStatus(data, ele);
        return Object.assign(result, ele);
      });
      console.log(arr);

      setTableData(arr);
    } else {
      // setOfflineTimeConfig(15);
      // setOfflineTimeConfig(configTimeArray);
      setTableData(tableDataOld);
    }
  }
  return (
    <div className="main_container">
      <Box className="main">
        <LoadingComponent isLoading={loading} />

        <ThemeProvider theme={theme}>
          <TopView topViewData={topViewData} />

          <Grid
            container
            spacing={1}
            justifyContent={"space-between"}
            alignItems={"center"}
            sx={{ marginTop: "2px" }}
          >
            <Grid item xs={12} sm={4} md={4} lg={2}>
              <CustomAutoComplete
                disablePortal
                id="combo-box-demo"
                options={fromVersionList || []}
                value={fromVersion}
                fullWidth
                getOptionLabel={(softwareVersion) =>
                  softwareVersion.fromSoftwareVersion
                    ? softwareVersion.fromSoftwareVersion
                    : ""
                }
                onChange={(e, newValue) => setFromVersion(newValue)}
                sx={{ width: 220 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    label="Select From Version"
                    // sx={{ top: "-50px", left: "19.5rem", zIndex: "100" }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={2}>
              <CustomAutoComplete
                disablePortal
                id="combo-box-demo"
                options={toVersionList || []}
                value={toVersion}
                fullWidth
                getOptionLabel={(softwareVersion) =>
                  softwareVersion.currentSoftwareVersion
                    ? softwareVersion.currentSoftwareVersion
                    : ""
                }
                onChange={(e, newValue) => setToVersion(newValue)}
                sx={{ width: 220 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    label="Select To Version"
                    // sx={{ top: "-50px", left: "19.5rem", zIndex: "100" }}
                  />
                )}
              />
            </Grid>{" "}
            <Grid item xs={12} sm={4} md={4} lg={2}>
              <CustomAutoComplete
                disablePortal
                id="combo-box-demo"
                options={statusList || []}
                value={commandStatus}
                fullWidth
                getOptionLabel={(softwareVersion) =>
                  softwareVersion.label ? softwareVersion.label : ""
                }
                onChange={(e, newValue) => setCommandStatus(newValue)}
                sx={{ width: 220 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    label="Select Command Status"
                    // sx={{ top: "-50px", left: "19.5rem", zIndex: "100" }}
                  />
                )}
              />
            </Grid>{" "}
            <Grid item xs={12} sm={4} md={4} lg={2}>
              <CustomAutoComplete
                disablePortal
                id="combo-box-demo"
                options={offlineTimeConfig || []}
                value={selectedConfigTime || 15}
                fullWidth
                getOptionLabel={(softwareVersion) =>
                  softwareVersion ? softwareVersion : ""
                }
                // onChange={(e, newValue) => setOfflineTimeConfig(newValue)}
                onChange={(e, newValue) =>
                  getListAccordingToNewTimeConfig(newValue)
                }
                disableClearable={true}
                sx={{ width: 220 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    label="Select Device Config Time (mins)"
                    // sx={{ top: "-50px", left: "19.5rem", zIndex: "100" }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={2}>
              <CustomAutoComplete
                disablePortal
                id="combo-box-demo"
                options={activeList || []}
                value={afterCommmandStatus}
                fullWidth
                getOptionLabel={(softwareVersion) =>
                  softwareVersion ? softwareVersion : ""
                }
                // onChange={(e, newValue) => setAfterCommandStatus(newValue)}
                onChange={(e, newValue) =>
                  getOnlineOfflineAccordingToTimeConfig(newValue)
                }
                sx={{ width: 220 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    label="Select Device Status After Command"
                    // sx={{ top: "-50px", left: "19.5rem", zIndex: "100" }}
                  />
                )}
              />
            </Grid>{" "}
          </Grid>
          <Grid container sx={{ marginTop: ".6rem" }} rowGap={1}>
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
                              {ele.isVisible && (
                                <TableCell
                                  sx={{ minWidth: ele.width, color: "white" }}
                                >
                                  {ele.name}
                                </TableCell>
                              )}
                            </>
                          );
                        })}
                        {/* {maintenanceType == "replace" && (
                  <TableCell
                    sx={{ minWidth: ele.width, color: "white" }}
                  >
                    Replaced By
                  </TableCell>
                )} */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData &&
                        tableData.length > 0 &&
                        tableData.map((ele, index) => {
                          console.log(tableData);
                          return (
                            <TableRow
                              key={index}
                              style={{
                                background: ele.color,
                              }}
                            >
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                <span
                                  style={{
                                    color: "#006fff",
                                    cursor: "pointer",
                                  }}
                                >
                                  {ele?.imeiNo ?? "NA"}
                                </span>
                              </TableCell>
                              <TableCell>{createdBy}</TableCell>{" "}
                              <TableCell>
                                {moment(ele.createdAt).format(
                                  "DD-MM-YYYY HH:mm"
                                )}
                              </TableCell>{" "}
                              <TableCell>
                                {ele?.fromSoftwareVersion ?? "NA"}
                              </TableCell>{" "}
                              <TableCell>
                                {ele?.currentSoftwareVersion ?? "NA"}
                              </TableCell>{" "}
                              <TableCell>
                                {ele?.requestedSoftwareVersion ?? "NA"}
                              </TableCell>{" "}
                              <TableCell>
                                {ele?.lastUpdatedAt
                                  ? moment(ele?.lastUpdatedAt).format(
                                      "DD-MM-YYYY HH:mm"
                                    )
                                  : "NA"}
                              </TableCell>{" "}
                              {/* <TableCell>{ele?.isDone ?? "Not Done"}</TableCell>{" "} */}
                              <TableCell>
                                {ele?.isDone
                                  ? "Done"
                                  : ele?.isReverted
                                  ? "Command Reverted"
                                  : !ele.isReverted && !ele.isActive
                                  ? "Pending"
                                  : "Command Processed"}
                              </TableCell>{" "}
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </ThemeProvider>
      </Box>
    </div>
  );
};

export default ViewRequest;
