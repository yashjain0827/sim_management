import React, { useState, useEffect, useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { BoxPackaging } from "../actions/boxPackaging";
import { Box, Grid, TextField, Typography } from "@mui/material";
import TopView from "../CommonComponents/topView";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import ExportReport from "../CommonComponents/Export";
import ExportPdf from "../CommonComponents/exportPdf";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableContainer,
  TableRow,
  styled,
  TableHead,
  TableBody,
  boxList,
  Button,
} from "@mui/material";
import moment from "moment";
import { debounce } from "lodash";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgb(14 57 115 / 86%)",
    color: theme.palette.common.white,
    padding: "10px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "10px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
function BoxDevices(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deviceList, setDeviceList] = useState([]);
  const [boxDetails, setBoxDetails] = useState({});
  const [alldeviceList, setAlldeviceList] = useState([]);
  const [exportDataPdf, setExportDataPdf] = useState([]);
  const [exportDataExcel, setExportDataExcel] = useState([]);
  const [IdBool, setIdBool] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [search, setSearch] = useState("");

  console.log(search, "n");

  function getBoxListById(exportType) {
    BoxPackaging.getDevicesByBoxId({ id: id })
      .then((res) => {
        if (res != null) {
          setAlldeviceList(res.data.deviceList);
          setDeviceList(res.data.deviceList);
          setBoxDetails(res.data.boxDTO);
          console.log(res.data);
          if (exportType == "excel") {
            // setExportDataExcel(res.data);
            exportDataList(res.data.deviceList);

            setTimeout(() => {
              document.getElementById("exportDataList").click();
            }, 500);
          } else if (exportType == "pdf") {
            // setExportDataPdf(res.data);
            exportDataList(res.data.deviceList);

            setTimeout(() => {
              document.getElementById("exportPdfButton").click();
            }, 500);
          }
        } else {
          setDeviceList([]);
          setBoxDetails();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  console.log("boxDetails", boxDetails);
  const exportDataList = (exportArray) => {
    console.log(exportArray, "exportarray");
    let exportDataArray = [];
    exportArray.forEach((item, index) => {
      let objExport = {
        col1: index + 1,
        col2: moment.utc(item.updatedAt).format("DD/MM/YYYY hh:mm a"),
        col3: item.imeiNo,
        col4: item.iccidNo,
        col5: item.uuidNo,
        col6: item.softwareVersion,
        // col7: item && item.state && item.state.name ? item.state.name : "NA",
        col7: item.status,
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
  useEffect(() => {
    getBoxListById();
  }, []);

  function onPdfDownload(exportType) {
    getBoxListById(exportType);
  }
  function onExcelDownload(exportType) {
    getBoxListById(exportType);
  }

  const globalSearcValueHandler = (e) => {
    setSearch(e.target.value);
    setIdBool(true);
    if (e.target.value === "") {
      setIdBool(true);
    }
  };

  const onSearchInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const getFilteredBoxList = () => {
    if (!searchValue) {
      setDeviceList(alldeviceList);
    } else {
      const filteredDeviceInfo = alldeviceList.filter((device) => {
        // Here, you can add more fields for global search if needed
        const searchFields = [
          device.imeiNo,
          device.iccidNo,
          device.uuidNo,
          device.softwareVersion,
          device?.state && device.state.name ? device.state.name : "",
          device.status || "",
        ];
        const searchString = searchValue.toLowerCase().trim();
        return searchFields.some((field) =>
          field.toLowerCase().includes(searchString)
        );
      });
      setDeviceList(filteredDeviceInfo);
    }
  };
  useEffect(() => {
    getFilteredBoxList();
  }, [searchValue]);

  let topViewData = {
    pageTitle: `Box Details (${boxDetails && boxDetails.boxNo})`,
    // pageTitle: `Box Details`,

    /* ================= */
    addText: "",
    // hideAddButton: !webPermission.includes("ADD_COMPANY"),
    hideAddButton: true,
    addClick: "/createBox",
    /* ====================== */
    editText: "",
    hideEditButton: true,
    editClick: null,
    /* =========================== */
    cancelText: null,
    hideCancelButton: false,
    cancelClick: "/boxList",
    /* ================== */
    updateText: null,
    hideUpdateButton: true,
    updateClick: null,
    /* ================== */
    hidePdfExport: false,
    exportPdfClick: "/companyCreate",
    onPdfDownload: onPdfDownload,
    /* ================= */
    hideExcelExport: false,
    exportExcelClick: "",
    onExcelDownload: onExcelDownload,
    /* ==================== */
    hideExcelImport: true,
    excelImportClick: "",
    /* ==================== */
    filter: true,
    filterHandler: null,
    /* ====================== */

    searchFieldHandler: onSearchInputChange,
    searchInput: searchValue,
    searchField: false, // Show the search input field
  };
  let tableHeadForExport = [
    "Sno.",
    "Updated At",
    "IMEI Number",
    "ICCID Number",
    "UUID Number",
    "Software Version",
    // "State",
    "Status",
  ];
  const TableHeadData = [
    { id: 1, name: "S no.", width: "50px" },
    { id: 2, name: "Updated At", width: "150px" },

    { id: 4, name: "IMEI Number", width: "100px" },
    { id: 5, name: "ICCID Number", width: "100px" },
    { id: 6, name: "UUID Number", width: "100px" },
    { id: 7, name: "Software Version", width: "200px" },
    // { id: 7, name: "State", width: "200px" },
    { id: 8, name: "Status", width: "100px" },
  ];

  const showUnbox = JSON.parse(
    localStorage.getItem("data")
  ).webPermissionDTOList.filter((ele) => {
    return ele.name === "UNBOX_DEVICE" && ele.forWeb;
  });

  const unBoxDevicesFromBox = async () => {
    debugger;
    try {
      const key = boxDetails?.id;
      if (!key) {
        return;
      }
      const response = await BoxPackaging.UnBoxingDriveces(key);
      if (response !== null) {
        alert("The box has been successfully unpacked!");
        navigate("/boxList");
      } else {
        alert("Something want wrong!");
      }
    } catch (error) {
      console.error("Error while unboxing devices:", error);
      alert("Something went wrong!");
    }
  };
  useEffect(() => {
    console.log(moment().format("DDMM"));
  }, []);

  return (
    <div className="main_container">
      <Box className="main">
        <TopView topViewData={topViewData} />
        {false && showUnbox && showUnbox.length > 0 ? (
          <>
            <Grid item xs={12} sm={4} md={4} lg={2} xl={1}>
              <Button
                variant="contained"
                sx={{
                  top: "-48px",
                  zIndex: "100",
                  left: "25rem",
                  backgroundColor: "rgb(14 57 115 / 86%)",
                }}
                onClick={() => unBoxDevicesFromBox()}
              >
                Unbox
              </Button>
            </Grid>
          </>
        ) : null}
        <Grid item xs={12} container>
          <Grid item xs={12} sm={4} md={4} lg={2} xl={1}>
            <div style={{ display: "none" }}>
              <ExportPdf
                exportData={exportDataPdf || []}
                labelHeader={tableHeadForExport || []}
                title={`Watsoo Device Management( Box No. ${
                  boxDetails && boxDetails.boxNo
                })`}
                reportName="Watsoo Device Management"
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={2} xl={1.5}>
            <div style={{ display: "none" }}>
              <ExportReport
                exportData={exportDataExcel || []}
                labelHeader={tableHeadForExport || []}
                exportHeading={[
                  `Watsoo Device Management( Box No. ${
                    boxDetails && boxDetails.boxNo
                  })`,
                ]}
              />
            </div>
          </Grid>
        </Grid>
        <Grid item style={{ marginBottom: 10 }}>
          <div>
            <Typography subtitle1="h2">{`Total Devices: ${
              boxDetails && boxDetails.quantity && boxDetails.quantity
            }`}</Typography>
          </div>
        </Grid>
        <Grid item xs={12} container sx={{ background: "" }} rowGap={2}>
          <Grid item xs={8} container rowGap={3}>
            <Grid item xs={3}>
              <TextField
                name="search"
                type="text"
                size="small"
                variant="outlined"
                label=" Client Name"
                disabled
                inputProps={{
                  style: {
                    width: "12rem",
                  },
                }}
                value={deviceList[0]?.clientName || "NA"}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                name="search"
                type="text"
                size="small"
                variant="outlined"
                label="State"
                disabled
                inputProps={{
                  style: {
                    width: "12rem",
                  },
                }}
                value={boxDetails?.state?.name || "NA"}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                name="search"
                type="text"
                size="small"
                variant="outlined"
                label="Created At"
                disabled
                inputProps={{
                  style: {
                    width: "12rem",
                  },
                }}
                value={
                  boxDetails?.createdAt
                    ? moment.utc(boxDetails?.createdAt).format("DD/MM/YYYY")
                    : "NA"
                }
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                name="search"
                type="text"
                size="small"
                variant="outlined"
                label=" Created By"
                disabled
                inputProps={{
                  style: {
                    width: "12rem",
                  },
                }}
                value={boxDetails?.createdBy?.firstName || "NA"}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid sx={{ marginTop: "10px" }}>
          <Grid>
            <TableContainer sx={{ borderRadius: "10px" }}>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "rgb(14 57 115 / 86%)" }}>
                    {TableHeadData.map((ele, index) => (
                      <TableCell
                        key={index}
                        sx={{ minWidth: ele.width, color: "white" }}
                      >
                        {ele.name}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deviceList &&
                    deviceList.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {moment
                            .utc(item.updatedAt)
                            .format("DD/MM/YYYY hh:mm a")}
                        </TableCell>
                        {/* <TableCell>{`${item.userName} | ${item.userEmail}`}</TableCell> */}
                        <TableCell>{item.imeiNo}</TableCell>
                        <TableCell>{item.iccidNo}</TableCell>
                        <TableCell>{item.uuidNo}</TableCell>
                        <TableCell>{item.softwareVersion}</TableCell>
                        {/* <TableCell>
                          {item && item.state && item.state.name
                            ? item.state.name
                            : "NA"}
                        </TableCell> */}
                        <TableCell>
                          {item.status ? item.status : "NA"}
                        </TableCell>
                        {/* <TableCell>{item.detail.split(",").join("\n")}</TableCell> */}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default BoxDevices;
