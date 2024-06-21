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

function ReplaceTicket(data) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { repairDetails } = state;
  console.log(state);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [beforRepairImageCloseBox, setBeforRepairImageCloseBox] = useState([]);
  const [beforRepairImageOpenBox, setBeforRepairImageOpenBox] = useState([]);

  const [afterRepairImageOpenBox, setAfterRepairImageOpenBox] = useState([]);
  const [afterRepairImageCloseBox, setAfterRepairImageCloseBox] = useState([]);
  const [previewImageObj, setPreviewImageObj] = useState({});
  const [modalImage, setModalImage] = useState("");
  const [openImageModal, setOpenImageModal] = useState(false);
  const [packedDeviceList, setPackedDeviceList] = useState([]);
  const [chargesId, setChargesId] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  //   function handleChange(event, index) {
  //     debugger;
  //     setRepairDeviceCharges((pre) => {
  //       if (event.target.checked) {
  //         setTotalAmount((preAmount) => preAmount + pre[index].charges);
  //       } else {
  //         setTotalAmount((preAmount) => preAmount - pre[index].charges);
  //       }
  //       return pre.map((ele, i, arr) => {
  //         if (index == i) {
  //           setChargesId((pre) => {
  //             console.log([...pre, ele.id]);
  //             return [...pre, ele.id];
  //           });
  //         }
  //         return index == i ? { ...ele, isChecked: !ele.isChecked } : { ...ele };
  //       });
  //     });
  //   }
  let topViewData = {
    pageTitle: "Replace Ticket",

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
  const handleChangePage = (event, newPage) => {
    //console.log(newPage);
    setPageNo(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    //console.log(event.target.value)
    setPageSize(parseInt(event.target.value));
    setPageNo(0);
  };

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
            return {
              ...pre,
              [event.target.name]: response?.data?.data?.fileUrls[0],
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

  async function getAllPackedDevice() {
    let data = {
      pageNo: pageNo,
      pageSize: pageSize,
      search: "",
      statusMaster: "DEVICE_PACKED",
    };
    const response = await MaintenanceAction.getAllPackedDevice(data);
    console.log(response);
    setPackedDeviceList(response.data);
    setTotalCount(response.totalElements);
  }
  useEffect(() => {
    getAllPackedDevice();
  }, [pageNo, pageSize]);

  async function replaceDevice(row) {
    setIsLoading(true);
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
      isRejected: true,
      replacedByDeviceId: row.id,
      //   openBoxImageAfterTesting:
      //     openBoxImageAfterTesting || previewImageObj.openBoxImageAfterTesting,
      //   closeBoxImageAfterTesting:
      //     closeBoxImageAfterTesting || previewImageObj.closeBoxImageAfterTesting,
      chargesId: [],
      userName: JSON.parse(localStorage.getItem("data")).name,
      userId: JSON.parse(localStorage.getItem("data")).id,
    };
    const response = await MaintenanceAction.repairDevice(data);
    console.log(response);
    if (response.responseCode == 200) {
      console.log(response);
      alert("Device Replaced!");
      navigate(`/addDeviceToMaintenance/${repairRequestId}`);
    } else {
      alert(response.message);
      navigate(`/addDeviceToMaintenance/${repairRequestId}`);
    }
    setIsLoading(false);
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
                      {state.repairDetails.imei}
                    </CustomStyledTypography>
                  </Grid>{" "}
                  <Grid item>
                    <CustomStyledTypography customColor="#333">
                      {"Activation Date"} :
                    </CustomStyledTypography>
                    <CustomStyledTypography customColor="rgb(14 57 115 / 86%)">
                      {state.repairDetails.warrantyDate
                        ? moment(state.repairDetails.warrantyDate).format(
                            "DD-MM-YYYY"
                          )
                        : "NA"}
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
                      {state.repairDetails.warrantyDate
                        ? moment(state.repairDetails.warrantyDate).format(
                            "DD-MM-YYYY"
                          )
                        : "NA"}
                    </CustomStyledTypography>
                  </Grid>
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
                          S.no
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#fff",
                            backgroundColor: "rgb(48 85 135)",
                          }}
                        >
                          Imei No.
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#fff",
                            backgroundColor: "rgb(48 85 135)",
                          }}
                        >
                          Software Version.
                        </TableCell>{" "}
                        <TableCell
                          sx={{
                            color: "#fff",
                            backgroundColor: "rgb(48 85 135)",
                          }}
                        >
                          Sim1 No.
                        </TableCell>{" "}
                        <TableCell
                          sx={{
                            color: "#fff",
                            backgroundColor: "rgb(48 85 135)",
                          }}
                        >
                          Sim1 Operator
                        </TableCell>{" "}
                        <TableCell
                          sx={{
                            color: "#fff",
                            backgroundColor: "rgb(48 85 135)",
                          }}
                        >
                          Sim2 No.
                        </TableCell>{" "}
                        <TableCell
                          sx={{
                            color: "#fff",
                            backgroundColor: "rgb(48 85 135)",
                          }}
                        >
                          Sim2 Operator
                        </TableCell>{" "}
                        <TableCell
                          sx={{
                            color: "#fff",
                            backgroundColor: "rgb(48 85 135)",
                          }}
                        >
                          Sim Provider
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#fff",
                            backgroundColor: "rgb(48 85 135)",
                          }}
                        >
                          Manufacture Lot ID
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#fff",
                            backgroundColor: "rgb(48 85 135)",
                          }}
                        >
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {packedDeviceList &&
                        Array.isArray(packedDeviceList) &&
                        packedDeviceList?.map((row, index) => (
                          <>
                            <TableRow key={index}>
                              {/* <TableCell>
                                {" "}
                                <Checkbox
                                  checked={row.isChecked}
                                  onChange={(event) =>
                                    handleChange(event, index)
                                  }
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                              </TableCell> */}
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{row?.imeiNo ?? "NA"}</TableCell>
                              <TableCell>
                                {row?.softwareVersion ?? "NA"}
                              </TableCell>
                              <TableCell>{row?.sim1Number ?? "NA"}</TableCell>
                              <TableCell>{row?.sim1Operator ?? "NA"}</TableCell>
                              <TableCell>{row?.sim2Number ?? "NA"}</TableCell>
                              <TableCell>{row?.sim2Operator ?? "NA"}</TableCell>
                              <TableCell>{row?.sim1Provider ?? "NA"}</TableCell>
                              <TableCell>{row?.mfgLotId ?? "NA"}</TableCell>
                              <TableCell>
                                <Button
                                  variant="contained"
                                  color="success"
                                  onClick={() => replaceDevice(row)}
                                >
                                  {"Replace"}
                                </Button>
                              </TableCell>
                            </TableRow>
                          </>
                        ))}
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
            {/* <Grid
              item
              xs={12}
              container
              justifyContent={"flex-end"}
              spacing={2}
            >
              <Grid item>
                <Button variant="contained" sx={{ color: "white" }}>
                  Replace
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  sx={{ color: "white" }}
                  onClick={repairDevice}
                >
                  Repaired
                </Button>
              </Grid>
            </Grid> */}
          </Grid>
        </ThemeProvider>
      </Box>
    </div>
  );
}

export default ReplaceTicket;
