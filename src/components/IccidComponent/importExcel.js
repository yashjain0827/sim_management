import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Grid,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { DashboardAction } from "../actions/dashboard";
import readXlsxFile from "read-excel-file";
import chargeSample from "../../addIccidDetails.xlsx";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import moment from "moment";
import config from "../../config/config";
import LoadingComponent from "../CommonComponents/LoadingComponts";
const providers = ["TAISYS", "INTELLIA", "VODAFONE"];
const operators = ["AIRTEL", "BSNL", "VODAFONEIDEA"];
export default function ImportExcel({
  openModal,
  setOpenModal,
  excelImport,
  closeExcelImportModal,

  showData,
  siteListFilter,
  vendorList,
  setSearchValue,
  providerList,
  operatorList,
  loading,
  setLoading,
}) {
  console.log(providerList, operatorList);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("md");
  const [multiVehicles, setMultiVehicles] = React.useState([]);
  const [siteId, setSiteId] = React.useState("");
  const [count, setCount] = React.useState(0);
  const [vaendorId, setVendorId] = React.useState([]);
  const [file, setFile] = React.useState();
  const [show, setShow] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const handleCloseBackdrop = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  function isProvider(name) {
    debugger;
    const arr = providerList.filter((ele) => {
      return ele.name == name;
    });
    if (arr.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  function isOperator(name) {
    debugger;

    const arr = operatorList.filter((ele) => {
      return ele.name == name;
    });
    if (arr.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  console.log(multiVehicles, "multiVehicles");

  const handleCancel = () => {
    setSearchValue(true);

    closeExcelImportModal();
    setShow(false);
    setMultiVehicles([]);
  };
  const handleUpdate = () => {
    // addVehicle(multiVehicles[0], 0);
    addVehicle(multiVehicles);
  };
  var vendor = [];
  const addVehicle = (value, index) => {
    debugger;
    // setShow(true);
    handleOpen();

    // const data = multiVehicles;
    const data = new FormData();
    data.append("file", file);
    data.append("userId", JSON.parse(localStorage.getItem("data")).id);

    const url = `${config.baseUrl}${config.apiName.saveBulkIccid}`;
    fetch(url, {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response !== null) {
          const res = Object.values(response);
          console.log(res);
          const listAfterResponse = [...multiVehicles].map((ele, index) => {
            return { ...ele, status: res[index] };
          });
          // alert(response.message)
          console.log(listAfterResponse);
          setMultiVehicles(listAfterResponse);
          const count =
            response.data &&
            response.data.filter((val) => val.isUpdated == true);
          setCount(count && count.length);
        } else {
          setMultiVehicles([]);
        }
        console.log(data);
        setShow(true);

        handleCloseBackdrop();
      })
      .catch((error) => {
        handleCloseBackdrop();
        setShow(true);

        console.error("Error:", error);
      });

    // DashboardAction.ImportExcel(data).then((response) => {
    //   if (response !== null) {
    //     setShow(true);
    //     // alert(response.message)
    //     setMultiVehicles(response && response.data);
    //     const count =
    //       response.data && response.data.filter((val) => val.isUpdated == true);
    //     setCount(count && count.length);
    //   } else {
    //     setMultiVehicles([]);
    //   }
    //   checkCount();
    // });
  };
  const overRideUpdate = () => {
    const data = multiVehicles;
    DashboardAction.overRideUpdateImport(data).then((response) => {
      if (response !== null) {
        // alert(response.message)
        setMultiVehicles(response && response.data);
        const count =
          response.data && response.data.filter((val) => val.isUpdated == true);
        setCount(count && count.length);
      } else {
        setMultiVehicles([]);
      }
      checkCount();
    });
  };

  const checkCount = () => {
    // const check =multiVehicles &&  multiVehicles.filter((val) => val.isUpdated == true);
    // setCount(check && check.length);
  };

  let vehicleArray = [];
  const onFIleChange = () => {
    handleOpen();
    const input = document.getElementById("inputFile");
    setFile(input.files[0]);
    readXlsxFile(input.files[0]).then((rows) => {
      console.log(rows);
      for (var i = 1; i < rows.length; i++) {
        // console.log(rows[i][0], "dghjk");
        let vehicleObj = {};

        if (rows) {
          console.log(rows, "rows");
          vehicleObj.provider =
            rows[i][0] && isProvider(rows[i][0].toUpperCase())
              ? rows[i][0]
              : "incorrect details";
          vehicleObj.iccid = rows[i][1] && rows[i][1];
          vehicleObj.sim1Operator =
            rows[i][2] && isOperator(rows[i][2].toUpperCase())
              ? rows[i][2]
              : "incorrect details";
          vehicleObj.sim2Operator =
            rows[i][3] && isOperator(rows[i][3].toUpperCase())
              ? rows[i][3]
              : "incorrect details";
          vehicleObj.simActivationDate =
            rows[i][4] && moment(rows[i][4]).format("YYYY-MM-DD");
          vehicleObj.simExpiryDate =
            rows[i][5] && moment(rows[i][5]).format("YYYY-MM-DD");
          vehicleObj.sim1 = rows[i][6] && rows[i][6];
          vehicleObj.sim2 = rows[i][7] && rows[i][7];
          vehicleObj.ccidOperator =
            rows[i][8] && isOperator(rows[i][8].toUpperCase())
              ? rows[i][8]
              : "incorrect details";
        }
        // console.log(vehicleObj, "vehicleObj");
        vehicleArray.push(vehicleObj);
      }
      console.log(vehicleArray, "vehicleArray");

      setMultiVehicles(vehicleArray);
      handleCloseBackdrop();
    });
    // document.getElementById("inputFile").value = "";
  };
  const closePop = () => {
    closeExcelImportModal();
    setShow(false);
    setMultiVehicles([]);
  };

  const handleClose = () => {
    setOpenModal(false);
    setShow(false);
    setMultiVehicles([]);
  };

  return (
    <div>
      {/* <LoadingComponent isLoading={loading} /> */}

      <Dialog
        open={openModal}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={fullWidth}
        maxWidth={maxWidth}
      >
        <DialogTitle id="alert-dialog-title">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span
              className="font14"
              style={{ fontWeight: "bold", marginLeft: "10px" }}
            >
              Import Devices By Excel
            </span>
            <div>
              <a
                className="float-right"
                href={chargeSample}
                download
                style={{ textDecoration: "none", color: "#0db9f2" }}
              >
                Download Devices Excel Template
              </a>
            </div>
          </div>
        </DialogTitle>

        <DialogContent dividers>
          <DialogContentText id="alert-dialog-description">
            <Grid
              // container
              // spacing={3}
              style={{ marginLeft: "10px", marginBottom: "2px" }}
            >
              <Grid>
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={open}
                  onClick={handleCloseBackdrop}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
              </Grid>

              <Grid item xs={4}>
                {!show ? (
                  <>
                    <Typography
                      className="font14 greyfirstheading"
                      gutterBottom
                      variant="subtitle1"
                    >
                      Import Excel
                    </Typography>
                    <Typography variant="body2" gutterBottom className="py-2">
                      <input
                        type="file"
                        id="inputFile"
                        onChange={onFIleChange}
                      />
                    </Typography>{" "}
                  </>
                ) : (
                  ""
                )}
              </Grid>

              <Grid item xs={4}>
                <Typography
                  className="font14 greyfirstheading"
                  gutterBottom
                  variant="subtitle1"
                >
                  {show ? (
                    <div className="mt-4">
                      Vehicle Upload SuccessFully {count}/
                      {multiVehicles && multiVehicles.length}{" "}
                    </div>
                  ) : (
                    ""
                  )}
                </Typography>
              </Grid>
            </Grid>
            <Paper sx={{ width: "100%", mb: 2 }} elevation={1}>
              <TableContainer component={Paper} elevation={1}>
                <Table size="small" aria-label="a dense table">
                  <TableHead style={{ background: "rgb(14 57 115 / 86%)" }}>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      S.No
                    </TableCell>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      ICCID
                    </TableCell>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Provider
                    </TableCell>

                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Sim1Operator
                    </TableCell>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Sim2Operator
                    </TableCell>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Sim ActivationDate
                    </TableCell>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Sim ExpiryDate
                    </TableCell>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Sim1Number
                    </TableCell>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Sim2Number
                    </TableCell>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      ccid Operator
                    </TableCell>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Status
                    </TableCell>
                  </TableHead>
                  {multiVehicles &&
                    multiVehicles.length > 0 &&
                    multiVehicles.map((item, index) => {
                      return (
                        <>
                          <TableRow
                            key={item.id}
                            style={{
                              background:
                                item.status == "added successfully"
                                  ? "#00800061"
                                  : "",
                            }}
                          >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              {item.iccid ? item.iccid : "NA"}
                            </TableCell>
                            <TableCell
                              style={{
                                color:
                                  item.provider == "incorrect details"
                                    ? "red"
                                    : "",
                              }}
                            >
                              {item.provider ? item.provider : "NA"}
                            </TableCell>
                            <TableCell
                              style={{
                                color:
                                  item.sim1Operator == "incorrect details"
                                    ? "red"
                                    : "",
                              }}
                            >
                              {item.sim1Operator ? item.sim1Operator : "NA"}
                            </TableCell>{" "}
                            <TableCell
                              style={{
                                color:
                                  item.sim2Operator == "incorrect details"
                                    ? "red"
                                    : "",
                              }}
                            >
                              {item.sim2Operator ? item.sim2Operator : "NA"}
                            </TableCell>
                            <TableCell>
                              {item?.simActivationDate ?? "NA"}
                            </TableCell>{" "}
                            <TableCell>{item?.simExpiryDate ?? "NA"}</TableCell>{" "}
                            <TableCell>
                              {item.sim1 ? item.sim1 : "NA"}
                            </TableCell>{" "}
                            <TableCell>
                              {item.sim2 ? item.sim2 : "NA"}
                            </TableCell>{" "}
                            <TableCell
                              style={{
                                color:
                                  item.ccidOperator == "incorrect details"
                                    ? "red"
                                    : "",
                              }}
                            >
                              {item.ccidOperator ? item.ccidOperator : "NA"}
                            </TableCell>{" "}
                            <TableCell>{item?.status ?? ""}</TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                </Table>
              </TableContainer>
            </Paper>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Close</Button>
          {show == false ? (
            <Button onClick={addVehicle} autoFocus>
              Submit
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    </div>
  );
}
