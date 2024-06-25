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
  const loggedInUserData = JSON.parse(localStorage.getItem("data"));

  const handleCancel = () => {
    closeExcelImportModal();
    setShow(false);
    setSubscriptionICCIDExpiry([]);
    setResponseMessage("");
    setReqCode("");
    setIsSubmitDisabled(true);
  };

  const handleDone = () => {
    closeExcelImportModal();
    setShow(false);
    setResponseMessage("");
    setSubscriptionICCIDExpiry([]);
    setCount(0);
    setIsSubmitDisabled(true);
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

    SimManagementAction.importExcel(payload)
      .then((response) => {
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
      })

      .finally(() => {
        setLoading(false);
      });
  };

  const onFileChange = (event) => {
    const inputFile = event.target.files[0];
    setFile(inputFile);
    readXlsxFile(inputFile).then((rows) => {
      const iccidExpDate = rows.slice(1).map((row) => {
        let rawICCID = row[0];
        let rawDate = row[1];

        let expiryDate;
        let isValidDate = true;

        let iccid = rawICCID ? rawICCID.trim() : "";

        if (moment(rawDate, "DD/MM/YY", true).isValid()) {
          expiryDate = moment(rawDate, "DD/MM/YY").format("DD/MM/YYYY");
        } else if (moment(rawDate, "DD/MM/YYYY", true).isValid()) {
          expiryDate = moment(rawDate, "DD/MM/YYYY").format("DD/MM/YYYY");
        } else if (typeof rawDate === "number") {
          expiryDate = moment(
            new Date(Math.round((rawDate - 25569) * 86400 * 1000))
          ).format("DD/MM/YYYY");
        } else {
          expiryDate = null;
          isValidDate = false;
        }

        return {
          iccid,
          expiryDate,
          isValidDate,
        };
      });

      const isValid = iccidExpDate.every(
        (item) => item.iccid && item.isValidDate
      );

      if (isValid) {
        setSubscriptionICCIDExpiry(iccidExpDate);
        setResponseMessage("");
        setIsSubmitDisabled(false);
      } else {
        setSubscriptionICCIDExpiry([]);
        setResponseMessage(
          "Invalid Data in Excel sheet. Please Upload a Valid Excel Sheet."
        );
        setIsSubmitDisabled(true);
      }
    });
  };

  const handleClose = () => {
    setOpenModal(false);
    setShow(false);
    setSubscriptionICCIDExpiry([]);
    setResponseMessage("");
    setReqCode("");
    setIsSubmitDisabled(true);
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
              Import Devices By Excel
            </span>
            <div>
              <a className="float-right" href={subExpirySample} download>
                Download Devices Excel Template
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
            <Paper sx={{ width: "100%", mb: 2 }} elevation={1}>
              <TableContainer component={Paper} elevation={1}>
                <Table size="small" aria-label="a dense table">
                  <TableHead style={{ background: "rgb(14 57 115 / 86%)" }}>
                    <TableRow>
                      <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                        S.No
                      </TableCell>
                      <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                        ICCID
                      </TableCell>
                      <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
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
                            val.updated === false ? "rgba(255,0,0,0.3)" : "",
                        }}
                      >
                        <TableCell>{ind + 1}</TableCell>
                        <TableCell>{val.iccid || val.iccidNo || ""}</TableCell>
                        <TableCell>
                          {val.expiryDate ? (
                            moment(val.expiryDate, "DD/MM/YYYY").format(
                              "DD-MM-YYYY"
                            )
                          ) : val.newExpiryDate ? (
                            moment(val.newExpiryDate).format("DD-MM-YYYY")
                          ) : (
                            <span>Invalid Date</span>
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
            {responseMessage && (
              <Typography variant="body2">{responseMessage}</Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {!show ? (
            <>
              <Button onClick={handleCancel}>Cancel</Button>
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
