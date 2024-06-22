// import * as React from "react";
// import Button from "@mui/material/Button";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";
// import {
//   Grid,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
// } from "@mui/material";
// import { SubscriptionAction } from "../actions/subscription";
// import readXlsxFile from "read-excel-file";
// import subExpirySample from "../../SubscriptionExpirySample.xlsx";
// import moment from "moment";

// export default function ImportExcel({
//   openModal,
//   setOpenModal,
//   excelImport,
//   closeExcelImportModal,
//   setLoading,
//   showData,
//   siteListFilter,
//   vendorList,
// }) {
//   const [fullWidth, setFullWidth] = React.useState(true);
//   const [maxWidth, setMaxWidth] = React.useState("md");
//   const [multiVehicles, setMultiVehicles] = React.useState([]);
//   const [count, setCount] = React.useState(0);
//   const [file, setFile] = React.useState();
//   const [show, setShow] = React.useState(false);

//   console.log(multiVehicles, "multiVehicles");

//   const handleCancel = () => {
//     closeExcelImportModal();
//     setShow(false);
//     setMultiVehicles([]);
//   };

//   const handleUpdate = () => {
//     addVehicle(multiVehicles);
//   };

//   const addVehicle = (data) => {
//     SubscriptionAction.importExcel(data).then((response) => {
//       if (response !== null) {
//         setShow(true);
//         setMultiVehicles(response.data);
//         const updatedCount = response.data.filter(
//           (val) => val.isUpdated
//         ).length;
//         setCount(updatedCount);
//       } else {
//         setMultiVehicles([]);
//       }
//       checkCount();
//     });
//   };

//   const overRideUpdate = () => {
//     DashboardAction.overRideUpdateImport(multiVehicles).then((response) => {
//       if (response !== null) {
//         setMultiVehicles(response.data);
//         const updatedCount = response.data.filter(
//           (val) => val.isUpdated
//         ).length;
//         setCount(updatedCount);
//       } else {
//         setMultiVehicles([]);
//       }
//       checkCount();
//     });
//   };

//   const checkCount = () => {
//     const updatedCount = multiVehicles.filter((val) => val.isUpdated).length;
//     setCount(updatedCount);
//   };

//   const onFileChange = (event) => {
//     const inputFile = event.target.files[0];
//     setFile(inputFile);
//     readXlsxFile(inputFile).then((rows) => {
//       const vehicleArray = rows.slice(1).map((row) => {
//         let rawICCID = row[0];
//         let rawDate = row[1];
//         console.log("Raw Date:", rawDate);

//         let expiryDate;
//         let isValidDate = true;

//         let iccid = rawICCID ? rawICCID.trim() : "";

//         if (moment(rawDate, "DD/MM/YY", true).isValid()) {
//           expiryDate = moment(rawDate, "DD/MM/YY").format("DD/MM/YYYY");
//         } else if (moment(rawDate, "DD/MM/YYYY", true).isValid()) {
//           expiryDate = moment(rawDate, "DD/MM/YYYY").format("DD/MM/YYYY");
//         } else if (typeof rawDate === "number") {
//           expiryDate = moment(
//             new Date(Math.round((rawDate - 25569) * 86400 * 1000))
//           ).format("DD/MM/YYYY");
//         } else {
//           console.error("Invalid Date:", rawDate);
//           expiryDate = "Invalid Date";
//           isValidDate = false;
//         }

//         return {
//           iccid,
//           expiryDate,
//           isValidDate,
//         };
//       });
//       setMultiVehicles(vehicleArray);
//     });
//   };

//   const handleClose = () => {
//     setOpenModal(false);
//     setShow(false);
//     setMultiVehicles([]);
//   };

//   return (
//     <div>
//       <Dialog
//         open={openModal}
//         onClose={handleClose}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//         fullWidth={fullWidth}
//         maxWidth={maxWidth}
//       >
//         <DialogTitle id="alert-dialog-title">
//           <div style={{ display: "flex", justifyContent: "space-between" }}>
//             <span
//               className="font14"
//               style={{ fontWeight: "bold", marginLeft: "10px" }}
//             >
//               Import Devices By Excel
//             </span>
//             <div>
//               <a className="float-right" href={subExpirySample} download>
//                 Download Devices Excel Template
//               </a>
//             </div>
//           </div>
//         </DialogTitle>
//         <DialogContent dividers>
//           <DialogContentText id="alert-dialog-description">
//             <Grid style={{ marginLeft: "10px", marginBottom: "2px" }}>
//               <Grid item xs={4}>
//                 {!show ? (
//                   <>
//                     <Typography
//                       className="font14 greyfirstheading"
//                       gutterBottom
//                       variant="subtitle1"
//                     >
//                       Import Excel
//                     </Typography>
//                     <Typography variant="body2" gutterBottom className="py-2">
//                       <input
//                         type="file"
//                         id="inputFile"
//                         onChange={onFileChange}
//                       />
//                     </Typography>
//                   </>
//                 ) : (
//                   ""
//                 )}
//               </Grid>
//               <Grid item xs={4}>
//                 <Typography
//                   className="font14 greyfirstheading"
//                   gutterBottom
//                   variant="subtitle1"
//                 >
//                   {show ? (
//                     <div className="mt-4">
//                       Vehicle Upload SuccessFully {count}/{multiVehicles.length}
//                     </div>
//                   ) : (
//                     ""
//                   )}
//                 </Typography>
//               </Grid>
//             </Grid>
//             <Paper sx={{ width: "100%", mb: 2 }} elevation={1}>
//               <TableContainer component={Paper} elevation={1}>
//                 <Table size="small" aria-label="a dense table">
//                   <TableHead style={{ background: "rgb(14 57 115 / 86%)" }}>
//                     <TableRow>
//                       <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
//                         S.No
//                       </TableCell>
//                       <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
//                         ICCID
//                       </TableCell>
//                       <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
//                         Expiry Date
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {multiVehicles.map((val, ind) => (
//                       <TableRow key={ind}>
//                         <TableCell>{ind + 1}</TableCell>
//                         <TableCell>{val.iccid || ""}</TableCell>
//                         <TableCell>
//                           {val.isValidDate ? (
//                             moment(val.expiryDate, "DD/MM/YYYY").format(
//                               "DD/MM/YYYY"
//                             )
//                           ) : (
//                             <span style={{ color: "red" }}>Invalid Date</span>
//                           )}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Paper>
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCancel}>Cancel</Button>
//           {!show ? (
//             <Button onClick={() => addVehicle(multiVehicles)} autoFocus>
//               Submit
//             </Button>
//           ) : (
//             <Button onClick={overRideUpdate} autoFocus>
//               Override Update
//             </Button>
//           )}
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }

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
import { SubscriptionAction } from "../actions/subscription";
import readXlsxFile from "read-excel-file";
import subExpirySample from "../../SubscriptionExpirySample.xlsx";
import moment from "moment";

export default function ImportExcel({
  openModal,
  setOpenModal,
  closeExcelImportModal,
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
  const loggedInUserData = JSON.parse(localStorage.getItem("data"));

  const handleCancel = () => {
    closeExcelImportModal();
    setShow(false);
    setSubscriptionICCIDExpiry([]);
  };

  const iccidChangeExpiryDate = () => {
    const data = subscriptionICCIDExpiry.map((item) => ({
      iccid: item.iccid,
      expiryDate: item.expiryDate,
    }));

    const payload = {
      userDetails: loggedInUserData,
      iccidExpiryData: data,
    };

    SubscriptionAction.importExcel(payload).then((response) => {
      if (response !== null) {
        setShow(true);
        setSubscriptionICCIDExpiry(response.data || []);
        setResponseMessage(response.message);
        const updatedCount = (response.data || []).filter(
          (val) => val.isUpdated
        ).length;
        setCount(updatedCount);
      } else {
        setSubscriptionICCIDExpiry([]);
        setResponseMessage("Failed to update.");
      }
    });
  };

  const onFileChange = (event) => {
    const inputFile = event.target.files[0];
    setFile(inputFile);
    readXlsxFile(inputFile).then((rows) => {
      const vehicleArray = rows.slice(1).map((row) => {
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
          expiryDate = "Invalid Date";
          isValidDate = false;
        }

        return {
          iccid,
          expiryDate,
          isValidDate,
        };
      });
      setSubscriptionICCIDExpiry(vehicleArray);
    });
  };

  const handleClose = () => {
    setOpenModal(false);
    setShow(false);
    setSubscriptionICCIDExpiry([]);
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
                    <div className="mt-4">
                      Vehicle Upload SuccessFully {count}/
                      {subscriptionICCIDExpiry.length}
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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subscriptionICCIDExpiry.map((val, ind) => (
                      <TableRow key={ind}>
                        <TableCell>{ind + 1}</TableCell>
                        <TableCell>{val.iccid || ""}</TableCell>
                        <TableCell>
                          {val.isValidDate ? (
                            moment(val.expiryDate, "DD/MM/YYYY").format(
                              "DD/MM/YYYY"
                            )
                          ) : (
                            <span style={{ color: "red" }}>Invalid Date</span>
                          )}
                        </TableCell>
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
          <Button onClick={handleCancel}>Cancel</Button>
          {!show ? (
            <Button onClick={iccidChangeExpiryDate} autoFocus>
              Submit
            </Button>
          ) : (
            <Button
              // onClick={overRideUpdate}
              autoFocus
            >
              Override Update
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
