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
  const [responseCode, setResponseCode] = React.useState("");
  const [reqCode, setReqCode] = React.useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(true);
  const [isFileUploaded, setIsFileUploaded] = React.useState(false);
  const [validDateFormat, setValidDateFormat] = React.useState(
    moment(new Date("05/08/2024")).format("DD/MM/YYYY")
  );

  const loggedInUserData = JSON.parse(localStorage.getItem("data"));

  const handleCancel = () => {
    closeExcelImportModal();
    setShow(false);
    setSubscriptionICCIDExpiry([]);
    setResponseMessage("");
    setResponseCode("");
    setReqCode("");
    setIsSubmitDisabled(true);
    setIsFileUploaded(false);
  };

  const handleDone = () => {
    closeExcelImportModal();
    setShow(false);
    setResponseMessage("");
    setResponseCode("");
    setSubscriptionICCIDExpiry([]);
    setCount(0);
    setIsSubmitDisabled(true);
    setNewRequestAdded((prev) => !prev);
    setIsFileUploaded(false);
  };

  function convertDateFormat(dateStr) {
    const dateParts = dateStr.split("/");
    const formattedDate = dateParts.join("-");

    return formattedDate;
  }

  const iccidChangeExpiryDate = () => {
    const data = subscriptionICCIDExpiry.map((item) => ({
      iccidNo: item.iccid,
      date: item.isValidDate ? convertDateFormat(item.expiryDate) : null,
    }));

    const payload = {
      userId: loggedInUserData.id,
      deviceRenewalList: data,
    };

    setLoading(true);

    SimManagementAction.importExcel(payload).then((response) => {
      if (response !== null && response.data) {
        // console.log(response);
        setShow(true);
        setSubscriptionICCIDExpiry(response.data || []);
        setResponseMessage(response.message);
        setResponseCode(response.status);
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

  // const getDateFormatPattern = (dateStr) => {
  //   if (typeof dateStr !== "string") {
  //     return "";
  //   }

  //   const dayPattern = /(?:^|\D)(\d{2})(?:\D|$)/;
  //   const monthPattern = /(?:^|\D)(\d{2})(?:\D|$)/;
  //   const yearPattern = /(?:^|\D)(\d{4})(?:\D|$)/;

  //   const dayMatch = dateStr.match(dayPattern);
  //   const monthMatch = dateStr.match(monthPattern);
  //   const yearMatch = dateStr.match(yearPattern);

  //   let pattern = "";

  //   if (dayMatch && monthMatch && yearMatch) {
  //     const dayIndex = dateStr.indexOf(dayMatch[1]);
  //     const monthIndex = dateStr.indexOf(monthMatch[1]);
  //     const yearIndex = dateStr.indexOf(yearMatch[1]);

  //     const indexes = [
  //       { type: "DD", index: dayIndex },
  //       { type: "MM", index: monthIndex },
  //       { type: "YYYY", index: yearIndex },
  //     ];

  //     indexes.sort((a, b) => a.index - b.index);

  //     pattern = indexes.map((item) => item.type).join("-");
  //   }

  //   return pattern;
  // };

  // const isSameDateFormat = (date1, date2) => {
  //   const format1 = getDateFormatPattern(date1);
  //   const format2 = getDateFormatPattern(date2);
  //   if (format1 === format2) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  const validateDateFormat = (dateString) => {
    // console.log("dateString :", dateString);
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    console.log("Test Result:", regex.test(dateString));

    return regex.test(dateString);
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
    readXlsxFile(inputFile).then((rows) => {
      const today = moment().startOf("day");
      const iccidExpDate = rows.slice(1).map((row) => {
        console.log("iccidExpDate: ", row);
        let rawICCID = row[0];
        let rawDate = row[1];
        // let rawDate = moment(new Date(row[1])).format("DD/MM/YYYY");

        console.log("raw date", rawDate);

        let expiryDate;
        let isValidDate = true;
        let validationMessage = "";

        let iccid;

        if (typeof rawICCID === "number") {
          iccid = rawICCID?.toString()?.trim();
        } else if (typeof rawICCID === "string") {
          iccid = rawICCID?.trim();
        }

        // debugger;

        if (validateDateFormat(rawDate) === true) {
          isValidDate = true;
          expiryDate = rawDate;
          // expiryDate = moment(rawDate).format("DD/MM/YYYY");
        } else {
          isValidDate = false;
          validationMessage = "Invalid Date";
          expiryDate = rawDate;
        }

        // debugger;
        if (isValidDate && moment(expiryDate, "DD/MM/YYYY").isBefore(today)) {
          expiryDate = expiryDate;
          isValidDate = false;
          validationMessage = "Date Before Today";
        }

        // console.log(iccid, expiryDate, isValidDate, validationMessage);
        return {
          iccid,
          expiryDate,
          isValidDate,
          validationMessage,
        };
      });

      const isValid = iccidExpDate.every(
        (item) => item.iccid && item.isValidDate
      );

      if (isValid) {
        setSubscriptionICCIDExpiry(iccidExpDate);
        setIsSubmitDisabled(false);
        setResponseMessage("");
        setResponseCode("");
      } else {
        setSubscriptionICCIDExpiry(iccidExpDate);
        setIsSubmitDisabled(true);
        setResponseCode("");
        setResponseMessage(
          "Invalid Data in Excel sheet. Please Upload a Valid Excel Sheet."
        );
      }
    });
  };

  const handleClose = () => {
    setOpenModal(false);
    setShow(false);
    setSubscriptionICCIDExpiry([]);
    setResponseMessage("");
    setResponseCode("");
    setReqCode("");
    setIsSubmitDisabled(true);
    setIsFileUploaded(false);
  };

  const hasUpdatedProperty = subscriptionICCIDExpiry.some((item) =>
    item.hasOwnProperty("updated")
  );

  // console.log(subscriptionICCIDExpiry);

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

              <Grid item xs={12}>
                {responseMessage && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: Number(responseCode) === 200 ? "green" : "red",
                      fontSize: "1.1rem",
                      textAlign: "end",
                    }}
                  >
                    {responseMessage}
                  </Typography>
                )}
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
                                  val?.validationMessage
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
                          <TableCell
                            style={{
                              color:
                                val.hasOwnProperty("expiryDate") &&
                                val?.validationMessage
                                  ? "red"
                                  : val.hasOwnProperty("newExpiryDate") &&
                                    !val?.newExpiryDate
                                  ? "red"
                                  : "",
                            }}
                          >
                            {val.isValidDate && val.expiryDate ? (
                              <>{val.expiryDate}</>
                            ) : val.validationMessage ? (
                              <>
                                {val.expiryDate}
                                <span> ({val.validationMessage})</span>
                              </>
                            ) : val.newExpiryDate ? (
                              <>
                                {moment(val.newExpiryDate).format("DD/MM/YYYY")}
                              </>
                            ) : (
                              "NA"
                            )}

                            {/* {val.expiryDate ? (
                              <>
                                {moment(val.expiryDate, "DD/MM/YYYY").format(
                                  "DD-MM-YYYY"
                                )}
                                {val.validationMessage && (
                                  <span> ({val.validationMessage})</span>
                                )}
                              </>
                            ) : val.newExpiryDate ? (
                              moment(val.newExpiryDate).format("DD-MM-YYYY")
                            ) : (
                              <span>{val.validationMessage}</span>
                            )} */}

                            {/* {val.expiryDate ? (
                              moment(
                                new Date(val.expiryDate).format("DD/MM/YYYY")
                              ).isValid() ? (
                                <>
                                  {moment(new Date(val.expiryDate)).format(
                                    "DD/MM/YYYY"
                                  )}
                                  {val.validationMessage && (
                                    <span> ({val.validationMessage})</span>
                                  )}
                                </>
                              ) : (
                                <>
                                  {new Date(val.expiryDate).format(
                                    "DD/MM/YYYY"
                                  )}
                                  {val.validationMessage && (
                                    <span> ({val.validationMessage})</span>
                                  )}
                                </>
                              )
                            ) : val.newExpiryDate ? (
                              moment(new Date(val.newExpiryDate)).format(
                                "DD/MM/YYYY"
                              )
                            ) : (
                              <span>{val.validationMessage}</span>
                            )} */}
                          </TableCell>

                          {hasUpdatedProperty && (
                            <TableCell>
                              {val.updated === true
                                ? "Updated"
                                : val.updated === false
                                ? "Not Updated (ICCID Not Found)"
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

            {/* {responseMessage && (
              <Typography
                variant="body2"
                sx={{
                  color: Number(responseCode) === 200 ? "green" : "red",
                  fontSize: "1.1rem",
                }}
              >
                {responseMessage}
              </Typography>
            )} */}
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
