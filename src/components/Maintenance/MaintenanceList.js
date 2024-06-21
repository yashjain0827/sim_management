import {
  Button,
  Grid,
  TextField,
  Typography,
  Box,
  Autocomplete,
  InputAdornment,
  Divider,
  Fade,
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
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useParams, useLocation } from "react-router-dom";
import TopView from "../CommonComponents/topView";
import { MaintenanceAction } from "../actions/maintenance";
import moment from "moment";
import { alpha, styled } from "@mui/material/styles";
import { green } from "@mui/material/colors";
import Switch from "@mui/material/Switch";
import { TextareaAutosize } from "@mui/base";

const PinkSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: green[600],
    "&:hover": {
      backgroundColor: alpha(green[600], theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: green[600],
  },
}));
const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(14 57 115 / 86%)",
    },
  },
});

function Maintenance() {
  const { maintenanceType } = useParams();
  const location = useLocation();
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [maintenanceListCopy, setMaintenanceListCopy] = useState([]);

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [remark, setRemark] = useState("");

  const createdBy = JSON.parse(localStorage.getItem("data")).id;

  async function fetchMaintenanceDeviceList(term) {
    try {
      let data = {
        createdBy: createdBy,
        operation: maintenanceType.toUpperCase(),
        imeiNo: term,
        pageNo: pageNo,
        pageSize: pageSize,
      };

      const result = await MaintenanceAction.getAllMaintenanceDevices(data);
      console.log(result.data);
      setTotalCount(result);

      setMaintenanceList(result.data);
      setMaintenanceListCopy(result.data);
    } catch (err) {
      setMaintenanceList([]);
      setMaintenanceListCopy([]);
      console.log(err);
    }
  }

  const TableHeadData = [
    { name: "S No.", width: "50px", isVisible: true },

    { name: "Imei No.", width: "50px", isVisible: true },

    {
      name: "createdAt",
      width: "100px",
      isVisible: true,
    },

    {
      name: "clientName",
      width: "100px",
      isVisible: true,
    },
    {
      name: "Operation",
      width: "100px",
      isVisible: true,
    },
    {
      name: "Status",
      width: "150px",
      isVisible: true,
    },
    {
      name: "Replaced By",
      width: "100px",
      isVisible: maintenanceType == "replace" ? true : false,
    },
    {
      name: "Remark",
      width: "100px",
      isVisible: maintenanceType == "repair" ? true : false,
    },
    {
      name: "Action",
      width: "100px",
      isVisible: maintenanceType == "repair" ? true : false,
    },
  ];
  function getData(term) {
    debugger;
    // setSearchTerm(term);
    // setSearchTerm(term);
    console.log(term);
    if (true) {
      fetchMaintenanceDeviceList(term);
    } else {
      // setSearchDeviceList([]);
    }
    // console.log(term);
  }
  // let value = [];
  const searchHandler = (getData, delay) => {
    debugger;

    let timer;
    /*   below function is debouncedFunction1 we can accept all the argument passed to the debouncedFunction1
   in the arguments object */
    return (...args) => {
      console.log(args);
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        getData.apply(this, args);
      }, delay);
    };
  };

  const debouncedFuntion1 = searchHandler(getData, 1000);
  let topViewData = {
    pageTitle: `Maintenance(${maintenanceType})`,
    /* ================= */
    addText: `Add to ${maintenanceType}`,
    // hideAddButton: !webPermission.includes("ADD_COMPANY"),
    hideAddButton: false,
    // createBoxPermission && createBoxPermission.length > 0 ? false : true,
    addClick: `/add/${maintenanceType}`,
    /* ====================== */
    editText: "",
    hideEditButton: true,
    editClick: null,
    /* =========================== */
    cancelText: null,
    hideCancelButton: true,
    cancelClick: null,
    /* ================== */
    updateText: null,
    hideUpdateButton: true,
    updateClick: null,
    /* ================== */
    hidePdfExport: true,
    exportPdfClick: "/companyCreate",
    onPdfDownload: null,
    /* ================= */
    hideExcelExport: true,
    exportExcelClick: "",
    onExcelDownload: null,
    /* ==================== */
    hideExcelImport: true,
    excelImportClick: "",
    /* ==================== */
    filter: true,
    filterHandler: null,
    /* ====================== */

    searchFieldHandler: (e) => debouncedFuntion1(e.target.value),
    searchInput: null,
    searchField: false,
  };

  useEffect(() => {
    fetchMaintenanceDeviceList();
  }, [location, pageNo, pageSize]);

  const handleChangePage = (event, newPage) => {
    //console.log(newPage);
    setPageNo(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    //console.log(event.target.value)
    setPageSize(parseInt(event.target.value));
    setPageNo(0);
  };
  function updateRepairStatusHandler(event, item, index) {
    if (!remark) {
      alert("please enter remark!");
      return;
    }
    let data = {
      id: item.id,
      remark: maintenanceListCopy[index].remark,
      status: event.target.checked ? "COMPLETTED" : "PENDING",
    };
    MaintenanceAction.updateRepairStatus(data)
      .then((res) => {
        if (res) {
          console.log(res);

          fetchMaintenanceDeviceList();
        }
      })
      .catch((err) => console.log(err));
  }
  function remarkHandler(remark, index) {
    setRemark(remark);
    let arr = [...maintenanceListCopy];
    arr[index].remark = remark;
    setMaintenanceListCopy(arr);
  }
  return (
    <div className="main_container">
      <Box className="main">
        <TopView topViewData={topViewData} />

        <ThemeProvider theme={theme}>
          <Grid container sx={{ marginTop: "0rem" }} rowGap={1}>
            <Grid item xs={12}>
              <Paper sx={{ width: "100%", mb: 2 }} elevation={1}>
                <TableContainer component={Paper} elevation={1}>
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow
                        sx={{ backgroundColor: "rgb(14 57 115 / 86%)" }}
                      >
                        {TableHeadData.map((ele, index) => {
                          return (
                            <>
                              {ele.isVisible && (
                                <TableCell
                                  sx={{ minWidth: ele.width, color: "white" }}
                                >
                                  {ele.name}
                                </TableCell>
                              )}
                            </>
                          );
                        })}
                        {/* {maintenanceType == "replace" && (
                          <TableCell
                            sx={{ minWidth: ele.width, color: "white" }}
                          >
                            Replaced By
                          </TableCell>
                        )} */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {maintenanceList &&
                        maintenanceList.length > 0 &&
                        maintenanceList.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell>{index + 1}</TableCell>
                            {/* <TableCell>
                            {moment
                              .utc(item.updatedAt)
                              .format("DD/MM/YYYY hh:mm A")}
                          </TableCell> */}
                            {/* <TableCell>{`${
                            item.createdBy ? item.createdBy.name : "NA"
                          }`}</TableCell> */}
                            <TableCell>
                              {item.imei ? item.imei : "NA"}
                            </TableCell>
                            <TableCell>
                              {item?.createdAt
                                ? moment(item.createdAt).format(
                                    "DD-MM-YYYY HH:mm"
                                  )
                                : "NA"}
                            </TableCell>
                            <TableCell>
                              {item.clientName ? item.clientName : "NA"}
                            </TableCell>

                            {/* <TableCell>
                            {item.packedDate
                              ? moment
                                  .utc(item?.packedDate)
                                  .format("DD/MM/YYYY hh:mm A")
                              : "NA"}
                          </TableCell> */}

                            <TableCell>{item?.operation ?? "NA"}</TableCell>
                            <TableCell>{item?.status ?? "NA"}</TableCell>

                            {maintenanceType == "replace" && (
                              <TableCell>
                                {item?.replaceByImei ?? "NA"}
                              </TableCell>
                            )}

                            {maintenanceType == "repair" &&
                            item.status != "COMPLETTED" ? (
                              <TableCell>
                                <TextareaAutosize
                                  style={{ height: 30, padding: 3 }}
                                  disabled={item.status == "COMPLETTED"}
                                  onChange={(e) =>
                                    remarkHandler(e.target.value, index)
                                  }
                                />
                              </TableCell>
                            ) : (
                              <TableCell>
                                <Typography>{item?.remark ?? "NA"}</Typography>
                              </TableCell>
                            )}

                            {maintenanceType == "repair" && (
                              <TableCell>
                                <PinkSwitch
                                  disabled={item.status == "COMPLETTED"}
                                  checked={item.status == "COMPLETTED"}
                                  onChange={(event) =>
                                    updateRepairStatusHandler(
                                      event,
                                      item,
                                      index
                                    )
                                  }
                                />
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  sx={{}}
                  component="div"
                  rowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
                  count={
                    totalCount.totalElements ? totalCount.totalElements : 0
                  }
                  rowsPerPage={pageSize}
                  page={pageNo}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </Grid>
          </Grid>
        </ThemeProvider>
      </Box>
    </div>
  );
}
export default Maintenance;
