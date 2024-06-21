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
  Typography,
} from "@mui/material";
import { VersionAction } from "../actions/version";
import { styled } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Delete } from "@mui/icons-material";
import { getValue } from "@testing-library/user-event/dist/utils";

const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(14 57 115 / 86%)",
    },
  },
});
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
const UpdateVersion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let deviceList = location && location.state ? location.state.devices : [];
  console.log(deviceList);
  const [loading, setLoading] = useState(false);
  const [versionList, setVersionList] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState("");
  const [tableData, setTableData] = useState(deviceList || []);
  const [command, setCommand] = useState("");
  let topViewData = {
    pageTitle: `Update_version`,
    /* ================= */
    addText: `Update_version`,
    // hideAddButton: !webPermission.includes("ADD_COMPANY"),
    hideAddButton: false,
    // createBoxPermission && createBoxPermission.length > 0 ? false : true,
    addClick: "/VersionDashboard",
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

  async function fetchVersionList() {
    try {
      const response = await VersionAction.getAllVersion();
      console.log(response);
      if (response) {
        setVersionList(response.data);
      } else {
        setVersionList([]);
      }
    } catch (err) {
      console.log(err);
      setVersionList([]);
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
      name: "software version",
      width: "100px",
      isVisible: true,
    },
    {
      name: "Action",
      width: "150px",
      isVisible: true,
    },
  ];
  useEffect(() => {
    fetchVersionList();
  }, []);

  async function updateVersionHandler() {
    debugger;
    setLoading(true);
    const devices = [...new Set([...tableData].map((ele) => ele.imeiNo))];
    if (Object.keys(selectedVersion).length < 1) {
      alert("please select the software version");
      setLoading(false);
      return;
    } else if (devices && devices.length < 1) {
      alert("please select the Device");
      setLoading(false);
      return;
    }
    console.log(devices);
    let data = {
      imeiList: devices,
      command: selectedVersion.command,
      createdBy: JSON.parse(localStorage.getItem("data")).id,
      softwareVersion: selectedVersion.softwareVersion,
    };

    const res = await VersionAction.updateVersion(data);
    console.log(res.responseCode);

    if (res.responseCode == 200) {
      setLoading(false);
      navigate("/versionRequest");
    } else {
      setLoading(false);
      alert(res.message);
      console.log(res.message);
    }
  }

  function removeFromList(data, index) {
    debugger;
    setTableData((pre) => {
      const a1 = pre.filter((ele) => {
        return ele.id !== data.id;
      });
      deviceList = a1;
      return a1;
    });
    // deviceList = [...deviceList].filter((ele) => {
    //   return ele.id !== data.id;
    // });
  }
  function getVersion(newValue) {
    if (newValue) {
      setCommand(newValue.command);
      setSelectedVersion(newValue);
    } else {
      setCommand({});
      setSelectedVersion({});
    }
  }

  return (
    <div className="main_container">
      <Box className="main">
        <LoadingComponent isLoading={loading} />

        <ThemeProvider theme={theme}>
          <TopView topViewData={topViewData} />

          <Grid
            container
            alignItems={"center"}
            spacing={0}
            sx={{ height: "30px", marginTop: "5px" }}
          >
            <Grid item xs={2}>
              <CustomAutoComplete
                disablePortal
                id="combo-box-demo"
                options={versionList ? versionList : []}
                value={selectedVersion || {}}
                fullWidth
                getOptionLabel={({ softwareVersion }) =>
                  softwareVersion ? softwareVersion : ""
                }
                onChange={(e, newValue) => {
                  getVersion(newValue);
                }}
                sx={{ width: 220 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    label="Select Software Version"
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <p
                style={{
                  // background: "blue",
                  borderRadius: 5,
                  textAlign: "center",
                  height: 30,
                  fontSize: "1.3rem",
                  fontWeight: 700,
                }}
              >
                {`Command: ${Object.keys(command).length > 0 ? command : ""}`}
              </p>
            </Grid>
          </Grid>

          <Grid container sx={{ marginTop: "2rem" }} rowGap={1}>
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
                            <TableRow>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{ele.imeiNo}</TableCell>
                              <TableCell>{ele.createdAt}</TableCell>{" "}
                              <TableCell>{ele.clientName}</TableCell>{" "}
                              <TableCell>{ele.softwareVersion}</TableCell>{" "}
                              <TableCell
                                onClick={() => removeFromList(ele, index)}
                              >
                                <Delete></Delete>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
          <Grid container direction={"row-reverse"}>
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => navigate("/versionRequest")}
              >
                Cancel
              </Button>
              <Button variant="contained" onClick={updateVersionHandler}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </ThemeProvider>
      </Box>
    </div>
  );
};

export default UpdateVersion;
