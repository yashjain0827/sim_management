import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { BoxPackaging } from "../actions/boxPackaging";
import { Box, Grid, IconButton, TextField, Typography } from "@mui/material";
import TopView from "../CommonComponents/topView";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import ExportReport from "../CommonComponents/Export";
import ExportPdf from "../CommonComponents/exportPdf";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

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
import { Search, SearchOutlined } from "@mui/icons-material";
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
function ViewBoxWithQrCode(props) {
    const { id } = useParams();
    const [deviceList, setDeviceList] = useState([]);
    const [AlldeviceList,setAlldeviceList]=useState([])
    const [boxDetails, setBoxDetails] = useState();
    const [exportDataPdf, setExportDataPdf] = useState([]);
    const [exportDataExcel, setExportDataExcel] = useState([]);
    const [search, setSearch] = useState("")

    console.log(deviceList, "deviceList")

    console.log(id);

    function getBoxListById(exportType) {
        BoxPackaging.getDevicesByBoxId({ id: id })
            .then((res) => {
                if (res != null) {
                    setDeviceList(res.data.deviceList);
                    setAlldeviceList(res.data.deviceList)
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
                col7: item && item.state && item.state.name ? item.state.name : "NA",
                col8: item.status,
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
    const searchHnadler = (e) => {
        setSearch(e.target.value)


    }

    const getFilteredPatients = () => {
        
        if (!search) {
            // alert("kkk")
            return setDeviceList(AlldeviceList);

        } else if (search) {
            const filteredUserInfo = deviceList && deviceList.filter(
                //(user) => regex.test(user.name) || regex.test(user.empCode)
                (user) => user.imeiNo.toLowerCase().trim().includes(search.toLowerCase()));
            //   document.getElementById("input").focus();
            console.log(filteredUserInfo, "filteredUserInfo")
            setDeviceList(filteredUserInfo);
        }
    };

    useEffect(() => {
        getFilteredPatients()
    }, [search])


    useEffect(() => {
        getBoxListById();
    }, []);

    function onPdfDownload(exportType) {
        getBoxListById(exportType);
    }
    function onExcelDownload(exportType) {
        getBoxListById(exportType);
    }
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
        hideCancelButton: true,
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

        searchFieldHandler: null,
        searchInput: null,
        searchField:true
    };
    let tableHeadForExport = [
        "Sno.",
        "Updated At",
        "IMEI Number",
        "ICCID Number",
        "UUID Number",
        "Software Version",
        "State",
        "Status",
    ];
    const TableHeadData = [
        { id: 1, name: "S no.", width: "50px" },
        { id: 2, name: "Updated At", width: "150px" },

        { id: 4, name: "IMEI Number", width: "100px" },
        { id: 5, name: "ICCID Number", width: "100px" },
        { id: 6, name: "UUID Number", width: "100px" },
        { id: 7, name: "Software Version", width: "200px" },
        { id: 7, name: "State", width: "200px" },
        { id: 8, name: "Status", width: "100px" },
    ];
    return (
        <div >
            <Box className="main">
                {/* <div style={{ display: "none" }}>
      <ExportPdf
        exportData={exportDataPdf || []}
        labelHeader={tableHeadForExport || []}
        title="Box List"
        reportName="Box List"
      />
      <ExportReport
        exportData={exportDataExcel || []}
        labelHeader={tableHeadForExport || []}
        exportHeading={["Box List"]}
      />
    </div> */}
                {/* <div padding>
      <SimpleDialog open={open} data={dialogData} onClose={handleClose}  showPrint={showPrint} setShowPrint={setShowPrint}/>
    </div> */}
                <Grid>
                    <TopView topViewData={topViewData} />
                </Grid>
                <Grid item>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                    Search
                  </Typography>
                  <TextField
                    name="search"
                    label="Search IMEI Number"
                    type="text"
                    size="small"
                    variant="outlined"
                    inputProps={{
                      style: {
                        width: "12rem"
                      }
                    }}
                    value={search}
                    onChange={(e)=>searchHnadler(e)}
                    InputProps={{
                      startAdornment: (
                        <IconButton
                        //   onClick={() => {
                             // alert("hhh");
                        //   }}
                        >
                          <Search color="primary" position="start" />
                        </IconButton>
                      ),
                      endAdornment:
                        search !== "" ? (
                          <IconButton
                            onClick={() => {
                            setSearch("")
                            }}
                          >
                            <ClearRoundedIcon />
                          </IconButton>
                        ) : (
                          ""
                        )
                    }}
                  />
                    {/* <TextField
                        className="searchBar"
                        label="Search"
                        type="text"
                        id="input"
                        // placeholder="Search User"
                        name=""
                        noWrap
                        sx={{
                            ".MuiInputBase-root": {
                                borderRadius: "10px",
                                background: "#DAE2EE",
                            },
                            width: "20%"
                        }}
                        size="small"
                        fullWidth
                        // width="50%"
                        ref={(input) => input && input.focus()}
                        // autoFocus
                        focused
                        autoComplete="off"
                        onChange={(e) => searchHnadler(e)}
                        InputProps={{
                            endAdornment: (
                                <IconButton>
                                    <SearchOutlined />
                                </IconButton>
                            ),
                        }}
                    /> */}
                </Grid>
                <Grid item xs={12} container>
                    <Grid item xs={12} sm={4} md={4} lg={2} xl={1}>
                        <div style={{ display: "none" }}>
                            <ExportPdf
                                exportData={exportDataPdf || []}
                                labelHeader={tableHeadForExport || []}
                                title="Watsoo Device Management"
                                reportName="Watsoo Device Management"
                            />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={2} xl={1.5}>
                        <div style={{ display: "none" }}>
                            <ExportReport
                                exportData={exportDataExcel || []}
                                labelHeader={tableHeadForExport || []}
                                exportHeading={["Watsoo Device Management"]}
                            />
                        </div>
                    </Grid>
                </Grid>
                <Grid item style={{ marginBottom: 10 }}>
                    <div>
                        <Typography subtitle1="h2">{`Total Devices: ${boxDetails && boxDetails.quantity && boxDetails.quantity
                            }`}</Typography>
                    </div>
                </Grid>
                <Grid>
                    <Grid>
                        <TableContainer sx={{ borderRadius: "10px" }}>
                            <Table size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: "rgb(14 57 115 / 86%)" }}>
                                        {TableHeadData && TableHeadData.map((ele, index) => (
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
                                                <TableCell>
                                                    {item && item.state && item.state.name
                                                        ? item.state.name
                                                        : "NA"}
                                                </TableCell>
                                                <TableCell>
                                                    {item.status ? item.status : "NA"}
                                                </TableCell>
                                                {/* <TableCell>{item.detail.split(",").join("\n")}</TableCell> */}
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {/* <TablePagination
          sx={{}}
          component="div"
          rowsPerPageOptions={[2, 5, 10, 20, { label: "All", value: -1 }]}
          count={totalCount}
          rowsPerPage={pageSize}
          page={pageNo}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}

export default ViewBoxWithQrCode;
