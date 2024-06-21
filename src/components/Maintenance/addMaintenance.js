import {
  TextField,
  Typography,
  Box,
  Autocomplete,
  InputAdornment,
  Divider,
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
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import TopView from "../CommonComponents/topView";
import { MaintenanceAction } from "../actions/maintenance";
import { styled } from "@mui/material/styles";
import zIndex from "@mui/material/styles/zIndex";
import moment from "moment";
import LoadingComponent from "../CommonComponents/LoadingComponts";
import MaintenanceModal from "./maintenanceModal";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export const CustomAutoComplete = styled(Autocomplete)(
  ({ theme, ...props }) => ({
    width: "100%",
    minWidth: 300,
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

const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(14 57 115 / 86%)",
    },
  },
});

function AddMaintenance() {
  const { maintenanceType } = useParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const [searchDeviceList, setSearchDeviceList] = useState([]);
  const [replacedByDeviceList, setReplacedByDeviceList] = useState([]);
  const [selectedDeviceList, setSelectedDeviceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clientList, setClientList] = useState([]);
  const [client, setClient] = useState();
  const [replacedDevice, setReplacedDevice] = useState();
  const [replacedDeviceBy, setReplacedDeviceBy] = useState();

  /*==================== MODAL STATES================ */

  const [open, setOpen] = useState(false);

  const TableHeadData = [
    { name: "S.No.", width: "50px" },

    {
      name: "Replaced IMEI ",
      width: "100px",
    },

    {
      name: "Issued Date",
      width: "100px",
    },
    {
      name: "Client Name",
      width: "150px",
    },
    {
      name: "Imei ReplacedBy",
      width: "200px",
    },

    {
      name: "State",
      width: "150px",
    },
    {
      name: "Action",
      width: "100px",
    },
  ];
  let topViewData = {
    pageTitle: `Add Maintenace(${maintenanceType})`,
    /* ================= */
    addText: `Add to ${maintenanceType}`,
    // hideAddButton: !webPermission.includes("ADD_COMPANY"),
    hideAddButton: true,
    // createBoxPermission && createBoxPermission.length > 0 ? false : true,
    addClick: null,
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

  function fetchAllCompanyList() {
    MaintenanceAction.getAllCompanyData().then((res) => {
      if (res != null) {
        console.log(res.data);
        setClientList(res.data);
      } else {
        setClientList([]);
      }
    });
  }

  function findDeviceFromServer(term, action) {
    if (!client) {
      alert("please Select client");
      return;
    }
    setLoading(true);
    let data = {
      // search: term,
      // fromDate: 6268266000,
      // toDate: Date.parse(new Date()),
      // userId: JSON.parse(localStorage.getItem("data")).id,
      // onlineDevice: false,

      clientId: action == "replaced" ? client.id : null,
      search: term,
      status:
        action == "replaced"
          ? ["ISSUED_DEVICES"]
          : ["DEVICE_PACKED", "BOX_PACKED"],
    };
    MaintenanceAction.getAllDevicesAsPerUserSearch(data).then((res) => {
      if (res != null && res.data && res.data.length > 0) {
        console.log(res.data);
        setLoading(false);
        const data = res.data;
        if (action == "replaced") {
          setSearchDeviceList((pre) => {
            return [...pre, ...data];
          });
        } else {
          debugger;
          setReplacedByDeviceList((pre) => {
            console.log([...pre, ...data]);
            return [...pre, ...data];
          });
        }

        // setSearchDeviceList((pre) =>
        // console.log([...pre, ...res.data])
        //  [...pre, ...res.data]);
      } else {
        setSearchDeviceList([]);
      }
    });
  }
  let timer;

  function getData(term, action) {
    debugger;
    // setSearchTerm(term);
    // setSearchTerm(term);
    console.log(term, action);
    if (term.length > 0) {
      findDeviceFromServer(term, action);
    } else {
      setSearchDeviceList([]);
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

  function selectedDeviceHandler(data, action) {
    if (data) {
      console.log(data);
      if (action == "replaced") {
        setReplacedDevice(data);
      } else {
        setReplacedDeviceBy(data);
      }
    } else {
    }
  }
  function saveMaintenance() {
    setLoading(true);
    const deviceDto = selectedDeviceList.map((ele) => {
      if (maintenanceType == "replace") {
        return {
          originalImei: ele.originalImei.imeiNo,
          replacedByImei: ele.replacedByImei.imeiNo,
        };
      } else {
        return {
          originalImei: ele.originalImei.imeiNo,
        };
      }
    });
    let data = {
      clientName: client.companyName,
      clientId: client.id,
      operation: maintenanceType.toUpperCase(),
      deviceDto: deviceDto,
      createdBy: JSON.parse(localStorage.getItem("data")).id,
    };
    MaintenanceAction.addDeviceToMaintenance(data)
      .then((res) => {
        setLoading(false);

        console.log(res);
        navigate(`/maintenanceList/${maintenanceType}`);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }
  function closeDialogBox() {
    setOpen(false);
  }

  useEffect(() => {
    fetchAllCompanyList();
  }, []);
  function addToMaintenanceInventory() {
    console.log(replacedDevice, replacedDeviceBy);
    if (maintenanceType == "replace") {
      let data = {
        originalImei: replacedDevice,
        replacedByImei: replacedDeviceBy,
      };
      setSelectedDeviceList((pre) => {
        console.log([...pre, data]);
        return [...pre, data];
      });
    } else {
      const arr = replacedDevice.map((ele) => {
        return {
          originalImei: ele,
          replacedByImei: replacedDeviceBy,
        };
      });
      setSelectedDeviceList((pre) => {
        console.log([...pre, ...arr]);
        return [...pre, ...arr];
      });
    }

    // console.log(data);

    setOpen(false);
  }

  function removeFromMaintenanceList(index) {
    const arr = [...selectedDeviceList];
    arr.splice(index, 1);
    setSelectedDeviceList(arr);
  }

  return (
    <div className="main_container">
      <Box className="main">
        <LoadingComponent isLoading={loading} />

        <TopView topViewData={topViewData} />
        <MaintenanceModal
          open={open}
          setOpen={setOpen}
          maintenanceType={maintenanceType}
          closeDialogBox={closeDialogBox}
          clientList={clientList}
          setClient={setClient}
          client={client}
          debouncedFuntion1={debouncedFuntion1}
          selectedDeviceHandler={selectedDeviceHandler}
          searchDeviceList={searchDeviceList}
          addToMaintenanceInventory={addToMaintenanceInventory}
          replacedByDeviceList={replacedByDeviceList}
          replacedDeviceBy={replacedDeviceBy}
          replacedDevice={replacedDevice}
        />
        <div
          style={{
            position: "relative",
            right: "-1400px",
            top: "-47px",
            zIndex: 1000,
          }}
        >
          <Button variant="contained" onClick={() => setOpen(true)}>
            {`Add to ${maintenanceType}`}
          </Button>
        </div>

        <ThemeProvider theme={theme}>
          <Grid
            container
            sx={{
              marginTop: "0rem",
            }}
            rowGap={1}
          ></Grid>
          <Grid item xs={12}>
            <Paper sx={{ width: "100%", mb: 2 }} elevation={1}>
              <TableContainer component={Paper} elevation={1}>
                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "rgb(14 57 115 / 86%)" }}>
                      {TableHeadData.map((ele, index) => {
                        return (
                          <>
                            <TableCell
                              sx={{ minWidth: ele.width, color: "white" }}
                            >
                              {ele.name}
                            </TableCell>
                          </>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedDeviceList &&
                      selectedDeviceList.length > 0 &&
                      selectedDeviceList.map((item, index) => (
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
                            {item.originalImei.imeiNo
                              ? item.originalImei.imeiNo
                              : "NA"}
                          </TableCell>

                          <TableCell>
                            {item?.originalImei?.issueDate
                              ? moment(item.originalImei.issueDate).format(
                                  "DD-MM-YYYY HH:mm"
                                )
                              : "NA"}
                          </TableCell>
                          <TableCell>
                            {item.originalImei
                              ? item.originalImei.clientName
                              : "NA"}
                          </TableCell>
                          {/* <TableCell>
                            {item.packedDate
                              ? moment
                                  .utc(item?.packedDate)
                                  .format("DD/MM/YYYY hh:mm A")
                              : "NA"}
                          </TableCell> */}
                          {true && (
                            <TableCell>
                              {item?.replacedByImei?.imeiNo ?? "NA"}
                            </TableCell>
                          )}
                          <TableCell>
                            {item?.originalImei?.state?.name ?? "NA"}
                          </TableCell>

                          <TableCell>
                            {
                              <DeleteOutlineIcon
                                onClick={() => removeFromMaintenanceList(index)}
                              />
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          <Grid item container xs={12} justifyContent={"flex-end"}>
            <Grid item xs={8}></Grid>
            <Grid item xs={1}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/maintenanceList/${maintenanceType}`)}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={1}>
              <Button variant="contained" onClick={saveMaintenance}>
                Save
              </Button>
            </Grid>
          </Grid>
        </ThemeProvider>
      </Box>
    </div>
  );
}
export default AddMaintenance;
