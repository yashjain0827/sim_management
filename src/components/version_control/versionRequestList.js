import React, { useEffect, useState } from "react";
import LoadingComponent from "../CommonComponents/LoadingComponts";
import TopView from "../CommonComponents/topView";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  Grid,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";
import { VersionAction } from "../actions/version";
import { styled } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Delete } from "@mui/icons-material";
import moment from "moment";
const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(14 57 115 / 86%)",
    },
  },
});
const VersionRequest = () => {
  const addRequestCommandPermissin = JSON.parse(
    localStorage.getItem("data")
  ).webPermissionDTOList.filter((ele) => {
    return ele.name == "REQUEST_COMMAND" && ele.forWeb;
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [idBool, setIdBool] = useState(false);
  const [isReverted, setIsReverted] = useState(false);
  const handleChangePage = (event, newPage) => {
    //console.log(newPage);
    setPageNo(newPage);
    setIdBool(true);
  };

  const handleChangeRowsPerPage = (event) => {
    //console.log(event.target.value)
    setPageSize(parseInt(event.target.value));
    setPageNo(0);
    setIdBool(true);
  };
  let topViewData = {
    pageTitle: `Update_version_Request`,
    /* ================= */
    addText: `Update_version`,
    // hideAddButton: !webPermission.includes("ADD_COMPANY"),
    hideAddButton:
      addRequestCommandPermissin && addRequestCommandPermissin.length > 0
        ? false
        : true,
    // createBoxPermission && createBoxPermission.length > 0 ? false : true,
    addClick: "/version_update",
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

    searchFieldHandler: null,
    searchInput: null,
    searchField: true,
  };
  const TableHeadData = [
    { name: "S No.", width: "50px", isVisible: true },

    { name: "Request No.", width: "50px", isVisible: true },

    {
      name: "Created At",
      width: "100px",
      isVisible: true,
    },

    {
      name: "Req Software Version",
      width: "100px",
      isVisible: true,
    },
    {
      name: "Total Device",
      width: "100px",
      isVisible: true,
    },
    {
      name: "Success Count",
      width: "150px",
      isVisible: true,
    },
    {
      name: "Action",
      width: "150px",
      isVisible: addRequestCommandPermissin?.length > 0 ?? false,
    },
  ];

  function SuccessPercentage(data) {
    const successPercentage =
      ((data?.successCount ?? 0) / data?.totalDevice) * 100;
    console.log(successPercentage);
    if (successPercentage > 75) {
      return "#03800063";
    }
  }

  function fetchAllRequest() {
    let data = {
      pageNo: pageNo,
      pageSize: pageSize,
    };
    VersionAction.getAllVersionRequest(data)
      .then((res) => {
        console.log(res);
        res.data.map((ele) => {
          return { ...ele, isReverted };
        });
        setTableData(res.data);
        setTotalCount(res);
        setIdBool(false);
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    fetchAllRequest();
  }, [idBool]);

  function showRequest(data) {
    navigate(`/versionRequest/${data.id}`);
  }
  function revertHandler(data, key) {
    setIdBool(true);
    let payload = {
      requestId: data.id,
      action: key,
    };
    VersionAction.revertCommandRequest(payload)
      .then((res) => {
        console.log(res);
        if (res && res.responseCode == 200) {
          // setIsReverted(true);
          setIdBool(false);
        } else {
          // setIsReverted(false);
        }
      })
      .catch((err) => console.log(err));
  }
  return (
    <div className="main_container">
      <Box className="main">
        <LoadingComponent isLoading={loading} />

        <TopView topViewData={topViewData} />
        <ThemeProvider theme={theme}>
          <Grid item xs={12} container>
            <Grid item container spacing={2} sx={{ height: "0px" }}>
              {/* <Grid item xs={12} sm={4} md={4} lg={2} xl={1.5}>
                <CustomAutoComplete
                  disablePortal
                  id="combo-box-demo"
                  options={versionList ? versionList : []}
                  value={selectedVersion || {}}
                  fullWidth
                  getOptionLabel={({ softwareVersion }) =>
                    softwareVersion ? softwareVersion : ""
                  }
                  onChange={(e, newValue) => setSelectedVersion(newValue)}
                  sx={{ width: 220 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputLabelProps={{ shrink: true }}
                      label="Select Software Version"
                      sx={{ top: "-50px", left: "19.5rem", zIndex: "100" }}
                    />
                  )}
                />
              </Grid> */}
            </Grid>
          </Grid>
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
                      {tableData &&
                        tableData.length > 0 &&
                        tableData.map((ele, index) => {
                          console.log(tableData);
                          return (
                            <TableRow
                              style={{ background: SuccessPercentage(ele) }}
                            >
                              <TableCell>{index + 1}</TableCell>
                              <TableCell onClick={() => showRequest(ele)}>
                                <span
                                  style={{
                                    color: "#006fff",
                                    cursor: "pointer",
                                  }}
                                >
                                  {ele.reqCode}
                                </span>
                              </TableCell>
                              <TableCell>
                                {moment(ele.createdAt).format(
                                  "DD-MM-YYYY HH:mm"
                                )}
                              </TableCell>{" "}
                              <TableCell>
                                {ele?.softwareVersion ?? "NA"}
                              </TableCell>{" "}
                              <TableCell>{ele?.totalDevice ?? "NA"}</TableCell>{" "}
                              <TableCell>{ele?.successCount ?? 0}</TableCell>{" "}
                              {addRequestCommandPermissin?.length > 0 && (
                                <TableCell
                                  sx={{
                                    color: "#006fff",
                                    cursor: "pointer",
                                    display: "flex",
                                    columnGap: 1,
                                  }}
                                  onClick={() => console.log("clicked")}
                                >
                                  {!ele.isReverted ? (
                                    <div>
                                      {/* <button
                                      style={{ padding: 2 }}
                                      variant="outlined"
                                      onClick={() =>
                                        revertHandler(ele, "CANCEL")
                                      }
                                    >
                                      Cancel
                                    </button> */}
                                      <Button
                                        style={{
                                          padding: 3,
                                          // background: "#8080128c",
                                          color: "white",
                                          borderRadius: 5,
                                          border: "none",
                                          cursor: "pointer",
                                        }}
                                        variant="contained"
                                        onClick={() =>
                                          revertHandler(ele, "REVERT")
                                        }
                                      >
                                        Revert
                                      </Button>
                                    </div>
                                  ) : (
                                    "Reverted"
                                  )}
                                </TableCell>
                              )}
                            </TableRow>
                          );
                        })}
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
};

export default VersionRequest;
