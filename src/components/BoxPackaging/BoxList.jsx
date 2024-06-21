import {
  Grid,
  Button,
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
  TextField,
  Typography,
  Box,
  Autocomplete,
} from "@mui/material";
import moment from "moment";
import { Search } from "@mui/icons-material";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { useEffect, useMemo, useState } from "react";
import { BoxPackaging } from "../actions/boxPackaging";
import ExportReport from "../CommonComponents/Export";
import ExportPdf from "../CommonComponents/exportPdf";
import TopView from "../CommonComponents/topView";
import BoxListTable from "./BoxListTable";
import { styled } from "@mui/material/styles";

import SimpleDialog from "./QrcodeDialog";
import { debounce } from "lodash";
import ReconfigurationModal from "./ReconfigurationModal";
import { useNavigate } from "react-router";
import debouce from "lodash.debounce";

export const CustomAutoComplete = styled(Autocomplete)(
  ({ theme, ...props }) => ({
    width: "100%",
    "& input": {
      background: props.background ? props.background : "#fff",
      borderRadius: "5px",
      padding: "11px 15px !important",
      borderLeft: props.required ? "2px solid #EF3434" : "0",
      fontSize: "13px",
    },

    "& .MuiOutlinedInput-root": {
      background: props.background ? props.background : "#fff",
      borderRadius: "5px",
      marginBottom: "0px",
    },
    "& .MuiTextField-root": {
      margin: 0,
    },
    "& fieldset": {
      border: ".5",
    },
    "& label": {
      lineHeight: "initial",
      fontSize: "13px",
    },
    "& .MuiInputLabel-shrink": {
      // background: "#ffffff",
      transform: " translate(14px, -7px) scale(0.8) !important",
    },
    "& .MuiInputLabel-root": {
      transform: "translate(14px, 9px) scale(1)",
    },
    " & .MuiOutlinedInput-root": {
      padding: "0",
    },
  })
);
var tableHeadForExport = [
  "S.No",
  "Box Number",
  "Created Date",
  "Created By",
  "Box Quantity",
  // "Current Quantity",
  "State",
  "Status",
  "Dispatch No.",
];
function BoxList() {
  const navigate = useNavigate();
  const loginData = JSON.parse(localStorage.getItem("data"));
  const reconfigurationPermission = loginData?.webPermissionDTOList?.filter(
    (ele) => {
      return ele.name == "RECONFIGURE" && ele.forWeb == true;
    }
  );
  const [boxList, setBoxList] = useState([]);
  const [alldeviceList, setAlldeviceList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [IdBool, setIdBool] = useState(false);
  const [exportDataPdf, setExportDataPdf] = useState([]);
  const [exportDataExcel, setExportDataExcel] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogData, setDialogData] = useState({});
  const [showPrint, setShowPrint] = useState(true);
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [search, setSearch] = useState("");
  const [stateList, setStateList] = useState([{ id: "", name: "All" }]);
  const [state, setState] = useState({ id: "", name: "All States" });
  const [searchValue, setSearchValue] = useState("");
  const [reconfigurationModal, setReconfigurationModal] = useState(false);
  const [reconfigurationData, setReconfigurationData] = useState({});
  const [reconfigurationCommand, setReconfigurationCommand] = useState();
  const createBoxPermission = loginData.webPermissionDTOList.filter((ele) => {
    return ele.name == "CREATE_BOX" && ele.isActive == true;
  });

  const exportDataList = (exportArray) => {
    console.log(exportArray, "exportarray");
    let exportDataArray = [];
    exportArray.forEach((val, index) => {
      let objExport = {
        col1: index + 1,
        col2: val ? val.boxNo : "NA",
        col3: val ? moment(val.createdAt).format("YYYY-MM-DD hh:mm a") : "NA",
        col4: val && val.createdBy !== null ? val.createdBy.name : "NA",
        col5: val && val.quantity !== null ? val.quantity : "NA",
        // col6: val && val.currentQuantity ? val.currentQuantity : "NA",

        col6: val.state && val.state.name !== null ? val.state.name : "NA",
        col7: val && val.status !== null ? val.status : "NA",
        col8: "NA",
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

  const fetchBosPakagingList = () => {
    const data = {
      pageNo: pageNo,
      pageSize: pageSize,
      startDate: Date.parse(moment(fromDate).startOf("day")),
      endDate: Date.parse(moment(toDate).endOf("day")),
      search: search ? search : "",
      stateId: state ? state.id : null,
    };

    BoxPackaging.fetchBoxList(data).then((response) => {
      if (response !== null) {
        setAlldeviceList(response.data.data);
        exportDataList(response.data.data);
        setTotalCount(response.data.totalElements);
        setBoxList(response.data.data);
      } else {
        console.log("error");
      }
    });
  };

  const exportHandler = (type) => {
    if (type === "excel") {
      document.getElementById("exportDataList").click();
    }
    if (type === "pdf") {
      document.getElementById("exportPdfButton").click();
    }
  };

  const getAllStates = () => {
    BoxPackaging.getAllStatesList()
      .then((res) => {
        if (res != null) {
          setStateList((previous) => {
            return previous.concat(res);
          });
        } else {
          setStateList([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangePage = (event, newPage) => {
    //console.log(newPage);
    setPageNo(newPage);
    setIdBool(true);
  };

  console.log(alldeviceList, "alldeviceList");
  const onSearchInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const globalSearcValueHandler = (e) => {
    setSearch(e.target.value);

    // setIdBool(true);
    if (e.target.value === "") {
      // setIdBool(true);
      setPageNo(0);
    }
  };
  const debouncedResults = useMemo(() => {
    return debouce(globalSearcValueHandler, 1000);
  }, []);

  const getFilteredBoxList = () => {
    if (!searchValue) {
      setBoxList(alldeviceList);
    } else {
      const filteredDeviceInfo = alldeviceList.filter((device) => {
        const searchFields = [
          device.boxNo,
          moment(device.createdAt).format("DD-MM-YYYY hh:mm a"),
          device?.state && device.state.name ? device.state.name : "",
          device.status || "",
        ];
        const searchString = searchValue.toLowerCase().trim();
        return searchFields.some((field) =>
          field.toLowerCase().includes(searchString)
        );
      });
      setBoxList(filteredDeviceInfo);
    }
  };

  useEffect(() => {
    getFilteredBoxList();
  }, [searchValue]);

  let topViewData = {
    pageTitle: "Box List",
    /* ================= */
    addText: "",
    // hideAddButton: !webPermission.includes("ADD_COMPANY"),
    hideAddButton:
      createBoxPermission && createBoxPermission.length > 0 ? false : true,
    addClick: "/createBox/0",
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
    hidePdfExport: false,
    exportPdfClick: "/companyCreate",
    onPdfDownload: exportHandler,
    /* ================= */
    hideExcelExport: false,
    exportExcelClick: "",
    onExcelDownload: exportHandler,
    /* ==================== */
    hideExcelImport: true,
    excelImportClick: "",
    /* ==================== */
    filter: true,
    filterHandler: null,
    /* ====================== */

    searchFieldHandler: debouncedResults,
    searchInput: search,
    searchField: false,
  };

  const handleChangeRowsPerPage = (event) => {
    //console.log(event.target.value)
    setPageSize(parseInt(event.target.value));
    setPageNo(0);
    setIdBool(true);
  };
  //.......................... unBox Devices From Box Start.........................//
  const unBoxDevicesFromBox = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to unbox the devices?"
    );
    if (!confirmed) {
      return; // User cancelled the operation
    }

    try {
      const key = id;
      if (!key) {
        return;
      }
      const response = await BoxPackaging.UnBoxingDriveces(key);
      if (response !== null) {
        alert("The box has been successfully unpacked!");
        // navigate("/boxList");
      } else {
        alert("Something want wrong!");
      }
    } catch (error) {
      console.error("Error while unboxing devices:", error);
      alert("Something went wrong!");
    }
  };

  //.......................... unBox Devices From Box End.........................//

  // const reconfigurationHandler = (data) => {
  //   setReconfigurationData(data);
  //   window.open(`/ReconfigurationList/${data.id}`, "_self");
  // };
  const navigateToReconfigHandler = (data) => {
    navigate(`/ReconfigurationList`);
  };

  useEffect(() => {
    fetchBosPakagingList();
  }, [pageNo, pageSize, fromDate, toDate, search, state]);

  useEffect(() => {
    getAllStates();
  }, []);
  function handleClose() {
    setOpen(false);
    setShowPrint(true);
  }
  function generateQrHandler(data) {
    setDialogData(data);
    setOpen(true);
  }

  function stateHandler(data) {
    if (data) {
      setState(data);
    } else {
      setState({ id: "", name: "" });
    }
  }

  return (
    <div className="main_container">
      <Box className="main">
        <div style={{ display: "none" }}>
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
        </div>
        <div>
          <SimpleDialog
            open={open}
            data={dialogData}
            onClose={handleClose}
            showPrint={showPrint}
            setShowPrint={setShowPrint}
          />
        </div>

        <TopView topViewData={topViewData} />
        <Grid>
          <Grid
            item
            xs={12}
            container
            justifyContent={"flex-start"}
            spacing={5}
          >
            <Grid item>
              <Typography
                // variant="subtitle2"
                // gutterBottom
                sx={{ color: "#0d5257" }}
              >
                FromDate
              </Typography>
              <TextField
                name="fromDate"
                //label="With normal TextField"
                type="date"
                size="small"
                variant="outlined"
                inputProps={{
                  // max: toDate,
                  style: {
                    width: "12rem",
                  },
                }}
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                }}
              />
            </Grid>
            <Grid item>
              <Typography
                // variant="subtitle2"
                // gutterBottom
                sx={{ color: "#0d5257" }}
              >
                ToDate
              </Typography>
              <TextField
                name="toDate"
                type="date"
                size="small"
                variant="outlined"
                value={toDate}
                inputProps={{
                  // max: toDate,
                  style: {
                    width: "12rem",
                  },
                }}
                onChange={(e) => {
                  setToDate(e.target.value);
                }}
              />
            </Grid>
            <Grid item style={{ marginTop: "1.4rem" }}>
              <CustomAutoComplete
                disablePortal
                id="combo-box-demo"
                options={stateList ? stateList : []}
                value={state}
                getOptionLabel={({ name }) => {
                  return name;
                }}
                onChange={(e, newValue) => stateHandler(newValue)}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Select State" />
                )}
              />
            </Grid>
            {/* <Grid item>
              <Typography sx={{ color: "#0d5257", display: "none" }}>
                Search
              </Typography>
              <TextField
                name="search"
                //label="With normal TextField"
                type="text"
                size="small"
                variant="outlined"
                inputProps={{
                  style: {
                    width: "12rem",
                    display: "none",
                  },
                }}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (e.target.value == "") {
                    setIdBool(true);
                    setPageNo(0);
                  }
                }}
                InputProps={{
                  // endAdornment: !toggle?<IconButton
                  // onClick={() => { setIdBool(true);setToggle(true)}}
                  // ><Search color="primary" position="end"
                  // /></IconButton>:<IconButton onClick={() => {setSearch("");setIdBool(true);setToggle(false)}}><ClearRoundedIcon/></IconButton>
                  startAdornment: (
                    <IconButton
                      onClick={() => {
                        setIdBool(true);
                      }}
                    >
                      <Search color="primary" position="start" />
                    </IconButton>
                  ),
                  endAdornment:
                    search !== "" ? (
                      <IconButton
                        onClick={() => {
                          setSearch("");
                          setIdBool(true);
                        }}
                      >
                        <ClearRoundedIcon />
                      </IconButton>
                    ) : (
                      ""
                    ),
                }}
              />
            </Grid> */}
            {reconfigurationPermission?.length > 0 && (
              <Grid item>
                <Button
                  variant="contained"
                  sx={{ marginTop: "24px" }}
                  onClick={() => navigateToReconfigHandler()}
                >
                  Reconfiguration
                </Button>
              </Grid>
            )}
          </Grid>
          <Grid item xs={12} style={{ marginTop: "20px" }}>
            <BoxListTable
              style={{
                maxHeight: "calc(100vh - 225px)",
                height: "auto",
              }}
              boxList={boxList}
              generateQrHandler={generateQrHandler}
              unBoxDevicesFromBox={unBoxDevicesFromBox}
            />
            <TablePagination
              component="div"
              rowsPerPageOptions={[5, 10, 20, 50, 100]}
              count={totalCount}
              rowsPerPage={pageSize}
              page={pageNo}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default BoxList;
