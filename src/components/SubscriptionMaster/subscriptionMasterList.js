import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TopView from "../CommonComponents/topView";
import moment from "moment";
import ExportPdf from "../CommonComponents/exportPdf";
import ExportReport from "../CommonComponents/Export";
import { SubscriptionAction } from "../actions/subscription";
import LoadingComponent from "../CommonComponents/LoadingComponts";

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
  InputAdornment,
  Box,
  Autocomplete,
} from "@mui/material";
const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(14 57 115 / 86%)",
    },
  },
});
const SubscriptionMasterList = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [exportDataPdf, setExportDataPdf] = useState([]);
  const [exportDataExcel, setExportDataExcel] = useState([]);
  const [pageNo, setPageNo] = useState(0);

  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [subscriptionList, setSubscriptionList] = useState([]);

  const handleChangePage = (event, newPage) => {
    //console.log(newPage);
    setPageNo(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    //console.log(event.target.value)
    setPageSize(parseInt(event.target.value));
    setPageNo(0);
  };
  const onPdfDownload = (type) => {
    getSubscriptionList(false, "pdf");
  };

  const onExcelDownload = (type) => {
    getSubscriptionList(false, "excel");
  };
  let topViewData = {
    pageTitle: "Subscription Master",

    addText: "Add Return Device",

    hideAddButton: false,
    addClick: `/addSubscription`,

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
    searchField: true,
  };
  const tableHeadForExport = [
    "S.No.",
    "Subscription Id",
    "State",
    "Amount(Rs.)",
    "Subscription Period",
  ];

  const exportDataList = (exportArray) => {
    console.log(exportArray, "exportarray");
    let exportDataArray = [];
    exportArray &&
      exportArray.length > 0 &&
      exportArray.forEach((item, index) => {
        let objExport = {
          col1: index + 1,
          col2: item?.subsTypeId ?? "NA",

          col3: item.state && item.state.name ? item.state.name : "NA",
          col4: item?.defaultAmount ?? "NA",

          col5: item?.totalDays ?? "NA",
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

  async function getSubscriptionList(type, exportType) {
    setIsLoading(true);
    let data = { pageNo: type ? pageNo : 0, pageSize: type ? pageSize : 0 };
    const response = await SubscriptionAction.getSubscriptionList(data);
    if (type) {
      setSubscriptionList(response?.data);
    } else {
      if (exportType == "pdf") {
        exportDataList(response.data);
        setTimeout(() => {
          document.getElementById("exportPdfButton").click();
        }, 500);
      } else {
        exportDataList(response.data);

        setTimeout(() => {
          document.getElementById("exportDataList").click();
        }, 500);
      }
    }
    setIsLoading(false);
  }
  useEffect(() => {
    getSubscriptionList(true);
  }, []);
  const TableHeadData = [
    { name: "S.No.", width: "50px" },
    {
      name: "Subscription  Id",
      width: "150px",
    },
    {
      name: "Client",
      width: "150px",
    },
    {
      name: "State",
      width: "150px",
    },
    {
      name: "Platform",
      width: "150px",
    },
    {
      name: "amount(Rs.)",
      width: "150px",
    },
    {
      name: "Subscription period",
      width: "100px",
    },
  ];
  return (
    <div className="main_container">
      <Box className="main">
        <ThemeProvider theme={theme}>
          <TopView topViewData={topViewData}></TopView>
          <LoadingComponent isLoading={isLoading} />

          <Grid container sx={{ marginTop: "0rem", background: "" }} rowGap={1}>
            <Grid item xs={12} sm={4} md={4} lg={2} xl={1}>
              <div style={{ display: "none" }}>
                <ExportPdf
                  exportData={exportDataPdf || []}
                  labelHeader={tableHeadForExport || []}
                  title="Subscription List"
                  reportName="Subscription List"
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={2} xl={1.5}>
              <div style={{ display: "none" }}>
                <ExportReport
                  exportData={exportDataExcel || []}
                  labelHeader={tableHeadForExport || []}
                  exportHeading={["Subscription List"]}
                />
              </div>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ width: "100%", mb: 2 }} elevation={1}>
                <TableContainer component={Paper} elevation={1}>
                  <Table
                    size="small"
                    aria-label="a dense table"
                    justifyContent={"center"}
                    alignItems="center"
                  >
                    <TableHead>
                      <TableRow
                        sx={{ backgroundColor: "rgb(14 57 115 / 86%)" }}
                      >
                        {TableHeadData.map((ele, index) => (
                          <TableCell
                            key={index}
                            sx={{
                              minWidth: ele.width,
                              color: "white",
                              textAlign: "center",
                            }}
                          >
                            {ele.name}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {subscriptionList?.length > 0 &&
                        subscriptionList.map((user, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell sx={{ textAlign: "center" }}>
                                {index + 1}
                              </TableCell>
                              <TableCell
                                sx={{
                                  textAlign: "center",
                                  cursor: "pointer",
                                  color: "blue",
                                }}
                                onClick={() => {
                                  debugger;
                                  // const path = `viewLot/${user.id}`;

                                  const path = `DevicesList/${user.id}`;
                                  window.open(path, "_self");
                                }}
                              >
                                {user.subsTypeId || "NA"}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                {user?.company ?? "NA"}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                {user?.stateName ?? "NA"}
                              </TableCell>{" "}
                              <TableCell sx={{ textAlign: "center" }}>
                                {user?.platform ?? "NA"}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                {user?.defaultAmount ?? "NA"}
                              </TableCell>{" "}
                              <TableCell sx={{ textAlign: "center" }}>
                                {user?.totalDays ?? "NA"}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  sx={{}}
                  component="div"
                  rowsPerPageOptions={[10, 20, 50, 100]}
                  count={totalCount ? totalCount : 0}
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

export default SubscriptionMasterList;
