import React, { useEffect, useState, useRef } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TopView from "../CommonComponents/topView";
import moment from "moment";
import ExportPdf from "../CommonComponents/exportPdf";
import ExportReport from "../CommonComponents/Export";
import { SubscriptionAction } from "../actions/subscription";
import LoadingComponent from "../CommonComponents/LoadingComponts";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Checkbox from "@mui/material/Checkbox";
import { companyAction } from "../company/companyFetchData";
import ConfirmationDialog from "./confirmationBox";
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
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { DeviceAction } from "../actions/device";
import { BoxPackaging } from "../actions/boxPackaging";
import { forEach } from "lodash";

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
const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};
const blue = {
  100: "#DAECFF",
  200: "#b6daff",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const Textarea = styled(BaseTextareaAutosize)(
  ({ theme }) => `
    box-sizing: border-box;
    width: 465px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 12px 12px 0 12px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${
      theme.palette.mode === "dark" ? grey[900] : grey[50]
    };
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    &:focus {
      outline: 0;
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[600] : blue[200]
      };
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);
const BulkReconfigure = () => {
  const navigate = useNavigate();
  const timerForClient = useRef(null);
  const [open, setOpen] = useState(false);
  const [client, setClient] = useState();
  const [clientList, setClientList] = useState([]);
  const [state, setState] = useState();
  const [stateList, setStateList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [command, setCommand] = useState("");
  const [imeiNumbers, setImeiNumbers] = useState("");
  const [exportDataPdf, setExportDataPdf] = useState([]);
  const [exportDataExcel, setExportDataExcel] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [deviceDataList, setDeviceDataList] = useState([]);
  const [value, setValue] = React.useState("box_number");
  useEffect(() => {
    fetchStateList();
  }, []);
  async function fetchCommand() {
    const isFormCompeleted = client?.id && state?.id && imeiNumbers;
    if (!isFormCompeleted) {
      alert("All Field are mandatory!");
      return;
    }
    await fetchDeviceData();
    try {
      let data = {
        clientId: client?.id,
        stateId: state.id,
      };
      const response = await DeviceAction.getCommand(data);
      if (response.responseCode == 200 || response.responseCode == 201) {
        console.log(response);
        setCommand(response?.data?.command);
      } else {
        alert(response.message);
        return;
      }
    } catch (err) {
      console.log(err);
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
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  async function fetchDeviceData() {
    let data = {
      isBoxSearch: value == "box_number" ? 1 : 0,
      search: imeiNumbers,
    };

    const response = await DeviceAction.getDeviceInfo(data);
    debugger;
    if (response.responseCode == 200 || response.responseCode == 201) {
      const array = response?.data?.map((ele) => {
        return { ...ele, isSelected: false };
      });
      setDeviceDataList((pre) => [...array, ...pre]);
      console.log(response?.data || []);
    } else {
      alert(response.message);
      return;
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
  // const onPdfDownload = (type) => {
  //   getSubscriptionList(false, "pdf");
  // };

  // const onExcelDownload = (type) => {
  //   getSubscriptionList(false, "excel");
  // };
  let topViewData = {
    pageTitle: "Bulk Reconfigure",

    addText: "Add Return Device",

    hideAddButton: true,
    addClick: `/addSubscription`,

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

    searchFieldHandler: null,
    searchInput: null,
    searchField: true,
  };
  const tableHeadForExport = [
    "S.No.",
    "Subscription Id",
    "State",
    "Amount(Rs.)",
    "Subscription Period",
  ];

  const exportDataList = (exportArray) => {
    console.log(exportArray, "exportarray");
    let exportDataArray = [];
    exportArray &&
      exportArray.length > 0 &&
      exportArray.forEach((item, index) => {
        let objExport = {
          col1: index + 1,
          col2: item?.subsTypeId ?? "NA",

          col3: item.state && item.state.name ? item.state.name : "NA",
          col4: item?.defaultAmount ?? "NA",

          col5: item?.totalDays ?? "NA",
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
      name: "Imei Number",
      width: "150px",
    },
    {
      name: "CCID",
      width: "150px",
    },
    {
      name: "client",
      width: "150px",
    },
    {
      name: "state",
      width: "150px",
    },
  ];
  async function reconfigureDevices() {
    if (!command.trim()) {
      alert("Please enter command!");
      return;
    }

    debugger;
    let selectedImeiNumbers = [];
    deviceDataList.forEach((element) => {
      if (element.isSelected) {
        selectedImeiNumbers.push(element.imeiNo);
      }
    });
    console.log(selectedImeiNumbers);
    if (selectedImeiNumbers.length == 0) {
      alert("please select device!");
      return;
    }
    let data = {
      imeiNoList: selectedImeiNumbers,
      requestedBy: JSON.parse(localStorage.getItem("data")).id,
      command: command.trim(),
      boxCode: value == "box_number" ? imeiNumbers : "",
    };

    const res = await DeviceAction.reconfigureDevices(data);
    console.log(res);
    if (res.responseCode == 200 || res.responseCode == 201) {
      alert("command sent!");
      navigate("/reconfigureCommandList");
    } else {
      alert("command not sent!");
    }
  }

  function deviceSelectHandler(data) {
    const array = deviceDataList.map((ele) => {
      if (data.id == ele.id) {
        return { ...ele, isSelected: !ele.isSelected };
      } else {
        return ele;
      }
    });

    setDeviceDataList(array);
  }

  function selectAllHandler(event) {
    setIsAllSelected(event.target.checked);
    setDeviceDataList((deviceDataList) =>
      deviceDataList.map((ele) => {
        return { ...ele, isSelected: event.target.checked };
      })
    );
  }

  return (
    <div className="main_container">
      <Box className="main">
        <ThemeProvider theme={theme}>
          <TopView topViewData={topViewData}></TopView>
          <LoadingComponent isLoading={isLoading} />
          <ConfirmationDialog
            title={"Reconfigure Box"}
            open={open}
            setOpen={setOpen}
            description={`Do you really want to send ${command}   ?`}
            confirmHandler={reconfigureDevices}
          />
          <Grid container sx={{ marginTop: "0rem", background: "" }} rowGap={1}>
            <Grid item xs={12} sm={4} md={4} lg={2} xl={1}>
              <div style={{ display: "none" }}>
                <ExportPdf
                  exportData={exportDataPdf || []}
                  labelHeader={tableHeadForExport || []}
                  title="Subscription List"
                  reportName="Subscription List"
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={2} xl={1.5}>
              <div style={{ display: "none" }}>
                <ExportReport
                  exportData={exportDataExcel || []}
                  labelHeader={tableHeadForExport || []}
                  exportHeading={["Subscription List"]}
                />
              </div>
            </Grid>

            <Grid item xs={12} container>
              <Paper sx={{ width: "100%", mb: 2, padding: 1 }} elevation={1}>
                <Grid container spacing={2} alignItems={"center"}>
                  <Grid item>
                    <Grid>
                      <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                        {value}
                      </Typography>
                    </Grid>
                    <Textarea
                      minRows={1}
                      placeholder={`Enter ${value}`}
                      value={imeiNumbers}
                      onChange={(e) => setImeiNumbers(e.target.value)}
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
                          // error={errors.state}
                          // helperText={errors.state}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={fetchCommand}
                      variant="contained"
                      sx={{ marginTop: "20px" }}
                    >
                      get Data
                    </Button>
                  </Grid>
                  {/* </Grid> */}
                  <Grid item xs={12}>
                    <Grid>
                      <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                        Command
                      </Typography>
                    </Grid>
                    <Textarea
                      disabled={true}
                      minRows={1}
                      placeholder={""}
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Paper>
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
                        <>
                          <TableCell>
                            <Checkbox
                              checked={isAllSelected}
                              onChange={(event) => selectAllHandler(event)}
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          </TableCell>
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
                        </>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {deviceDataList?.length > 0 &&
                        deviceDataList.map((user, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell>
                                <Checkbox
                                  checked={user.isSelected}
                                  onChange={() => deviceSelectHandler(user)}
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                {index + 1}
                              </TableCell>
                              <TableCell
                                sx={{
                                  textAlign: "center",
                                  cursor: "pointer",
                                  // color: "blue",
                                }}
                                onClick={() => {
                                  debugger;
                                  // const path = `viewLot/${user.id}`;

                                  // const path = `DevicesList/${user.id}`;
                                  // window.open(path, "_self");
                                }}
                              >
                                {user.imeiNo || "NA"}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                {user?.iccidNo ?? "NA"}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                {user?.clientName ?? "NA"}
                              </TableCell>{" "}
                              <TableCell sx={{ textAlign: "center" }}>
                                {user?.state?.name ?? "NA"}
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
            <Grid
              item
              xs={12}
              textAlign={"right"}
              container
              justifyContent={"flex-end"}
              spacing={1}
            >
              <Grid item>
                <Button
                  onClick={() => navigate("/reconfigureCommandList")}
                  // sx={{ color: "white", marginTop: "20px" }}
                >
                  cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpen(true);
                  }}
                  // sx={{ color: "white", marginTop: "20px" }}
                >
                  Reconfigure
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </ThemeProvider>
      </Box>
    </div>
  );
};

export default BulkReconfigure;
