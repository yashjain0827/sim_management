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
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { SimManagementAction } from "../actions/simManagement";
import readXlsxFile from "read-excel-file";
import subExpirySample from "../../SubscriptionExpirySample.xlsx";
import moment from "moment";

export default function ImportExcel({
  openModal,
  setOpenModal,
  closeExcelImportModal,
  loading,
  setLoading,
  setNewRequestAdded,
}) {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("md");
  const [subscriptionICCIDExpiry, setSubscriptionICCIDExpiry] = React.useState(
    []
  );
  const [count, setCount] = React.useState(0);
  const [file, setFile] = React.useState();
  const [show, setShow] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState("");
  const [reqCode, setReqCode] = React.useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(true);
  const [isFileUploaded, setIsFileUploaded] = React.useState(false);
  const loggedInUserData = JSON.parse(localStorage.getItem("data"));

  const handleCancel = () => {
    closeExcelImportModal();
    setShow(false);
    setSubscriptionICCIDExpiry([]);
    setResponseMessage("");
    setReqCode("");
    setIsSubmitDisabled(true);
    setIsFileUploaded(false);
  };

  const handleDone = () => {
    closeExcelImportModal();
    setShow(false);
    setResponseMessage("");
    setSubscriptionICCIDExpiry([]);
    setCount(0);
    setIsSubmitDisabled(true);
    setNewRequestAdded((prev) => !prev);
    setIsFileUploaded(false);
  };

  const iccidChangeExpiryDate = () => {
    const data = subscriptionICCIDExpiry.map((item) => ({
      iccidNo: item.iccid,
      date: item.isValidDate
        ? moment(item.expiryDate, "DD/MM/YYYY").format("DD-MM-YYYY")
        : null,
    }));

    const payload = {
      userId: loggedInUserData.id,
      deviceRenewalList: data,
    };

    setLoading(true);

    SimManagementAction.importExcel(payload).then((response) => {
      if (response !== null && response.data) {
        setShow(true);
        setSubscriptionICCIDExpiry(response.data || []);
        setResponseMessage(response.message);
        setReqCode(response.requestCode || "");
        const updatedCount = (response.data || []).filter(
          (val) => val.updated === true
        ).length;
        setCount(updatedCount);
      } else {
        setShow(true);
        setSubscriptionICCIDExpiry([]);
        setResponseMessage(response.message || "Failed to update.");
        setReqCode("");
      }
      setLoading(false);
    });
  };

  const onFileChange = (event) => {
    const inputFile = event.target.files[0];

    if (!inputFile) {
      return;
    }

    if (
      inputFile.type !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setResponseMessage(
        "Invalid File Format. Please upload a valid xlsx file or download the sample file."
      );
      setIsFileUploaded(false);
      return;
    }

    setFile(inputFile);
    setIsFileUploaded(true);

    readXlsxFile(inputFile)
      .then((rows) => {
        console.log(rows);
        const today = moment().startOf("day");

        // Utility function to parse ICCID
        const parseICCID = (rawICCID) => {
          if (typeof rawICCID === "number") {
            return rawICCID.toString().trim();
          } else if (typeof rawICCID === "string") {
            return rawICCID.trim();
          }
          return null;
        };

        // Utility function to format date object to dd/mm/yyyy string
        const formatDate = (date) => {
          if (date instanceof Date && !isNaN(date)) {
            return moment(date).format("DD/MM/YYYY");
          }
          return date;
        };

        // Utility function to parse and validate expiry date in dd/mm/yyyy format
        const parseExpiryDate = (rawDate) => {
          const dateString = formatDate(rawDate);

          if (typeof dateString === "string") {
            const dateParts = dateString.split("/");
            if (dateParts.length === 3) {
              const [day, month, year] = dateParts.map((part) =>
                parseInt(part, 10)
              );
              if (
                !isNaN(day) &&
                !isNaN(month) &&
                !isNaN(year) &&
                day > 0 &&
                day <= 31 &&
                month > 0 &&
                month <= 12 &&
                year > 1000 &&
                year <= 9999
              ) {
                const formattedDate = moment(dateString, "DD/MM/YYYY", true);
                if (formattedDate.isValid()) {
                  return formattedDate.format("DD/MM/YYYY");
                }
              }
            }
          }
          return null;
        };

        // Process rows and validate
        const iccidExpDate = rows.slice(1).map((row) => {
          const [rawICCID, rawDate] = row;

          const iccid = parseICCID(rawICCID);
          let expiryDate = parseExpiryDate(rawDate);
          let isValidDate = !!expiryDate;

          // Validate expiry date is not in the past
          if (isValidDate && moment(expiryDate, "DD/MM/YYYY").isBefore(today)) {
            expiryDate = null;
            isValidDate = false;
          }

          return { iccid, expiryDate, isValidDate, rawDate };
        });

        // Check if all rows are valid
        const isValid = iccidExpDate.every(
          (item) => item.iccid && item.isValidDate
        );

        // Update state based on validation
        setSubscriptionICCIDExpiry(iccidExpDate);
        setIsSubmitDisabled(!isValid);
        setResponseMessage(
          isValid
            ? ""
            : "Invalid Data in Excel sheet. Please Upload a Valid Excel Sheet."
        );
      })
      .catch((error) => {
        // Handle file reading errors
        setResponseMessage("Error reading Excel file. Please try again.");
        console.error("Error reading Excel file:", error);
      });
  };

  const handleClose = () => {
    setOpenModal(false);
    setShow(false);
    setSubscriptionICCIDExpiry([]);
    setResponseMessage("");
    setReqCode("");
    setIsSubmitDisabled(true);
    setIsFileUploaded(false);
  };

  const hasUpdatedProperty = subscriptionICCIDExpiry.some((item) =>
    item.hasOwnProperty("updated")
  );

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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span
              className="font14"
              style={{ fontWeight: "bold", marginLeft: "10px" }}
            >
              Import New Sim Expiry Dates By Excel
            </span>
            <div>
              <a className="float-right" href={subExpirySample} download>
                Download New Sim Expiry Dates Excel Template
              </a>
            </div>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="alert-dialog-description">
            <Grid style={{ marginLeft: "10px", marginBottom: "2px" }}>
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
                        onChange={onFileChange}
                      />
                    </Typography>
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
                    <div
                      className="mt-4"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        Updated: {count}/{subscriptionICCIDExpiry.length}
                      </div>
                      {reqCode !== "" && <div>Request Code: {reqCode}</div>}
                    </div>
                  ) : (
                    ""
                  )}
                </Typography>
              </Grid>
            </Grid>

            {isFileUploaded && (
              <Paper sx={{ width: "100%", mb: 2 }} elevation={1}>
                <TableContainer component={Paper} elevation={1}>
                  <Table size="small" aria-label="a dense table">
                    <TableHead style={{ background: "rgb(14 57 115 / 86%)" }}>
                      <TableRow>
                        <TableCell
                          style={{ color: "#fff", fontWeight: "bold" }}
                        >
                          S.No
                        </TableCell>
                        <TableCell
                          style={{ color: "#fff", fontWeight: "bold" }}
                        >
                          ICCID
                        </TableCell>
                        <TableCell
                          style={{ color: "#fff", fontWeight: "bold" }}
                        >
                          Expiry Date
                        </TableCell>
                        {hasUpdatedProperty && (
                          <TableCell
                            style={{ color: "#fff", fontWeight: "bold" }}
                          >
                            Updated
                          </TableCell>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {subscriptionICCIDExpiry.map((val, ind) => (
                        <TableRow
                          key={ind}
                          style={{
                            backgroundColor:
                              val.hasOwnProperty("updated") &&
                              val?.updated === false
                                ? "rgba(255,0,0,0.2)"
                                : val.hasOwnProperty("iccid") && !val?.iccid
                                ? "rgba(255,0,0,0.2)"
                                : val.hasOwnProperty("iccidNo") && !val?.iccidNo
                                ? "rgba(255,0,0,0.2)"
                                : val.hasOwnProperty("expiryDate") &&
                                  !val?.expiryDate
                                ? "rgba(255,0,0,0.2)"
                                : val.hasOwnProperty("updated") &&
                                  val?.updated === true
                                ? "rgba(0,255,0,0.2)"
                                : "",
                          }}
                        >
                          <TableCell>{ind + 1}</TableCell>
                          <TableCell
                            style={{
                              color:
                                val.hasOwnProperty("updated") &&
                                val.updated === false
                                  ? "red"
                                  : "" ||
                                    (val.hasOwnProperty("iccid") && !val?.iccid)
                                  ? "red"
                                  : val.hasOwnProperty("iccidNo") &&
                                    !val?.iccidNo
                                  ? "red"
                                  : "",
                            }}
                          >
                            {val.iccid || val.iccidNo || "Invalid ICCID"}
                          </TableCell>
                          {/* <TableCell
                            style={{
                              color:
                                val.hasOwnProperty("expiryDate") &&
                                !val?.expiryDate
                                  ? "red"
                                  : val.hasOwnProperty("newExpiryDate") &&
                                    !val?.newExpiryDate
                                  ? "red"
                                  : "",
                            }}
                          >
                            {val.expiryDate ? (
                              moment(val.expiryDate, "DD/MM/YYYY").format(
                                "DD-MM-YYYY"
                              )
                            ) : val.newExpiryDate ? (
                              moment(val.newExpiryDate).format("DD-MM-YYYY")
                            ) : (
                              <span>Invalid Date</span>
                            )}
                          </TableCell> */}
                          <TableCell
                            style={{
                              color:
                                val.hasOwnProperty("expiryDate") &&
                                !val?.expiryDate
                                  ? "red"
                                  : val.hasOwnProperty("newExpiryDate") &&
                                    !val?.newExpiryDate
                                  ? "red"
                                  : "",
                            }}
                          >
                            {val.expiryDate ? (
                              moment(val.expiryDate, "DD/MM/YYYY").format(
                                "DD-MM-YYYY"
                              )
                            ) : val.newExpiryDate ? (
                              moment(val.newExpiryDate).format("DD-MM-YYYY")
                            ) : (
                              <span>
                                Invalid Date
                                {val.rawDate ? ` (${val.rawDate})` : ""}
                              </span>
                            )}
                          </TableCell>

                          {hasUpdatedProperty && (
                            <TableCell>
                              {val.updated === true
                                ? "Updated"
                                : val.updated === false
                                ? "Not Updated"
                                : "NA"}
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}

            {responseMessage && (
              <Typography variant="body2">{responseMessage}</Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {!show ? (
            <>
              <Button onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
              <Button
                onClick={iccidChangeExpiryDate}
                autoFocus
                disabled={isSubmitDisabled || loading}
              >
                Submit
              </Button>
            </>
          ) : (
            <Button onClick={handleDone} autoFocus>
              Done
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
