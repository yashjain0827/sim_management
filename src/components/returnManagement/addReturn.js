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
import ImageModal from "./imagePreviewModal";
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
// import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import config from "../../config/config";
import LoadingComponent from "../CommonComponents/LoadingComponts";
import EmptyTextarea from "../CommonComponents/CustomTextArea";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
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
function AddDeviceToReturn() {
  const navigate = useNavigate();
  const { returnRequestId } = useParams();
  const scannerTimeoutId = useRef(null);
  const timerForClient = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({});
  const [stateList, setStateList] = useState([]);
  const [client, setClient] = useState();
  const [clientList, setClientList] = useState([]);
  const [deviceCount, setDeviceCount] = useState();
  const [debitNoteNumber, setDebitNoteNumber] = useState();
  const [previewImageObj, setPreviewImageObj] = useState({});
  const [debitNoteImage, setDebitNoteImage] = useState(null);
  const [ewayBillNumber, setEwayBillNumber] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [devicesList, setDevicesList] = useState([]);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [referenceCode, setReferenceCode] = useState("");
  const [returnRequestData, setReturnRequestData] = useState();
  const [deviceNumber, setDeviceNumber] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [modalImage, setModalImage] = useState({
    filename: "",
    imageUrl: "",
  });

  async function getReturnRequestById() {
    let data = {
      id: returnRequestId,
    };
    const response = await MaintenanceAction.getReturnRequest(data);
    if (response !== null && response.data.length > 0) {
      console.log(response.data[0]);
      setReturnRequestData(response.data[0]);
      const {
        id,
        state,
        client,
        gstNumber,
        reqCode,
        ewayBillNo,
        ewayBillImage,
        debitNoteNo,
        debitNoteImage,
        reason,
        requestedQuantity,
        returnDevices,
      } = response.data[0];
      debugger;
      console.log(id);
      setPreviewImageObj((pre) => {
        console.log({
          debitNoteImage: {
            imageUrl: debitNoteImage,
          },
          ewayBillImage: {
            imageUrl: ewayBillImage,
          },
        });
        return {
          debitNoteImage: {
            imageUrl: debitNoteImage,
          },
          ewayBillImage: {
            imageUrl: ewayBillImage,
          },
        };
      });
      debugger;
      setState(state);
      setClient(client);
      //   setClientList([client]);
      setReferenceCode(reqCode);
      setEwayBillNumber(ewayBillNo);
      setDebitNoteNumber(debitNoteNo);
      setReturnReason(reason);
      setDeviceCount(requestedQuantity);
      setDevicesList(returnDevices);
    } else {
      console.log("error");
    }
  }
  useEffect(() => {
    if (returnRequestId != 0) {
      getReturnRequestById();
    }
    // getReturnRequestById();
  }, []);

  async function addDeviceToReturn(searchTerm) {
    try {
      let data = {
        search: searchTerm,
        returnDeviceMasterId: +returnRequestId,
        userId: JSON.parse(localStorage.getItem("data")).id,
      };

      const response = await MaintenanceAction.addDeviceToReturn(data);
      if (response.responseCode == 200) {
        setDevicesList((pre) => {
          return [...pre, response.data];
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

  const debounceHandler = searchDevice(addDeviceToReturn, 500);

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
    if (returnRequestId == 0) {
      //   fetchCompanyData();
      fetchStateList();
    }
  }, []);

  let topViewData = {
    pageTitle: "Add Return",

    addText: "Add Return",

    hideAddButton: true,
    addClick: "/addDeviceToReturn",

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

  const generateReturnReceipt = async () => {
    console.log(returnReason);
    debugger;
    if (!previewImageObj?.debitNoteImage?.imageUrl) {
      alert("Please Add debit note image");
      return;
    } else if (!previewImageObj?.ewayBillImage?.imageUrl) {
      alert("Please Add eway bill image");
      return;
    }
    setIsLoading(true);

    try {
      let data = {
        clientId: client?.id ?? null,
        stateId: state?.id ?? null,
        totalDevice: deviceCount || 0,
        userId: JSON.parse(localStorage.getItem("data")).id,
        userName: JSON.parse(localStorage.getItem("data")).name,
        debitNoteImage: previewImageObj?.debitNoteImage?.imageUrl ?? "",
        debitNoteNo: debitNoteNumber || "",
        ewayBillImage: previewImageObj?.ewayBillImage?.imageUrl ?? "",
        ewayBillNo: ewayBillNumber,
        reason: returnReason || "",
      };
      const response = await MaintenanceAction.generateReturnReceipt(data);
      console.log(response);
      debugger;
      if (response && response.responseCode == 201) {
        alert(response.message);
        // window.open(`/addDeviceToReturn/${response?.data?.id}`, "_self");
        // navigate(`/addDeviceToReturn/${response?.data?.id}`);
        navigate(`/return`);
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
        <ThemeProvider theme={theme}>
          <ImageModal
            open={openImageModal}
            setOpen={setOpenImageModal}
            imageObj={modalImage}
            // fileName={fileName}
          ></ImageModal>
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
                      {`Reference No:${referenceCode}`}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    direction={"column"}
                    container
                    rowGap={3.3}
                    sx={{ padding: "20px 25px" }}
                  >
                    <Grid item container sx={{ background: "" }}>
                      <Grid item xs={2}>
                        <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                          Client Name
                        </Typography>
                        <Grid item>
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
                      </Grid>
                      <Grid item xs={2}>
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
                          sx={{ width: 240 }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </Grid>
                      <Grid item xs={1}>
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
                    </Grid>
                    {/* DEBIT NOTE DETAILS */}
                    <Grid item>
                      <Paper>
                        <Grid container rowGap={2}>
                          <Grid
                            item
                            xs={12}
                            sx={{
                              background: "rgb(14 57 115 / 86%)",
                              color: "white",
                              padding: "10px 5px",
                              borderRadius: "5px",
                            }}
                          >
                            <Typography variant="h6">
                              Debit Note Number:
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            container
                            xs={12}
                            sx={{ padding: "5px" }}
                            columnGap={3}
                          >
                            <Grid item xs={2}>
                              <Typography
                                sx={{ color: "rgb(14 57 115 / 86%)" }}
                              >
                                Debit Note Number
                              </Typography>
                              <TextField
                                name="debitNoteNumber"
                                type="text"
                                //   label="ToDate"
                                size="small"
                                variant="outlined"
                                value={debitNoteNumber}
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
                                  setDebitNoteNumber(e.target.value);
                                }}
                              />
                            </Grid>
                            <Grid item xs={2}>
                              <Typography
                                sx={{ color: "rgb(14 57 115 / 86%)" }}
                              >
                                Debit Note Image
                                <span style={{ color: "red" }}>*</span>
                              </Typography>

                              <Button
                                sx={{ color: "white" }}
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                              >
                                {previewImageObj?.debitNoteImage?.imageUrl
                                  ? "Update File"
                                  : "Upload file"}
                                <VisuallyHiddenInput
                                  type="file"
                                  name="debitNoteImage"
                                  onChange={handleFileUpload}
                                />
                              </Button>
                            </Grid>
                            <Grid item sx={{ marginTop: "10px" }}>
                              {previewImageObj?.debitNoteImage?.imageUrl && (
                                <>
                                  <img
                                    src={
                                      previewImageObj?.debitNoteImage?.imageUrl
                                    }
                                    alt="Preview"
                                    style={{
                                      minWidth: "300px",
                                      maxHeight: "50px",
                                      marginTop: "10px",
                                    }}
                                  />
                                  <IconButton
                                    onClick={() => {
                                      setModalImage(
                                        previewImageObj?.debitNoteImage
                                      );
                                      setOpenImageModal(true);
                                    }}
                                    sx={{ padding: "0px 0px 35px 20px" }}
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                </>
                              )}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                    {/* E-WAY BILL DETAILS */}

                    <Grid item>
                      <Paper>
                        <Grid container rowGap={2}>
                          <Grid
                            item
                            xs={12}
                            sx={{
                              background: "rgb(14 57 115 / 86%)",
                              color: "white",
                              padding: "10px 5px",
                              borderRadius: "5px",
                            }}
                          >
                            <Typography variant="h6">
                              Eway Bill Details:
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            container
                            xs={12}
                            sx={{ padding: "5px" }}
                            columnGap={3}
                          >
                            <Grid item xs={2}>
                              <Typography
                                sx={{ color: "rgb(14 57 115 / 86%)" }}
                              >
                                Eway Bill Number
                              </Typography>
                              <TextField
                                name="ewayBillNumber"
                                type="text"
                                //   label="ToDate"
                                size="small"
                                variant="outlined"
                                value={ewayBillNumber}
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
                                  setEwayBillNumber(e.target.value);
                                }}
                              />
                            </Grid>
                            <Grid item xs={2}>
                              <Typography
                                sx={{ color: "rgb(14 57 115 / 86%)" }}
                              >
                                E-way bill Image
                                <span style={{ color: "red" }}>*</span>
                              </Typography>

                              <Button
                                sx={{ color: "white" }}
                                component="label"
                                // role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                              >
                                {previewImageObj?.ewayBillImage?.imageUrl
                                  ? "Update File"
                                  : "Upload file"}
                                <VisuallyHiddenInput
                                  type="file"
                                  name="ewayBillImage"
                                  onChange={handleFileUpload}
                                />
                              </Button>
                            </Grid>
                            <Grid item>
                              {previewImageObj?.ewayBillImage?.imageUrl && (
                                <>
                                  <img
                                    src={
                                      previewImageObj?.ewayBillImage?.imageUrl
                                    }
                                    alt="Preview"
                                    style={{
                                      minWidth: "300px",
                                      maxHeight: "50px",
                                      marginTop: "10px",
                                    }}
                                  />
                                  <IconButton
                                    onClick={() => {
                                      setModalImage(
                                        previewImageObj?.ewayBillImage
                                      );
                                      setOpenImageModal(true);
                                    }}
                                    sx={{ padding: "0px 0px 35px 20px" }}
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                </>
                              )}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                    <Grid item>
                      <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                        Return Reason
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
                        value={returnReason}
                        placeHolder="Enter Reason"
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
                      <Grid item>
                        <Button
                          variant="outlined"
                          onClick={() => navigate("/return")}
                        >
                          Cancel
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          sx={{ color: "white" }}
                          onClick={generateReturnReceipt}
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
              <Grid item container justifyContent={"space-between"}>
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
                <Grid item></Grid>
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
                            IMEI Number
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#fff",
                              backgroundColor: "rgb(48 85 135)",
                            }}
                          >
                            ICCID Number
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#fff",
                              backgroundColor: "rgb(48 85 135)",
                            }}
                          >
                            Issue Date
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#fff",
                              backgroundColor: "rgb(48 85 135)",
                            }}
                          >
                            Box Number
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#fff",
                              backgroundColor: "rgb(48 85 135)",
                            }}
                          >
                            Lot Id
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#fff",
                              backgroundColor: "rgb(48 85 135)",
                            }}
                          >
                            Invoice
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {devicesList &&
                          Array.isArray(devicesList) &&
                          devicesList?.map((row, index) => (
                            <>
                              <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{row?.imei ?? "NA"}</TableCell>
                                <TableCell>{row?.iccid ?? "NA"}</TableCell>
                                <TableCell>
                                  {moment(row?.issuedAt).format(
                                    "DD-MM-YYYY HH:mm"
                                  )}
                                </TableCell>

                                <TableCell>{row?.boxNo ?? "NA"}</TableCell>
                                <TableCell>{row?.mfgLotNo ?? "NA"}</TableCell>
                                <TableCell>{row?.invoiceNo ?? "NA"}</TableCell>
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

export default AddDeviceToReturn;
