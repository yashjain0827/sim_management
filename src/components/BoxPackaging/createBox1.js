import React, { useState, useEffect, useRef } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import moment from "moment";
import {
  useNavigate,
  useParams,
  useLocation,
  Navigate,
} from "react-router-dom";
import { LotAction } from "../../components/actions/Lot";
import { DeviceAction } from "../../components/actions/device";
import { companyAction } from "../company/companyFetchData";
import { MaintenanceAction } from "../actions/maintenance";

import { BoxPackaging } from "../actions/boxPackaging";
import { styled, useTheme } from "@mui/system";
import TopView from "../CommonComponents/topView";
import axios from "axios";
// import ImageModal from "./imagePreviewModal";
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
import ExportReport from "../CommonComponents/Export";
import ExportPdf from "../CommonComponents/exportPdf";
// import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import config from "../../config/config";
import LoadingComponent from "../CommonComponents/LoadingComponts";
import EmptyTextarea from "../CommonComponents/CustomTextArea";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";

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

var tableHeadForExport = [
  "S.No",
  "Updated at",
  "Imei Number",
  "CCID Number",
  "UID NUMBER",
  "software version",
  "State",
  "provider",
];
function CreateBox() {
  const navigate = useNavigate();
  const { createdBoxId } = useParams();
  const scannerTimeoutId = useRef(null);
  const timerForClient = useRef(null);
  const [deviceCount, setDeviceCount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({});
  const [stateList, setStateList] = useState([]);
  const [returnReason, setReturnReason] = useState("");
  const [devicesList, setDevicesList] = useState([]);
  const [referenceCode, setReferenceCode] = useState("");
  const [deviceNumber, setDeviceNumber] = useState("");
  const [simProviderList, setSimProviderList] = useState([]);
  const [simProvider, setSimProvider] = useState({});
  const [exportDataPdf, setExportDataPdf] = useState([]);
  const [exportDataExcel, setExportDataExcel] = useState([]);
  const [createdBoxDetails, setCreatedBoxDetails] = useState();
  const [client, setClient] = useState();
  const [clientList, setClientList] = useState([]);

  const [debitNoteNumber, setDebitNoteNumber] = useState();
  const [previewImageObj, setPreviewImageObj] = useState({});
  const [debitNoteImage, setDebitNoteImage] = useState(null);
  const [ewayBillNumber, setEwayBillNumber] = useState("");

  const [openImageModal, setOpenImageModal] = useState(false);

  const [returnRequestData, setReturnRequestData] = useState();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [modalImage, setModalImage] = useState({
    filename: "",
    imageUrl: "",
  });

  const exportDataList = (exportArray) => {
    console.log(exportArray, "exportarray");
    let exportDataArray = [];
    exportArray.forEach((val, index) => {
      let objExport = {
        col1: index + 1,
        col2: val ? moment(val.updatedAt).format("YYYY-MM-DD hh:mm a") : "NA",
        col3: val?.imeiNo ?? "NA",
        col4: val?.iccidNo ?? "NA",
        col5: val?.uuidNo ?? "NA",

        col6: val?.softwareVersion ?? "NA",
        // col6: val && val.currentQuantity ? val.currentQuantity : "NA",

        col7: val.state && val.state.name !== null ? val.state.name : "NA",
        col8: val?.sim1Provider ?? "NA",
        // col8: "NA",
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
  const exportHandler = (type) => {
    exportDataList(devicesList);
    if (type === "excel") {
      setTimeout(() => {
        document.getElementById("exportDataList").click();
      }, 500);
    }
    if (type === "pdf") {
      setTimeout(() => {
        document.getElementById("exportPdfButton").click();
      }, 500);
    }
  };

  async function fetchSimProviders() {
    const response = await DeviceAction.getProviders();
    if (response) {
      setSimProviderList(response);
    } else {
      setSimProviderList([]);
    }
  }

  async function getBoxDevicesById() {
    let data = {
      id: +createdBoxId,
    };
    const response = await BoxPackaging.getDevicesByBoxId(data);
    if (response !== null && response.data) {
      //   console.log(response.data[0]);
      //   setReturnRequestData(response.data[0]);
      const { boxDTO, deviceList, provider } = response.data;
      debugger;
      //   console.log(id);

      debugger;
      setState(boxDTO?.state ?? {});
      setClient(client);
      //   setClientList([client]);
      setReferenceCode(boxDTO.boxNo);
      setSimProvider(boxDTO?.provider);

      setReturnReason(boxDTO?.remarks ?? "");
      setDeviceCount(boxDTO?.quantity ?? "");
      setDevicesList(deviceList || []);
    } else {
      console.log("error");
      setDevicesList([]);
    }
  }
  useEffect(() => {
    if (createdBoxId != 0) {
      getBoxDevicesById();
    }

    // getBoxDevicesById();
  }, []);

  async function addDeviceToBox(searchTerm) {
    try {
      let data = {
        search: searchTerm,
        id: +createdBoxId,
        createdById: JSON.parse(localStorage.getItem("data")).id,
      };

      const response = await BoxPackaging.addDeviceToBox(data);
      if (response.responseCode == 200) {
        setDevicesList((pre) => {
          if (pre.length == 0) {
            return [response.data];
          } else {
            return [response.data, ...pre];
          }
        });
      } else {
        alert(response.message);
      }
      setDeviceNumber("");
      document.getElementById("deviceNumber").focus();
    } catch (err) {
      console.log(err);
    }
  }
  function searchDevice(getData, delay) {
    // console.log(searchTerm);
    const that = this;
    let latestArgs;

    // console.log(timer);
    return (...args) => {
      debugger;
      latestArgs = args;
      // setSearchKeyword(...args);
      console.log(scannerTimeoutId.current);
      if (scannerTimeoutId.current) {
        // alert("on");
        clearTimeout(scannerTimeoutId.current);
      }
      scannerTimeoutId.current = setTimeout(() => {
        debugger;
        getData.apply(that, latestArgs);
      }, delay);
    };
  }

  const debounceHandler = searchDevice(addDeviceToBox, 500);

  const handleFileUpload = async (event) => {
    console.log(event);
    const file = event.target.files[0];
    console.log(file);
    console.log(event.target.name);
    // setCompanyLogo(file?.name);
    if (file) {
      const formData = new FormData();
      formData.append("token", "staging");
      formData.append("files[0]", file);
      try {
        const response = await axios.post(
          "https://storage.nyggs.com/setmedia/api/save/file",
          formData
        );
        if (
          response &&
          response.data &&
          response.data.responseCode === 200 &&
          response.data.data
        ) {
          console.log("url", response?.data?.data?.fileUrls);
          //   setConvertedUrl(response?.data?.data?.fileUrls);

          setPreviewImageObj((pre) => {
            debugger;
            console.log({
              ...pre,
              [event.target.name]: {
                imageUrl: response?.data?.data?.fileUrls[0],
                filename: file.name,
              },
            });
            return {
              ...pre,
              [event.target.name]: {
                imageUrl: response?.data?.data?.fileUrls[0],
                filename: event.target.name,
              },
            };
          });
          //   setPreviewImageObj(response?.data?.data?.fileUrls);
          document.getElementById("logo").value = null;
        }
      } catch (error) {
        console.log("error:", error);
      }
    }
  };

  async function fetchStateList() {
    const response = await BoxPackaging.getAllStatesList();
    if (response) {
      setStateList(response);
    } else {
      setStateList([]);
    }
  }

  useEffect(() => {
    if (createdBoxId == 0) {
      //   fetchCompanyData();
      fetchSimProviders();
      fetchStateList();
      //   fetchStateList();
    }
  }, []);

  let topViewData = {
    pageTitle: "Create Box",

    addText: "Add Return",

    hideAddButton: true,
    addClick: "/addDeviceToBox",

    editText: "",
    hideEditButton: true,
    editClick: null,

    cancelText: null,
    hideCancelButton: true,
    cancelClick: null,

    updateText: null,
    hideUpdateButton: true,
    updateClick: null,

    hidePdfExport: deviceCount == devicesList.length ? false : true,
    exportPdfClick: "",
    onPdfDownload: exportHandler,

    hideExcelExport: deviceCount == devicesList.length ? false : true,
    exportExcelClick: "",
    onExcelDownload: exportHandler,

    hideExcelImport: true,
    excelImportClick: "",

    filter: true,
    filterHandler: null,

    searchFieldHandler: null,
    searchInput: null,
    searchField: true,
  };

  const generateBoxNumber = async () => {
    setIsLoading(true);
    const canSave = state?.id && simProvider?.id && deviceCount;

    if (!canSave) {
      alert("please fill the details");
      return;
    }
    try {
      let data = {
        quantity: deviceCount || 0,
        providerId: simProvider?.id ?? null,
        stateId: state?.id ?? null,
        createdById: JSON.parse(localStorage.getItem("data")).id,
        remarks: returnReason || "",
      };
      const response = await BoxPackaging.createBox1(data);
      console.log(response);
      debugger;
      if (response && response.responseCode == 201) {
        console.log(response);
        setReferenceCode(response?.data?.boxNo ?? "");
        setCreatedBoxDetails(response.data);
        navigate(`/createBox/${response.data.id}`);
        alert(response.message);
      } else {
        alert(response.message);
      }
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  async function fetchCompanyData(searchTerm) {
    setSearchKeyword(searchTerm);
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
      console.log(latestArgs);
      console.log(timerForClient.current);
      if (timerForClient.current) {
        // alert("on");
        clearTimeout(timerForClient.current);
      }
      timerForClient.current = setTimeout(() => {
        getData.apply(that, latestArgs);
      }, delay);
    };
  }

  const debouncedFunctionForClient = searchClient(fetchCompanyData, 1000);
  console.log(debouncedFunctionForClient);
  return (
    <div className="main_container">
      <Box className="main">
        <div style={{ display: "none" }}>
          <ExportPdf
            exportData={exportDataPdf || []}
            labelHeader={tableHeadForExport || []}
            title={`Box Details : ${referenceCode && referenceCode}`}
            reportName="Box List"
          />
          <ExportReport
            exportData={exportDataExcel || []}
            labelHeader={tableHeadForExport || []}
            exportHeading={[`Box Details : ${referenceCode && referenceCode}`]}
          />
        </div>
        <ThemeProvider theme={theme}>
          {/* <ImageModal
            open={openImageModal}
            setOpen={setOpenImageModal}
            imageObj={modalImage}
            // fileName={fileName}
          ></ImageModal> */}
          <LoadingComponent isLoading={isLoading} />

          <TopView topViewData={topViewData}></TopView>

          <Grid container direction={"column"} spacing={2}>
            <Grid item>
              <Paper sx={{ width: "100%", mb: 2 }} elevation={1}>
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      background: "rgb(14 57 115 / 86%)",
                      padding: "10px",
                      borderRadius: "5px",

                      color: "white",
                    }}
                  >
                    <Typography variant="h5">
                      {`Box No:${referenceCode}`}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    direction={"row"}
                    container
                    rowGap={3.3}
                    spacing={2}
                    sx={{ padding: "20px 25px" }}
                  >
                    <Grid item>
                      <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                        Sim Provider
                      </Typography>
                      <CustomAutoComplete
                        disablePortal
                        disabled={createdBoxId == "0" ? false : true}
                        id="combo-box-demo"
                        options={simProviderList || []}
                        value={simProvider}
                        getOptionLabel={({ name }) => {
                          return name || "";
                        }}
                        onChange={(e, newValue) => setSimProvider(newValue)}
                        sx={{ width: 220 }}
                        renderInput={(params) => <TextField {...params} />}
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
                        disabled={createdBoxId == "0" ? false : true}
                        getOptionLabel={({ name }) => {
                          return name || "";
                        }}
                        onChange={(e, newValue) => setState(newValue)}
                        sx={{ width: 240 }}
                        renderInput={(params) => <TextField {...params} />}
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
                        disabled={createdBoxId == "0" ? false : true}
                        size="small"
                        variant="outlined"
                        value={deviceCount}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        //   value={toDate}
                        inputProps={
                          {
                            // style: {
                            //   width: "8rem",
                            // },
                          }
                        }
                        onChange={(e) => {
                          setDeviceCount(e.target.value);
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                        Remark
                      </Typography>
                      {/* <TextField
                        sx={{ overflowWrap: "break-word" }}
                        name="returnReason"
                        type="textarea"
                        //   label="ToDate"
                        size="small"
                        variant="outlined"
                        value={returnReason}
                        fullWidth
                        rows={3}

                        // InputLabelProps={{ shrink: true }}
                        //   value={toDate}
                        // inputProps={{
                        //   style: {
                        //     width: "8rem",
                        //   },
                        // }}
                        onChange={(e) => {
                          setReturnReason(e.target.value);
                        }}
                      /> */}
                      <EmptyTextarea
                        disabled={createdBoxId == "0" ? false : true}
                        value={returnReason}
                        placeHolder="Remarks"
                        onChange={(e) => {
                          setReturnReason(e.target.value);
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      container
                      justifyContent={"flex-end"}
                      spacing={2}
                    >
                      {/* <Grid item>
                        <Button
                          variant="outlined"
                          onClick={() => navigate("/boxList")}
                        >
                          Cancel
                        </Button>
                      </Grid> */}
                      <Grid item>
                        <Button
                          variant="contained"
                          sx={{ color: "white" }}
                          onClick={generateBoxNumber}
                          disabled={createdBoxId == "0" ? false : true}
                        >
                          Save
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            {referenceCode && (
              <Grid
                item
                container
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Grid item>
                  <TextField
                    name="deviceNumber"
                    type="text"
                    //   label="ToDate"
                    id="deviceNumber"
                    size="small"
                    variant="outlined"
                    value={deviceNumber}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    //   value={toDate}
                    inputProps={
                      {
                        // style: {
                        //   width: "8rem",
                        // },
                      }
                    }
                    onChange={(e) => {
                      setDeviceNumber(e.target.value);
                      debounceHandler(e.target.value);
                    }}
                    placeholder="Device Detail"
                  />
                </Grid>
                <Grid item>
                  <Typography
                    sx={{
                      border: "1px solid rgb(14 57 115 / 86%)",
                      borderRadius: "5px",
                      padding: "3px",
                      fontSize: "1.1rem",
                      color: "#333",
                    }}
                  >
                    {`Device Count : ${
                      devicesList?.length || 0
                    }/${deviceCount}`}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    sx={{ color: "white" }}
                    onClick={() =>
                      document.getElementById("deviceNumber").focus()
                    }
                  >
                    Add Device
                  </Button>
                </Grid>
              </Grid>
            )}
            {referenceCode && (
              <Grid item>
                <Paper sx={{ width: "100%", mb: 2 }} elevation={1}>
                  <TableContainer sx={{ maxHeight: "67vh" }}>
                    <Table size="small" stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow
                          sx={{
                            backgroundColor: "rgb(14 57 115 / 86%)",
                            color: "#fff",
                          }}
                        >
                          <TableCell
                            sx={{
                              color: "#fff",
                              backgroundColor: "rgb(48 85 135)",
                            }}
                          >
                            S.No
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#fff",
                              backgroundColor: "rgb(48 85 135)",
                            }}
                          >
                            Updated At
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#fff",
                              backgroundColor: "rgb(48 85 135)",
                            }}
                          >
                            IMEI Number
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#fff",
                              backgroundColor: "rgb(48 85 135)",
                            }}
                          >
                            CCID Number
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#fff",
                              backgroundColor: "rgb(48 85 135)",
                            }}
                          >
                            UID Number
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#fff",
                              backgroundColor: "rgb(48 85 135)",
                            }}
                          >
                            Software Version
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#fff",
                              backgroundColor: "rgb(48 85 135)",
                            }}
                          >
                            state Name
                          </TableCell>{" "}
                          <TableCell
                            sx={{
                              color: "#fff",
                              backgroundColor: "rgb(48 85 135)",
                            }}
                          >
                            Sim Provider
                          </TableCell>
                          {/* <TableCell
                            sx={{
                              color: "#fff",
                              backgroundColor: "rgb(48 85 135)",
                            }}
                          >
                            Action
                          </TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {devicesList &&
                          Array.isArray(devicesList) &&
                          devicesList?.map((row, index) => (
                            <>
                              <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                  {moment(row?.updatedAt).format(
                                    "DD-MM-YYYY HH:mm"
                                  )}
                                </TableCell>
                                <TableCell>{row?.imeiNo ?? "NA"}</TableCell>
                                <TableCell>{row?.iccidNo ?? "NA"}</TableCell>
                                <TableCell>{row?.uuidNo ?? "NA"}</TableCell>

                                <TableCell>
                                  {row?.softwareVersion ?? "NA"}
                                </TableCell>

                                <TableCell>
                                  {row?.state?.name ?? "NA"}
                                </TableCell>
                                <TableCell>
                                  {row?.sim1Provider ?? "NA"}
                                </TableCell>

                                {/* <TableCell>
                                  {moment(row?.issuedAt).format(
                                    "DD-MM-YYYY HH:mm"
                                  )}
                                </TableCell>

                                <TableCell>{row?.boxNo ?? "NA"}</TableCell>
                                <TableCell>{row?.mfgLotNo ?? "NA"}</TableCell>
                                <TableCell>{row?.invoiceNo ?? "NA"}</TableCell> */}
                              </TableRow>
                            </>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            )}
          </Grid>
        </ThemeProvider>
      </Box>
    </div>
  );
}

export default CreateBox;
