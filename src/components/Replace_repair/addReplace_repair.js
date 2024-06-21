import React, { useState, useEffect, useRef } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import moment from "moment";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { LotAction } from "../../components/actions/Lot";
import { DeviceAction } from "../../components/actions/device";
import { companyAction } from "../company/companyFetchData";
import { MaintenanceAction } from "../actions/maintenance";

import { BoxPackaging } from "../actions/boxPackaging";
import { styled } from "@mui/material/styles";
import TopView from "../CommonComponents/topView";
import axios from "axios";
import ImageModal from "../returnManagement/imagePreviewModal";
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import config from "../../config/config";
import LoadingComponent from "../CommonComponents/LoadingComponts";
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

function AddMaintenance() {
  const navigate = useNavigate();
  const { repairRequestId } = useParams();
  console.log(repairRequestId);

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
      id: repairRequestId,
    };
    const response = await MaintenanceAction.getRepairRequestList(data);
    if (response !== null && response.data.length > 0) {
      console.log(response.data[0]);
      setReturnRequestData(response.data[0]);
      const {
        id,
        state,
        client,
        gstNumber,
        repairCode,
        ewayBillNo,
        ewayBillImage,

        totalDevice,
        repairReplaceDevices,
      } = response.data[0];
      debugger;
      console.log(id);
      setPreviewImageObj((pre) => {
        return {
          ewayBillNumber: {
            imageUrl: ewayBillImage,
          },
        };
      });
      debugger;
      setState(state);
      setClient(client);
      //   setClientList([client]);
      setReferenceCode(repairCode);
      setEwayBillNumber(ewayBillNo);
      //   setDebitNoteNumber(debitNoteNo);
      //   setReturnReason(reason);
      setDeviceCount(totalDevice);
      setDevicesList(repairReplaceDevices);
    } else {
      console.log("error");
    }
  }
  useEffect(() => {
    if (repairRequestId != 0) {
      getReturnRequestById();
    }
    // getReturnRequestById();
  }, []);

  async function addDeviceToRepair(searchTerm) {
    try {
      let data = {
        search: searchTerm,
        repairDeviceMasterId: +repairRequestId,
        userId: JSON.parse(localStorage.getItem("data")).id,
      };

      const response = await MaintenanceAction.addDeviceToRepair(data);
      console.log(response);
      if (response.responseCode == 200 || response.responseCode == 201) {
        alert(response.message);

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

  const debounceHandler = searchDevice(addDeviceToRepair, 500);

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
          //   document.getElementById("logo").value = null;
        }
      } catch (error) {
        console.log("error:", error);
      }
    }
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

  async function fetchStateList() {
    const response = await BoxPackaging.getAllStatesList();
    if (response) {
      debugger;
      setStateList(response);
    } else {
      setStateList([]);
    }
  }

  useEffect(() => {
    if (repairRequestId == 0) {
      //   fetchCompanyData();
      fetchStateList();
    }
  }, []);

  let topViewData = {
    pageTitle: "Add Repair/Replace",

    addText: "Add Repair/Replace",

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

  const generateRepairReceipt = async () => {
    debugger;
    if (!previewImageObj?.ewayBillNumber?.imageUrl) {
      alert("Please upload E-Way bill image");
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
        ewayBillImage: previewImageObj?.ewayBillNumber?.imageUrl ?? "",
        ewayBillNo: ewayBillNumber,
      };
      const response = await MaintenanceAction.generateRepairReceipt(data);
      console.log(response);
      if (response && response.responseCode == 201) {
        alert(response.message);
        window.open(`/addDeviceToMaintenance/${response?.data?.id}`, "_self");

        setReferenceCode(response?.data?.reqCode ?? "");
      } else {
      }
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

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
                          {/* <TextField
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
                              debouncedFunctionForClient(e.target.value);
                            }}
                            textAlign="center"
                          /> */}
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
                              {/* <TextField
                                sx={{ width: "320px" }}
                                // id="logo"
                                name="ewayBillNumber"
                                size="small"
                                type="string"
                                variant="outlined"
                                value={
                                  `${
                                    previewImageObj?.ewayBillNumber?.filename ??
                                    "Select"
                                  } image` || ""
                                }
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <Button
                                        variant="contained"
                                        component="label"
                                        sx={{ height: "20px", color: "white" }}
                                      >
                                        Upload
                                        <input
                                          name="ewayBillNumber"
                                          hidden
                                          type="file"
                                          onChange={handleFileUpload}
                                        />
                                      </Button>
                                    </InputAdornment>
                                  ),
                                }}
                              /> */}
                              <Button
                                sx={{ color: "white" }}
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                              >
                                Upload file
                                <VisuallyHiddenInput
                                  type="file"
                                  name="ewayBillNumber"
                                  onChange={handleFileUpload}
                                />
                              </Button>
                            </Grid>
                            <Grid item>
                              {previewImageObj?.ewayBillNumber?.imageUrl && (
                                <>
                                  <img
                                    src={
                                      previewImageObj?.ewayBillNumber?.imageUrl
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
                                        previewImageObj?.ewayBillNumber
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

                    <Grid
                      item
                      container
                      justifyContent={"flex-end"}
                      spacing={2}
                    >
                      <Grid item>
                        <Button
                          variant="outlined"
                          onClick={() => navigate("/maintenanceList")}
                        >
                          Cancel
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          sx={{ color: "white" }}
                          onClick={generateRepairReceipt}
                        >
                          Generate Receipt
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
                            Box Number
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
                            Issue Date
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#fff",
                              backgroundColor: "rgb(48 85 135)",
                            }}
                          >
                            Warranty Date
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#fff",
                              backgroundColor: "rgb(48 85 135)",
                            }}
                          >
                            Lot ID
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#fff",
                              backgroundColor: "rgb(48 85 135)",
                            }}
                          >
                            Status
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
                                <TableCell>{row?.boxNo ?? "NA"}</TableCell>

                                <TableCell
                                  sx={{
                                    // textAlign: "center",
                                    cursor: "pointer",
                                    color: "#039cf4",
                                  }}
                                  onClick={() => {
                                    debugger;
                                    const path = "/repairticket";
                                    navigate(path, {
                                      state: {
                                        repairDetails: {
                                          ...row,
                                          repairRequestId,
                                        },
                                      },
                                    });
                                  }}
                                >
                                  {row?.imei ?? "NA"}
                                </TableCell>
                                <TableCell>
                                  {moment(row?.issuedAt).format(
                                    "DD-MM-YYYY HH:mm"
                                  )}
                                </TableCell>
                                <TableCell>{"NA"}</TableCell>

                                <TableCell>{row?.mfgLotNo ?? "NA"}</TableCell>
                                <TableCell>{row?.status ?? "NA"}</TableCell>
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

export default AddMaintenance;
