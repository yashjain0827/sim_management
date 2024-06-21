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
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
// } from "@mui/material";
// import { DashboardAction } from "../actions/dashboard";
// import readXlsxFile from "read-excel-file";
// import subExpirySample from "../../SubscriptionExpirySample.xlsx";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import CancelIcon from "@mui/icons-material/Cancel";
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
//   const [siteId, setSiteId] = React.useState("");
//   const [count, setCount] = React.useState(0);
//   const [vaendorId, setVendorId] = React.useState([]);
//   const [file, setFile] = React.useState();
//   const [show, setShow] = React.useState(false);

//   console.log(multiVehicles, "multiVehicles");

//   const handleCancel = () => {
//     closeExcelImportModal();
//     setShow(false);
//     setMultiVehicles([]);
//   };
//   const handleUpdate = () => {
//     // addVehicle(multiVehicles[0], 0);
//     addVehicle(multiVehicles);
//   };
//   var vendor = [];
//   const addVehicle = (value, index) => {
//     const data = multiVehicles;
//     DashboardAction.ImportExcel(data).then((response) => {
//       if (response !== null) {
//         setShow(true);
//         // alert(response.message)
//         setMultiVehicles(response && response.data);
//         const count =
//           response.data && response.data.filter((val) => val.isUpdated == true);
//         setCount(count && count.length);
//       } else {
//         setMultiVehicles([]);
//       }
//       checkCount();
//     });
//   };
//   const overRideUpdate = () => {
//     const data = multiVehicles;
//     DashboardAction.overRideUpdateImport(data).then((response) => {
//       if (response !== null) {
//         // alert(response.message)
//         setMultiVehicles(response && response.data);
//         const count =
//           response.data && response.data.filter((val) => val.isUpdated == true);
//         setCount(count && count.length);
//       } else {
//         setMultiVehicles([]);
//       }
//       checkCount();
//     });
//   };

//   const checkCount = () => {
//     // const check =multiVehicles &&  multiVehicles.filter((val) => val.isUpdated == true);
//     // setCount(check && check.length);
//   };

//   let vehicleArray = [];
//   const onFIleChange = () => {
//     const input = document.getElementById("inputFile");
//     setFile(input.files[0]);
//     readXlsxFile(input.files[0]).then((rows) => {
//       for (var i = 1; i < rows.length; i++) {
//         // console.log(rows[i][0], "dghjk");
//         let vehicleObj = {
//           iccid: "",
//           expiryDate: "",
//           // success: "yes",
//         };

//         if (rows) {
//           console.log(rows, "rows");
//           vehicleObj.iccid = rows[i][0];
//           vehicleObj.expiryDate = moment(rows[i][1]).format("DD-MM-YYYY");
//         }
//         // console.log(vehicleObj, "vehicleObj");
//         vehicleArray.push(vehicleObj);
//       }
//       console.log(vehicleArray, "vehicleArray");

//       setMultiVehicles(vehicleArray);
//     });
//     // document.getElementById("inputFile").value = "";
//   };
//   const closePop = () => {
//     closeExcelImportModal();
//     setShow(false);
//     setMultiVehicles([]);
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
//             <Grid
//               // container
//               // spacing={3}
//               style={{ marginLeft: "10px", marginBottom: "2px" }}
//             >
//               <Grid>
//                 {/* <div>
//                   <a className="float-right" href={chargeSample} download>
//                     Download Devices Excel Template
//                   </a>
//                 </div> */}
//               </Grid>

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
//                         onChange={onFIleChange}
//                       />
//                     </Typography>{" "}
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
//                       Vehicle Upload SuccessFully {count}/
//                       {multiVehicles && multiVehicles.length}{" "}
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
//                     <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
//                       S.No
//                     </TableCell>
//                     <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
//                       ICCID
//                     </TableCell>
//                     <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
//                       ExpiryDate
//                     </TableCell>
//                   </TableHead>
//                   {multiVehicles &&
//                     multiVehicles.length > 0 &&
//                     multiVehicles.map((val, ind) => {
//                       return (
//                         <>
//                           <TableRow>
//                             <TableCell>{ind + 1}</TableCell>
//                             <TableCell>{val.iccid ? val.iccid : ""}</TableCell>

//                             <TableCell>
//                               {val.expiryDate
//                                 ? moment(val.expiryDate).format("DD-MM-YYYY")
//                                 : "NA"}
//                             </TableCell>
//                           </TableRow>
//                         </>
//                       );
//                     })}
//                 </Table>
//               </TableContainer>
//             </Paper>
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCancel}>Cancel</Button>
//           {show == false ? (
//             <Button onClick={addVehicle} autoFocus>
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
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { DashboardAction } from "../actions/dashboard";
import readXlsxFile from "read-excel-file";
import subExpirySample from "../../SubscriptionExpirySample.xlsx";
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
    addVehicle(multiVehicles);
  };

  const addVehicle = (data) => {
    DashboardAction.ImportExcel(data).then((response) => {
      if (response !== null) {
        setShow(true);
        setMultiVehicles(response.data);
        const updatedCount = response.data.filter(
          (val) => val.isUpdated
        ).length;
        setCount(updatedCount);
      } else {
        setMultiVehicles([]);
      }
      checkCount();
    });
  };

  const overRideUpdate = () => {
    DashboardAction.overRideUpdateImport(multiVehicles).then((response) => {
      if (response !== null) {
        setMultiVehicles(response.data);
        const updatedCount = response.data.filter(
          (val) => val.isUpdated
        ).length;
        setCount(updatedCount);
      } else {
        setMultiVehicles([]);
      }
      checkCount();
    });
  };

  const checkCount = () => {
    const updatedCount = multiVehicles.filter((val) => val.isUpdated).length;
    setCount(updatedCount);
  };

  const onFileChange = (event) => {
    const inputFile = event.target.files[0];
    setFile(inputFile);
    readXlsxFile(inputFile).then((rows) => {
      const vehicleArray = rows.slice(1).map((row) => ({
        iccid: row[0],
        expiryDate: moment(row[1]).format("DD-MM-YYYY"),
      }));
      setMultiVehicles(vehicleArray);
    });
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
                      Vehicle Upload SuccessFully {count}/{multiVehicles.length}
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
                      Expiry Date
                    </TableCell>
                  </TableHead>
                  {multiVehicles.map((val, ind) => (
                    <TableRow key={ind}>
                      <TableCell>{ind + 1}</TableCell>
                      <TableCell>{val.iccid || ""}</TableCell>
                      <TableCell>
                        {val.expiryDate
                          ? moment(val.expiryDate).format("DD-MM-YYYY")
                          : "NA"}
                      </TableCell>
                    </TableRow>
                  ))}
                </Table>
              </TableContainer>
            </Paper>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          {!show ? (
            <Button onClick={() => addVehicle(multiVehicles)} autoFocus>
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
