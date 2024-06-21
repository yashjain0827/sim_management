import React, { useState, useEffect, useRef } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import moment from "moment";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { MaintenanceAction } from "../../components/actions/maintenance";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import TopView from "../CommonComponents/topView";
import axios from "axios";
import LoadingComponent from "../CommonComponents/LoadingComponts";
import ImageModal from "./image_Preview_modal";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import {
  Button,
  Grid,
  Paper,
  Typography,
  Box,
  Autocomplete,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";

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

const CustomStyledTypography = styled(Typography)(({ theme, customColor }) => ({
  padding: "2px",
  fontSize: "1.3rem", // Adjust the font size as needed
  fontWeight: "bold", // Adjust the font weight as needed
  color: customColor || theme.palette.success.main,
  display: "inline-block",
}));
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

function RepairTicket() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { repairDetails } = state;
  const { repairRequestId, id } = repairDetails;
  console.log(repairRequestId, id);
  console.log(state);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImageObj, setPreviewImageObj] = useState({
    closeBoxImageBeforeTesting: repairDetails?.closeBoxImageBeforeTesting || "",
    openBoxImageBeforeTesting: repairDetails?.openBoxImageBeforeTesting || "",
    closeBoxImageAfterTesting: repairDetails?.closeBoxImageAfterTesting || "",
    openBoxImageAfterTesting: repairDetails?.openBoxImageAfterTesting || "",
  });
  const [modalImage, setModalImage] = useState("");
  const [openImageModal, setOpenImageModal] = useState(false);
  const [repairDeviceCharges, setRepairDeviceCharges] = useState([]);
  const [chargesId, setChargesId] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [deviceCharges, setDeviceCharges] = useState();
  const [status, setStatus] = useState();
  function handleChange(event, index, rowData) {
    const copy = [...repairDeviceCharges].filter((ele) => {
      return ele.isChecked;
    });
    console.log(copy);
    const repairDeviceSet = new Set();
    for (const ele of copy) {
      repairDeviceSet.add(ele.id);
    }
    console.log(repairDeviceSet);
    debugger;
    if (event.target.checked) {
      repairDeviceSet.add(rowData?.id);
    } else {
      repairDeviceSet.delete(rowData?.id);
    }
    console.log([...repairDeviceSet.values()]);
    setChargesId([...repairDeviceSet.values()]);
    setRepairDeviceCharges((pre) => {
      if (event.target.checked) {
        setTotalAmount((preAmount) => preAmount + pre[index].charges);
      } else {
        setTotalAmount((preAmount) => preAmount - pre[index].charges);
      }
      return pre.map((ele, i, arr) => {
        return index == i ? { ...ele, isChecked: !ele.isChecked } : { ...ele };
      });
    });
  }
  let topViewData = {
    pageTitle: "Repair Ticket",

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

  async function getDeviceChargesById() {
    const response = await MaintenanceAction.getDeviceChargesById({
      repairDeviceMasterId: repairRequestId,
      repairDeviceId: id,
    });
    if (response) {
      console.log(response);
      setPreviewImageObj({
        closeBoxImageBeforeTesting:
          response?.data?.closeBoxImageBeforeTesting ?? "",
        openBoxImageBeforeTesting:
          response?.data?.openBoxImageBeforeTesting ?? "",
        closeBoxImageAfterTesting:
          response?.data?.closeBoxImageAfterTesting ?? "",
        openBoxImageAfterTesting:
          response?.data?.openBoxImageAfterTesting ?? "",
      });
      setStatus(response?.data?.status);
      // const arr = response?.data?.repairDeviceCharges.map((ele) => {
      //   return ele.chargesMaster;
      // });
      // setDeviceCharges(arr ?? []);
      return response?.data;
    }
  }

  async function issueChargeList() {
    const response = await MaintenanceAction.issueChargeList();
    console.log(response);
    // setRepairDeviceCharges(response);
    const res = await getDeviceChargesById();
    console.log(response, res);
    const arr = res.repairDeviceCharges.map((ele) => {
      return ele.chargesMaster;
    });
    const finalArray = filterApplicableChargesFromAll(response, arr);
    console.log(arr, finalArray);

    if (res.status == "REPLACED") {
      const arr2 = arr.map((ele) => {
        return { ...ele, isChecked: true };
      });
      setRepairDeviceCharges(arr2);
    } else {
      setRepairDeviceCharges(finalArray);
    }
    console.log(response, res, finalArray);
  }
  useEffect(() => {
    issueChargeList();
    // getDeviceChargesById();
  }, []);

  function filterApplicableChargesFromAll(array1, array2) {
    debugger;
    let finalArray = [];
    let obj1 = {};
    let totalAmount = 0;
    for (const item of array2) {
      obj1[item.id] = item;
      totalAmount = totalAmount + item.charges;
    }
    console.log(obj1);
    setTotalAmount(totalAmount);

    for (const item of array1) {
      let roleObj = {};
      if (item.id in obj1) {
        roleObj = { ...item, isChecked: true };
      } else {
        // obj1[item.id]["isApplied"] = false;
        roleObj = { ...item, isChecked: false };
      }

      finalArray.push(roleObj);
      console.log(finalArray);
    }
    console.log(finalArray);
    return finalArray;
  }

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
          response?.data &&
          response?.data?.responseCode === 200 &&
          response?.data?.data
        ) {
          console.log("url", response?.data?.data?.fileUrls);
          //   setConvertedUrl(response?.data?.data?.fileUrls);

          setPreviewImageObj((pre) => {
            console.log({
              ...pre,
              [event.target.name]: response?.data?.data?.fileUrls[0],
            });
            return {
              ...pre,
              [event.target.name]: response?.data?.data?.fileUrls[0],
            };
          });
          repairDevice({
            isRejected: null,
            [event.target.name]: response?.data?.data?.fileUrls[0],
          });
          //   setPreviewImageObj(response?.data?.data?.fileUrls);
          document.getElementById("logo").value = null;
        }
      } catch (error) {
        console.log("error:", error);
      }
    }
  };

  async function repairDevice(obj) {
    const {
      closeBoxImageAfterTesting,
      repairRequestId,
      id: deviceId,
      closeBoxImageBeforeTesting,
      openBoxImageAfterTesting,
      openBoxImageBeforeTesting,
    } = state.repairDetails;
    let data = {
      repairDeviceMasterId: +repairRequestId,
      repairDeviceId: deviceId,
      openBoxImageBeforeTesting:
        openBoxImageBeforeTesting || previewImageObj.openBoxImageBeforeTesting,
      closeBoxImageBeforeTesting:
        closeBoxImageBeforeTesting ||
        previewImageObj.closeBoxImageBeforeTesting,
      isRejected: null,
      openBoxImageAfterTesting:
        openBoxImageAfterTesting || previewImageObj.openBoxImageAfterTesting,
      closeBoxImageAfterTesting:
        closeBoxImageAfterTesting || previewImageObj.closeBoxImageAfterTesting,
      chargesId: chargesId,
      userId: JSON.parse(localStorage.getItem("data")).id,
    };
    for (const key in data) {
      if (obj.hasOwnProperty(key)) {
        data[key] = obj[key];
      }
    }
    console.log(data);

    const response = await MaintenanceAction.repairDevice(data);
    console.log(response);
    if (response.responseCode == 200) {
      console.log(`/addDeviceToMaintenance/${repairRequestId}`);
      alert(response.message);
      if (obj.isRejected != null) {
        navigate(`/addDeviceToMaintenance/${repairRequestId}`);
      }
    } else {
      alert(response.message);
      console.log(`/addDeviceToMaintenance/${repairRequestId}`);

      if (obj.isRejected != null) {
        navigate(`/addDeviceToMaintenance/${repairRequestId}`);
      }
    }
  }
  return (
    <div className="main_container">
      <Box className="main">
        <ThemeProvider theme={theme}>
          <LoadingComponent isLoading={isLoading} />
          <ImageModal
            open={openImageModal}
            setOpen={setOpenImageModal}
            imageObj={modalImage}
            // fileName={fileName}
          ></ImageModal>
          <Grid container justifyContent={"space-between"} className="mb-1">
            <Grid item xs={8}>
              <TopView topViewData={topViewData}></TopView>
            </Grid>
            <Grid item xs={4} container justifyContent={"flex-end"}>
              <Grid item xs={6} textAlign={"right"}></Grid>
              <Grid item xs={6} textAlign={"right"}>
                <Button
                  variant="contained"
                  sx={{ color: "white" }}
                  //   onClick={connectDeviceWithUsbPort}
                >
                  In warranty
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid container sx={{ marginTop: "0rem", background: "" }} rowGap={1}>
            <Grid item xs={12}>
              <Paper
                sx={{ width: "100%", margin: "10px 0px", padding: "10px" }}
                elevation={1}
              >
                <Grid
                  item
                  xs={12}
                  container
                  spacing={3}
                  columnGap={5}
                  justifyContent={"flex-start"}
                  sx={{ padding: "5px" }}
                >
                  <Grid item>
                    <CustomStyledTypography customColor="#333">
                      {"Box Number"} :
                    </CustomStyledTypography>
                    <CustomStyledTypography customColor="rgb(14 57 115 / 86%)">
                      {state.repairDetails.boxNo}
                    </CustomStyledTypography>
                  </Grid>
                  <Grid item>
                    <CustomStyledTypography customColor="#333">
                      {"Imei Number"} :
                    </CustomStyledTypography>
                    <CustomStyledTypography customColor="rgb(14 57 115 / 86%)">
                      {state?.repairDetails?.imei ?? "NA"}
                    </CustomStyledTypography>
                  </Grid>{" "}
                  <Grid item>
                    <CustomStyledTypography customColor="#333">
                      {"Activation Date"} :
                    </CustomStyledTypography>
                    <CustomStyledTypography customColor="rgb(14 57 115 / 86%)">
                      {moment(new Date()).format("DD-MM-YYYY")}
                    </CustomStyledTypography>
                  </Grid>{" "}
                  <Grid item>
                    <CustomStyledTypography customColor="#333">
                      {"Manufacture Lot Number"} :
                    </CustomStyledTypography>
                    <CustomStyledTypography customColor="rgb(14 57 115 / 86%)">
                      {state?.repairDetails?.mfgLotNo ?? "NA"}
                    </CustomStyledTypography>
                  </Grid>
                  <Grid item>
                    <CustomStyledTypography customColor="#333">
                      {"Warranty Date"} :
                    </CustomStyledTypography>
                    <CustomStyledTypography customColor="rgb(14 57 115 / 86%)">
                      {moment(new Date()).format("DD-MM-YYYY")}
                    </CustomStyledTypography>
                  </Grid>
                  {state?.repairDetails?.status == "REPLACED" && (
                    <Grid item>
                      <CustomStyledTypography customColor="#333">
                        {"Replaced With"} :
                      </CustomStyledTypography>
                      <CustomStyledTypography customColor="rgb(14 57 115 / 86%)">
                        {state?.repairDetails?.replacedByImei ?? "NA"}
                      </CustomStyledTypography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ width: "100%", mb: 2 }} elevation={1}>
                {/* <Box component={Paper} elevation={1}> */}
                <Grid
                  container
                  rowGap={1}
                  style={{ padding: 10, background: "#607d8b17" }}
                >
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
                    <Typography>Image Before testing</Typography>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    container
                    alignItems={"center"}
                    justifyContent={"space-evenly"}
                    sx={{ borderRight: "1px solid grey" }}
                  >
                    <Grid item>
                      <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        sx={{ color: "white" }}
                      >
                        Upload image Close Box
                        <VisuallyHiddenInput
                          type="file"
                          name="closeBoxImageBeforeTesting"
                          onChange={handleFileUpload}
                        />
                      </Button>
                    </Grid>
                    <Grid item>
                      {previewImageObj?.closeBoxImageBeforeTesting && (
                        <>
                          <img
                            src={previewImageObj?.closeBoxImageBeforeTesting}
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
                                previewImageObj?.closeBoxImageBeforeTesting
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

                  <Grid
                    item
                    xs={6}
                    container
                    alignItems={"center"}
                    justifyContent={"space-evenly"}
                  >
                    <Grid item>
                      <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        sx={{ color: "white" }}
                      >
                        Upload image Open Box
                        <VisuallyHiddenInput
                          type="file"
                          name="openBoxImageBeforeTesting"
                          onChange={handleFileUpload}
                        />
                      </Button>
                    </Grid>
                    <Grid item>
                      {previewImageObj?.openBoxImageBeforeTesting && (
                        <>
                          <img
                            src={previewImageObj?.openBoxImageBeforeTesting}
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
                                previewImageObj?.openBoxImageBeforeTesting
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
                {/* </Box> */}
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ width: "100%", mb: 2 }} elevation={1}>
                {/* <Box component={Paper} elevation={1}> */}
                <Grid
                  container
                  rowGap={1}
                  style={{ padding: 10, background: "#607d8b17" }}
                >
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
                    <Typography>Image After testing</Typography>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    container
                    alignItems={"center"}
                    justifyContent={"space-evenly"}
                    sx={{ borderRight: "1px solid grey" }}
                  >
                    <Grid item>
                      <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        sx={{ color: "white" }}
                      >
                        Upload image Open Box
                        <VisuallyHiddenInput
                          type="file"
                          name="openBoxImageAfterTesting"
                          onChange={handleFileUpload}
                        />
                      </Button>
                    </Grid>
                    <Grid item>
                      {previewImageObj?.openBoxImageAfterTesting && (
                        <>
                          <img
                            src={previewImageObj?.openBoxImageAfterTesting}
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
                                previewImageObj?.openBoxImageAfterTesting
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

                  <Grid
                    item
                    xs={6}
                    container
                    alignItems={"center"}
                    justifyContent={"space-evenly"}
                  >
                    <Grid item>
                      <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        sx={{ color: "white" }}
                      >
                        Upload image Close Box
                        <VisuallyHiddenInput
                          type="file"
                          name="closeBoxImageAfterTesting"
                          onChange={handleFileUpload}
                        />
                      </Button>
                    </Grid>
                    <Grid item>
                      {previewImageObj?.closeBoxImageAfterTesting && (
                        <>
                          <img
                            src={previewImageObj?.closeBoxImageAfterTesting}
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
                                previewImageObj?.closeBoxImageAfterTesting
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
                {/* </Box> */}
              </Paper>
            </Grid>
            <Grid item xs={12}>
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
                          Select
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#fff",
                            backgroundColor: "rgb(48 85 135)",
                          }}
                        >
                          Possible Issue
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#fff",
                            backgroundColor: "rgb(48 85 135)",
                          }}
                        >
                          Charges
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {repairDeviceCharges &&
                        Array.isArray(repairDeviceCharges) &&
                        repairDeviceCharges?.map((row, index) => (
                          <>
                            <TableRow key={index}>
                              <TableCell>
                                {" "}
                                <Checkbox
                                  checked={row.isChecked}
                                  onChange={(event) =>
                                    handleChange(event, index, row)
                                  }
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                              </TableCell>
                              <TableCell>{row?.deviceIssue ?? "NA"}</TableCell>

                              <TableCell>{row?.charges ?? "NA"}</TableCell>
                            </TableRow>
                          </>
                        ))}
                      <TableRow
                        key={"Total Amount"}
                        sx={{ background: "#80808042" }}
                      >
                        <TableCell> </TableCell>
                        <TableCell
                          sx={{
                            padding: "15px",
                            fontSize: "20px",
                            color: "#00a2ff",
                          }}
                        >
                          Total Amount
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "15px",
                            fontSize: "20px",
                            color: "#008013",
                            fontWeight: 600,
                          }}
                        >
                          {totalAmount}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
            <Grid
              item
              xs={12}
              container
              justifyContent={"flex-end"}
              spacing={2}
            >
              <Grid item>
                <Button
                  variant="contained"
                  sx={{ color: "white" }}
                  onClick={() => {
                    const path = "/replaceticket";
                    navigate(path, {
                      state: { repairDetails },
                    });
                  }}
                >
                  Replace
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  sx={{ color: "white" }}
                  onClick={() => repairDevice({ isRejected: false })}
                >
                  Repaired
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </ThemeProvider>
      </Box>
    </div>
  );
}

export default RepairTicket;
