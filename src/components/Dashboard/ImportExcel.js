import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
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
import chargeSample from "../../AddDivices.xlsx";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import moment from "moment";

export default function ImportExcel({
  openModal,
  setOpenModal,
  excelImport,
  closeExcelImportModal,
  setLoading,
  showData,
  siteListFilter,
  vendorList,
}) {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("md");
  const [multiVehicles, setMultiVehicles] = React.useState([]);
  const [siteId, setSiteId] = React.useState("");
  const [count, setCount] = React.useState(0);
  const [vaendorId, setVendorId] = React.useState([]);
  const [file, setFile] = React.useState();
  const [show, setShow] = React.useState(false);

  console.log(multiVehicles, "multiVehicles");

  const handleCancel = () => {
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
    const data = multiVehicles;
    DashboardAction.ImportExcel(data).then((response) => {
      if (response !== null) {
        setShow(true);
        // alert(response.message)
        setMultiVehicles(response && response.data);
        const count =
          response.data && response.data.filter((val) => val.isUpdated == true);
        setCount(count && count.length);
      } else {
     setMultiVehicles([])
      }
      checkCount();
    });
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
    const input = document.getElementById("inputFile");
    setFile(input.files[0]);
    readXlsxFile(input.files[0]).then((rows) => {
      for (var i = 1; i < rows.length; i++) {
        // console.log(rows[i][0], "dghjk");
        let vehicleObj = {
          imeiNumber: "",
          sim1Number: "",
          sim2Number: "",
          sim1Operator: "",
          sim2Operator: "",
          sim1ActivationDate: "",
          sim1ExpiryDate: "",
          sim2ActivationDate: "",
          sim2ExpiryDate: "",
          // success: "yes",
        };

        if (rows) {
          // console.log(rows, "rows");
          vehicleObj.imeiNumber = rows[i][0];
          vehicleObj.sim1Number = rows[i][1];
          vehicleObj.sim2Number = rows[i][2];
          vehicleObj.sim1Operator = rows[i][3];
          vehicleObj.sim2Operator = rows[i][4];
          vehicleObj.sim1ActivationDate = moment(rows[i][5]).format(
            "YYYY-MM-DD"
          );
          vehicleObj.sim1ExpiryDate = moment(rows[i][6]).format("YYYY-MM-DD");
          vehicleObj.sim2ActivationDate = moment(rows[i][7]).format(
            "YYYY-MM-DD"
          );
          vehicleObj.sim2ExpiryDate = moment(rows[i][8]).format("YYYY-MM-DD");
        }
        // console.log(vehicleObj, "vehicleObj");
        vehicleArray.push(vehicleObj);
      }
      console.log(vehicleArray, "vehicleArray");

      setMultiVehicles(vehicleArray);
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
      <Dialog
        open={openModal}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={fullWidth}
        maxWidth={maxWidth}
      >
        <DialogTitle id="alert-dialog-title">
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span
              className="font14"
              style={{ fontWeight: "bold", marginLeft: "10px" }}
            >
              Import Devices By Excel
            </span>
            <div>
                  <a className="float-right" href={chargeSample} download>
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
                {/* <div>
                  <a className="float-right" href={chargeSample} download>
                    Download Devices Excel Template
                  </a>
                </div> */}
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
                      ImeiNumber
                    </TableCell>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Sim1Number
                    </TableCell>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Sim1Operator
                    </TableCell>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Sim1ActivationDate
                    </TableCell>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Sim1ExpiryDate
                    </TableCell>

                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Sim2Number
                    </TableCell>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Sim2Operator
                    </TableCell>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Sim2ActivationDate
                    </TableCell>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Sim2ExpiryDate
                    </TableCell>

                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Action
                    </TableCell>
                    <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                      Reason
                    </TableCell>
                  </TableHead>
                  {multiVehicles &&
                    multiVehicles.length > 0 &&
                    multiVehicles.map((val, ind) => {
                      return (
                        <>
                          <TableRow>
                            <TableCell>{ind + 1}</TableCell>
                            <TableCell>
                              {val.imeiNumber ? val.imeiNumber : ""}
                            </TableCell>
                            <TableCell>
                              {val.sim1Number ? val.sim1Number : "NA"}
                            </TableCell>
                            <TableCell>
                              {val.sim1Operator ? val.sim1Operator : "NA"}
                            </TableCell>
                            <TableCell>
                              {val.sim1ActivationDate
                                ? moment(val.sim1ActivationDate).format(
                                    "YYYY-MM-DD"
                                  )
                                : "NA"}
                            </TableCell>
                            <TableCell>
                              {val.sim1ExpiryDate
                                ? moment(val.sim2ExpiryDate).format(
                                    "YYYY-MM-DD"
                                  )
                                : "NA"}
                            </TableCell>



                            <TableCell>
                              {val.sim2Number ? val.sim2Number : "NA"}
                            </TableCell>
                           

                            <TableCell>
                              {val.sim1Operator ? val.sim2Operator : "NA"}
                            </TableCell>
                            
                            <TableCell>
                              {val.sim2ExpiryDate
                                ? moment(val.sim2ExpiryDate).format(
                                    "YYYY-MM-DD"
                                  )
                                : "NA"}
                            </TableCell>
                            <TableCell>
                              {val.sim2ActivationDate
                                ? moment(val.sim2ActivationDate).format(
                                    "YYYY-MM-DD"
                                  )
                                : "NA"}
                            </TableCell>
                            

                            <TableCell>
                              {val.isUpdated === true ? (
                                <CheckCircleIcon style={{ color: "green" }} />
                              ) : val.isUpdated === false ? (
                                <CancelIcon style={{ color: "red" }} />
                              ) : (
                                ""
                              )}
                            </TableCell>
                            <TableCell style={{ width: "70px" }}>
                              {val.response ? val.response : "NA"}
                            </TableCell>
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
          <Button onClick={handleCancel}>Cancel</Button>
          {show == false ? (
            <Button onClick={addVehicle} autoFocus>
              Submit
            </Button>
          ) : (
            <Button onClick={overRideUpdate} autoFocus>
              Override Update
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
