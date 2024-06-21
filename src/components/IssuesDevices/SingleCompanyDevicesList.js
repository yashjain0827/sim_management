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
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import PropTypes from "prop-types";
import Divider from "@mui/material/Divider";
import moment, { locale } from "moment";
import Collapse from "@mui/material/Collapse";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DevicesAction } from "./GetAllDevicesAPI";
import QRCode from "react-qr-code";
import { Bolt } from "@mui/icons-material";
import TopView from "../CommonComponents/topView";
import ExportReport from "../CommonComponents/Export";
import ExportPdf from "../CommonComponents/exportPdf";
import config from "../../config/config";
const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(14 57 115 / 86%)",
    },
  },
});

function createData(index, boxNo, date, quantity) {
  return {
    index,
    boxNo,
    date,
    quantity,
  };
}

function Row(props) {
  const { row, index, dataBox } = props;
  const [open, setOpen] = useState(true);
  return (
    <Fragment>
      <TableRow sx={{ "$ > *": { borderBottom: "unset" } }}>
        <TableCell align="center">{index + 1 || ""}</TableCell>
        <TableCell align="center">{row.boxNo || "NA"}</TableCell>
        <TableCell align="center">
          {row.createdAt
            ? moment
                .utc(row.createdAt)
                .utcOffset("+05:30")
                .format("DD/MM/YYYY hh:mm A")
            : null}{" "}
        </TableCell>
        {/* <TableCell align="center">{row.boxNo || "NA"}</TableCell> */}

        <TableCell align="center">
          {row?.deviceDtoList?.length || "NA"}
          <IconButton
            aria-label="expand row"
            size="small"
            align="center"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: "beige" }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "rgb(14 57 115 / 86%)",
                      opacity: "0.8",
                    }}
                  >
                    {/* <TableCell
                      sx={{ color: "white" }}
                      align="center"
                    ></TableCell> */}
                    <TableCell align="center" sx={{ color: "white" }}>
                      S. No.
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      IMEI No.
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      ICCID No.
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      UUID No.
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      Updated At
                    </TableCell>
                    {/* <TableCell align="center" sx={{ color: "white" }}>
                      created By
                    </TableCell> */}
                    <TableCell align="center" sx={{ color: "white" }}>
                      Status
                    </TableCell>
                    {/* <TableCell align="center" sx={{ color: "white" }}>
                      Software Version
                    </TableCell> */}
                    {/* <TableCell align="center" sx={{ color: "white" }}>
                      Status
                    </TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: "white" }}>
                  {dataBox[index].deviceDtoList.map((device, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">{device.imeiNo}</TableCell>
                      <TableCell align="center">{device.iccidNo}</TableCell>
                      <TableCell align="center">{device.uuidNo}</TableCell>
                      <TableCell align="center">
                        {device.createdAt
                          ? moment
                              .utc(device.createdAt)
                              .utcOffset("+05:30")
                              .format("DD/MM/YYYY hh:mm A")
                          : null}{" "}
                      </TableCell>
                      {/* <TableCell align="center">
                        {device.createdBy || "NA"}
                      </TableCell> */}
                      <TableCell align="center">
                        {device.statusEnum || "NA"}
                      </TableCell>
                      {/* <TableCell align="center">
                        {device.softwareVersion}
                      </TableCell> */}
                      {/* <TableCell align="center">
                        {device.status || "NA"}
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    index: PropTypes.number.isRequired,
    boxNo: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    quantity: PropTypes.string.isRequired,
  }).isRequired,
};

function SingleCompanyDevicesList() {
  const location = useLocation();
  const [clientData, setClientData] = useState("");
  const [allData, setAllData] = useState([]);
  const [convertDataToPrint, setConvertDataToPrint] = useState([]);
  const userDetails = localStorage.getItem("data");
  const user = JSON.parse(userDetails);

  const [basurl, setBasUrl] = useState(config.frontEndUrl);
  const [finalArrayList, setfinalArrayList] = useState([]);
  const [exportDataPdf, setExportDataPdf] = useState([]);
  const [exportDataExcel, setExportDataExcel] = useState([]);
  const exportDataList = (exportArray) => {
    console.log(exportArray, "exportarray");
    let exportDataArray = [];
    exportArray.forEach((item, index) => {
      let objExport = {
        col1: index + 1,
        col2: item.imeiNo ? item.imeiNo : "NA",
        col3: item.iccidNo,
        col4: item.uuidNo,
        col5: item.updatedAt
          ? moment
              .utc(item.updatedAt)
              .utcOffset("+05:30")
              .format("DD/MM/YYYY hh:mm A")
          : null || "NA",
        col6: item.softwareVersion ? item.softwareVersion : "NA",
      };
      exportDataArray.push(objExport);
    });
    setExportDataPdf(exportDataArray);
    let objExport = {};

    tableHeadForExport.forEach((element, index) => {
      objExport[`col${index + 1}`] = element;
    });

    if (exportDataArray.length > 0) {
      exportDataArray = [objExport].concat(exportDataArray);
    }

    setExportDataExcel(exportDataArray);
  };

  const getAllData = async (serialNumber) => {
    if (!serialNumber) return;
    try {
      const allIssuesResponse = await DevicesAction.getAllDevices(serialNumber);
      if (
        allIssuesResponse &&
        allIssuesResponse.status == 200 &&
        allIssuesResponse.data
      )
        setClientData(allIssuesResponse.data);
      setAllData(allIssuesResponse.data.boxs);
      let arr = [];
      allIssuesResponse.data.boxs.forEach((ele) => {
        console.log(ele.deviceDtoList);
        arr.push(...ele.deviceDtoList);
      });
      console.log(arr);
      setfinalArrayList(arr);
    } catch (error) {
      console.error(error);
    }
  };
  let arry = [];
  const excelPdfAllData = allData.map((data) => {
    return data.deviceDtoList;
  });
  const final = arry.concat(excelPdfAllData);

  console.log(excelPdfAllData, "excelPdfAllData");

  useEffect(() => {
    setConvertDataToPrint(...excelPdfAllData);
  }, [allData]);
  console.log("alldevice", convertDataToPrint);

  const exportData = (type, exportType) => {
    if (exportType == "excel") {
      // setExportDataExcel(res.data);
      console.log("alldevice", convertDataToPrint);
      exportDataList(finalArrayList);

      setTimeout(() => {
        document.getElementById("exportDataList").click();
      }, 500);
    } else if (exportType == "pdf") {
      // setExportDataPdf(res.data);
      exportDataList(finalArrayList);

      setTimeout(() => {
        document.getElementById("exportPdfButton").click();
      }, 500);
    }
  };
  const rows =
    clientData.boxs &&
    Array.isArray(clientData.boxs) &&
    clientData.boxs.length > 0 &&
    clientData.boxs.map((box, index) => {
      return createData(
        index,
        box.boxNo,
        box.createdAt
          ? moment
              .utc(box.createdAt)
              .utcOffset("+05:30")
              .format("DD/MM/YYYY hh:mm a")
          : null,
        box.quantity
      );
    });

  console.log("rows", clientData.boxs);
  useEffect(() => {
    if (location && location.state && location.state.id) {
      const serialNumber = location.state.id;
      const issueNumber = location.state.issueNumber;

      getAllData(serialNumber);
    }
  }, [location]);

  // const handleprint = () => {
  //   window.print();
  // }

  const onPdfDownload = (type) => {
    exportData(false, type);
  };

  const onExcelDownload = (type) => {
    exportData(false, type);
  };

  useEffect(() => {
    getAllData();
  }, []);

  let topViewData = {
    pageTitle: " Issues Device Details",

    addText: "Add Company",

    hideAddButton: true,
    addClick: "/deviceStatusUpdate",

    editText: "",
    hideEditButton: true,
    editClick: null,

    cancelText: null,
    hideCancelButton: true,
    cancelClick: null,

    updateText: null,
    hideUpdateButton: true,
    updateClick: null,

    hidePdfExport: false,
    exportPdfClick: "",
    onPdfDownload: onPdfDownload,

    hideExcelExport: false,
    exportExcelClick: "",
    onExcelDownload: onExcelDownload,

    hideExcelImport: true,
    excelImportClick: "",

    filter: true,
    filterHandler: null,

    searchFieldHandler: null,
    searchInput: null,
    searchField: true

  };

  return (
    <div className="main_container">
      <Box className="main">
        <ThemeProvider theme={theme}>
          <TopView topViewData={topViewData}></TopView>
          <Grid container sx={{ marginTop: "0rem" }} rowGap={2}>
            <Grid item xs={12} sm={4} md={4} lg={2} xl={1.5}>
              <div>
                <Typography
                  sx={{
                    color: "rgb(14 57 115 / 86%)",
                    // fontSize: "25px",
                    // padding: "",
                  }}
                >
                  Issue Slip No: {location?.state?.issueNumber || "NA"}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={2} xl={1}>
              <div style={{ display: "none" }}>
                <ExportPdf
                  exportData={exportDataPdf || []}
                  labelHeader={tableHeadForExport || []}
                  title="All Issues Devices"
                  reportName="All Issues Devices"
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={2} xl={1.5}>
              <div style={{ display: "none" }}>
                <ExportReport
                  exportData={exportDataExcel || []}
                  labelHeader={tableHeadForExport || []}
                  exportHeading={["All Issues Devices"]}
                />
              </div>
            </Grid>

            {/* </Grid> */}
            {/* <Grid container sx={{ marginTop: "0rem" }} rowGap={2}>
            <Grid
              item
              xs={12}
              container
              justifyContent={"space-between"}
              flexWrap="nowrap"
              alignItems={"center"}
            >
              <Grid item>
                <Typography
                  sx={{
                    color: "rgb(14 57 115 / 86%)",
                    fontSize: "25px",
                    padding: "",
                  }}
                >
                  Issues Device Details
                  <Divider />
                </Typography>
              </Grid>
              <Grid item sx={{ padding: "10px 20px" }}>
                <Typography
                  sx={{
                    color: "rgb(14 57 115 / 86%)",
                    // fontSize: "25px",
                    padding: "",
                  }}
                >
                  Issue Slip No: {location?.state?.issueNumber || "NA"}
                </Typography>
              </Grid>
            </Grid> */}
            <Grid
              item
              xs={12}
              container
              justifyContent={"space-between"}
              flexWrap="nowrap"
              alignItems={"start"}
            >
              <Grid
                item
                xs={12}
                container
                justifyContent={"flex-start"}
                // alignItems={"center"}
                spacing={1}
                sx={{ paddingTop: "20px" }}
              >
                <Grid
                  item
                  style={{ width: "70%", display: "flex", flexWrap: "wrap" }}
                >
                  <Grid item sx={{ width: "33.33%", display: "inline" }}>
                    <Grid item sx={{ padding: "10px 20px" }}>
                      <TextField
                        id="outlined-basic"
                        label="Company Name"
                        variant="outlined"
                        value={clientData?.clientDTO?.companyName || "NA"}
                        inputProps={{
                          style: { width: "10rem", height: "0.5rem" },
                        }}
                        textAlign="center"
                        disabled
                      />
                    </Grid>
                  </Grid>
                  <Grid item sx={{ width: "33.33%", display: "inline" }}>
                    <Grid item sx={{ padding: "10px 20px" }}>
                      <TextField
                        id="outlined-basic"
                        label="Issue Date"
                        variant="outlined"
                        value={
                          clientData?.issuedDate
                            ? moment
                                .utc(clientData?.issuedDate)
                                .utcOffset("+05:30")
                                .format("DD/MM/YYYY")
                            : null || "NA"
                        }
                        inputProps={{
                          style: { width: "10rem", height: "0.5rem" },
                        }}
                        textAlign="center"
                        disabled
                      />
                    </Grid>
                  </Grid>
                  <Grid item sx={{ width: "33.33%", display: "inline" }}>
                    <Grid item sx={{ padding: "10px 20px" }}>
                      <TextField
                        id="outlined-basic"
                        label="Quantity"
                        variant="outlined"
                        value={clientData?.quantity || "NA"}
                        inputProps={{
                          style: { width: "10rem", height: "0.5rem" },
                        }}
                        textAlign="center"
                        disabled
                      />
                    </Grid>
                  </Grid>
                  <Grid item sx={{ width: "33.33%", display: "inline" }}>
                    <Grid item sx={{ padding: "10px 20px" }}>
                      <TextField
                        id="outlined-basic"
                        label="Contact No."
                        variant="outlined"
                        value={clientData?.clientDTO?.phoneNumber || "NA"}
                        inputProps={{
                          style: { width: "10rem", height: "0.5rem" },
                        }}
                        textAlign="center"
                        disabled
                      />
                    </Grid>
                  </Grid>
                  <Grid item sx={{ width: "33.33%", display: "inline" }}>
                    <Grid item sx={{ padding: "10px 20px" }}>
                      <TextField
                        id="outlined-basic"
                        label="State"
                        variant="outlined"
                        value={clientData?.stateDTO?.name || "NA"}
                        inputProps={{
                          style: { width: "10rem", height: "0.5rem" },
                        }}
                        textAlign="center"
                        disabled
                      />
                    </Grid>
                  </Grid>
                  <Grid item sx={{ width: "33.33%", display: "inline" }}>
                    <Grid item sx={{ padding: "10px 20px" }}>
                      <TextField
                        id="outlined-basic"
                        label="Created By"
                        variant="outlined"
                        value={user?.name || "NA"}
                        inputProps={{
                          style: { width: "10rem", height: "0.5rem" },
                        }}
                        textAlign="center"
                        disabled
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  // justifyContent={"space-between"}

                  flexWrap="nowrap"
                  style={{
                    width: "30%",
                    display: "inline-flex",
                    gap: "10px",
                    alignItems: "start",
                  }}
                >
                  <Grid item style={{ width: "75%" }}>
                    <Typography>
                      {`Address:-${
                        clientData?.clientDTO?.companyAddress || "NA"
                      }`}
                    </Typography>
                    {/* <button onclick={handleprint}>Print</button> */}
                  </Grid>
                  <Grid item style={{ width: "25%", marginRight: "3px" }}>
                    <QRCode
                      delay={10}
                      title="Box Details"
                      value={`BaseUrl:- ${
                        basurl + "SingleCompanyDevicesList/" + location.state.id
                      }`}
                      bgColor={"white"}
                      fgColor={"black"}
                      // size="small"
                      style={{
                        height: "100%",
                        maxWidth: "100%",
                        width: "100%",
                      }}
                      viewBox={`0 0 256 256`}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ width: "100%", mb: 2 }} elevation={1}>
                    <TableContainer>
                      <Table aria-label="collapsible table">
                        <TableHead>
                          <TableRow
                            sx={{
                              backgroundColor: "rgb(14 57 115 / 86%)",
                            }}
                          >
                            <TableCell align="center" sx={{ color: "white" }}>
                              S.No.
                            </TableCell>
                            <TableCell align="center" sx={{ color: "white" }}>
                              Box No.
                            </TableCell>
                            <TableCell align="center" sx={{ color: "white" }}>
                              Date
                            </TableCell>
                            {/* <TableCell align="center" sx={{ color: "white" }}>
                              Status
                            </TableCell> */}
                            <TableCell align="center" sx={{ color: "white" }}>
                              Quantity
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody
                          align="center"
                          sx={{ backgroundColor: "beige" }}
                        >
                          {clientData.boxs &&
                            Array.isArray(clientData.boxs) &&
                            clientData.boxs.length > 0 &&
                            clientData.boxs.map((row, index) => (
                              <Row
                                key={row.id}
                                index={index}
                                row={row}
                                dataBox={clientData.boxs}
                              />
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </ThemeProvider>
      </Box>
    </div>
  );
}

var tableHeadForExport = [
  "S.No.",
  "IMEI No.",
  "ICCID No.",
  "UUID No.",
  "Update By",
  "Software Version",
];

export default SingleCompanyDevicesList;
