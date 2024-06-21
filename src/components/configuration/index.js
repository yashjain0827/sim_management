import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Swal from "sweetalert2";
import { FcPlus } from "react-icons/fc";
import { AiFillEdit } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import {
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Box,
  Autocomplete,
  Button
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ConfigModal from "./configModal";
import axios from "axios";
import { BoxPackaging } from "../actions/boxPackaging";
import Loader from "../CommonComponents/loader";
import TrialModal from "./TrailModal";
import { userService } from "../services";
import config from "../../config/config";
import ImortImeiCommand from "../ImortImeiCommand/ImportCommand";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(14 57 115 / 86%)"
    }
  }
});



const TableHeadData = [
  { name: "S.No.", width: "50px" },
  {
    name: "Name",
    minWidth: "200px"
  },
  {
    name: "State",
    minWidth: "250px"
  },
  {
    name: "Client",
    minWidth: "250px"
  },
  {
    name: "Config Command",
    minWidth: "250px"
  },
  {
    name: "Is Active",
    minWidth: "100px"
  },
  {
    name: "Action",
    minWidth: "200px",
    textAlign: "center"
  }
];

export const TextToolTip = ({ name }) => {
  return (
    <Tooltip title={<Typography>{name}</Typography>} placement="bottom-start">
      <span style={{ color: "blue", fontSize: 14, cursor: "pointer" }}>
        ...more
      </span>
    </Tooltip>
  );
};

export const Editedtext = ({ text, num }) => {
  return (
    <>
      {text && text.length > num ? (
        <span>{text.slice(0, num)} </span>
      ) : text ? (
        text
      ) : (
        "-"
      )}
      {text && text.length > num && <TextToolTip name={text} />}
    </>
  );
};

function Configuration() {
  const navigate=useNavigate()
  const [configList, setConfigList] = useState([]);
  const [updatedConfigList, setUpdatedConfigList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [state, setState] = useState(null);
  const [client, setClient] = useState(null);

  const [open, setOpen] = useState(false);
  const [openTrailModal, setOpenTrailModal] = useState(false);
  const [configDetails, setConfigDetails] = useState({
    id: null,
    name: null,
    state: null,
    client: null,
    configCommand: null
  });

  const [trailData, setTrailData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [customErrors, setCustomErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const [softwareVersion, setSoftwareVersion] = useState("");

  const [selectedValue, setSelectedValue] = React.useState("");
  const [openSoftwareVersion, setOpenSoftwareVersion] = React.useState(false);
  const [oldSoftwareVersion, setOldSoftwareVersion] = React.useState("");
  // Function to close config modal
  const closeDialogBox = () => {
    setOpen(false);
    setConfigDetails({
      name: null,
      state: null,
      client: null,
      configCommand: null
    });
    setIsEditing(false);
    setCustomErrors({});
  };

  // Function to close trail modal
  const closeTrailBox = () => setOpenTrailModal(false);

  // Function to handle config details
  const handleConfigDetails = (value, name) => {
    setConfigDetails({
      ...configDetails,
      [name]: value
    });
  };

  // funtion to validate form data
  const validateFunction = (configDetails) => {
    const { name, state, client, configCommand } = configDetails;

    let errors = {};

    if (!name) errors.name = true;
    if (!state) errors.state = true;
    if (!client) errors.client = true;
    if (!configCommand) errors.configCommand = true;

    return errors;
  };

  const updateCommand = (command, id) => {
    if (command && command.includes("HRST")) {
      command = command.replace(/HRST/g, `CNFC:${id},HRST`);
      return command;
    } else if (command && command.includes("RST")) {
      command = command.replace(/RST/g, `CNFC:${id},RST`);
      return command;
    } else return command;
  };

  // function to post form data
  const handleSubmit = async () => {
    const validateErros = validateFunction(configDetails);
    setCustomErrors(validateErros);
    if (validateErros && Object.keys(validateErros).length > 0) {
      return;
    } else {
      setLoading(true);
      setOpen(false);
      setIsEditing(false);
      var payload = {};
      payload = {
        comndName: configDetails?.name,
        command: configDetails?.configCommand,
        state: configDetails?.state,
        client: configDetails?.client,
        modifiedBy: localStorage.getItem("userID"),
        user: JSON.parse(localStorage.getItem("data"))?.name
      };

      if (isEditing) {
        payload = {
          command: configDetails?.configCommand,
          modifiedBy: localStorage.getItem("userID"),
          stateCmdMstrId: configDetails?.id || null,
          user: JSON.parse(localStorage.getItem("data"))?.name
        };
      }

      if (payload && payload?.command) {
        if (
          payload?.command.includes("RST") ||
          payload?.command.includes("HRST")
        ) {
          if (!payload?.command.includes("CNFC")) {
            payload.command = updateCommand(
              configDetails?.configCommand,
              configDetails?.state?.id
            );
          }
        }
      }

      let apiEndpoint = `${config.baseUrl}${config.apiName.configSaveUpdateDelete}`;
      const response = await userService.post(apiEndpoint, payload);

      try {
        setLoading(false);

        if (response && response.data && response?.data?.statusCode === 200) {
          alert(response?.data?.message || "Success");
        } else alert(response?.data?.message || "Something went wrong");
        getConfigList();
        setConfigDetails({
          name: null,
          state: null,
          configCommand: null,
          client: null,
          id: null
        });
      } catch (error) {
        setLoading(false);

        alert(error?.message || "Something went wrong");
        setConfigDetails({
          name: null,
          state: null,
          configCommand: null,
          client: null,
          id: null
        });
      }
    }
  };

  // Function to get configurations list
  const getConfigList = async () => {
    try {
      setLoading(true);

      let apiEndpoint = `${config.baseUrl}${config.apiName.getAllConfigCommand}`;

      const response = await userService.post(apiEndpoint, {});
      if (response && response.data && response.data.data) {
        setLoading(false);
        setUpdatedConfigList(response?.data?.data);
        setConfigList(response?.data?.data);
      } else setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  // Function to get states
  const getStateList = async () => {
    const response = await BoxPackaging.getAllStatesList();
    try {
      if (response && Array.isArray(response) && response.length > 0) {
        setStateList(response);
      } else setStateList([]);
    } catch (error) {
      alert(error.message);
      setStateList([]);
    }
  };

  // Function to get clients
  const getClientList = async () => {
    const apiEndPoint = `${config.baseUrl}${config.apiName.getCompanyList}`;
    const response = await userService.get(apiEndPoint);

    try {
      if (
        response &&
        response?.data?.responseCode === 200 &&
        response?.data?.data
      ) {
        setClientList(response.data.data);
      } else setClientList([]);
    } catch (error) {
      alert(error.message);
      setClientList([]);
    }
  };

  // Function to edit config details
  const handleEdit = (val) => {
    const { comndName, state, command, client, id } = val;

    setConfigDetails({
      name: comndName,
      state,
      configCommand: command,
      client,
      id
    });

    setOpen(true);
    setIsEditing(true);
  };

  // Function to delete config details
  const handleDelete = async (val) => {
    const result = await Swal.fire({
      title: "Are you sure you want to deactivate this configuration?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm"
    });

    if (result.isConfirmed) {
      const payload = {
        stateCmdMstrId: val.id,
        isActive: false,
        modifiedBy: localStorage.getItem("userID"),
        user: JSON.parse(localStorage.getItem("data"))?.name
      };
      setLoading(true);
      let apiEndpoint = `${config.baseUrl}${config.apiName.configSaveUpdateDelete}`;
      const response = await userService.post(apiEndpoint, payload);

      try {
        setLoading(false);

        if (response && response.data && response?.data?.statusCode === 200) {
          alert(response?.data?.message || "Success");
        } else alert(response?.data?.message || "Something went wrong");

        getConfigList();
        setConfigDetails({
          name: null,
          state: null,
          configCommand: null,
          client: null,
          id: null
        });
      } catch (error) {
        setLoading(false);

        alert(error?.message || "Something went wrong");
        setConfigDetails({
          name: null,
          state: null,
          configCommand: null,
          client: null,
          id: null
        });
      }
    }
  };

  // Function to view trail
  const viewTrail = async (val) => {
    const { configDto } = val;

    if (!configDto || configDto?.length === 0) {
      alert("No trail available");
      return;
    } else {
      setOpenTrailModal(true);
      setTrailData(configDto);
    }
  };

  // Function to filter data on the basis of state and client
  useEffect(() => {
    let filteredData = configList;

    if (
      state &&
      Object.keys(state).length > 0 &&
      client &&
      Object.keys(client).length > 0
    ) {
      filteredData =
        configList &&
        configList
          .filter((val) => val?.client?.id == client.id)
          .filter((val) => val?.state?.id == state.id);

      setUpdatedConfigList(filteredData);
    } else if (state && Object.keys(state).length > 0) {
      filteredData = configList.filter((val) => val?.state?.id === state.id);

      setUpdatedConfigList(filteredData || []);
    } else if (client && Object.keys(client).length > 0) {
      filteredData =
        configList && configList.filter((val) => val?.client?.id == client.id);

      setUpdatedConfigList(filteredData || []);
    } else setUpdatedConfigList(filteredData);
  }, [state, client]);

  //software Version Get API
  const getSoftwareVersion = async () => {
    const apiEndPoint = `${config.baseUrl}${config.apiName.getSoftwareVersion}`;
    const response = await userService.get(apiEndPoint);
    try {
      if (
        response &&
        response?.data?.responseCode === 200 &&
        response?.data?.data
      ) {
        setSoftwareVersion(response.data.data);
        setOldSoftwareVersion(response.data.data);
      } else setSoftwareVersion("");
    } catch (error) {
      alert(error.message);
      setSoftwareVersion("");
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpenSoftwareVersion(false);
  };

  const handleClickOpenSoftwareVersion = () => {
    setOpenSoftwareVersion(true);
  };
  // update the software Version
  const UpdateSoftwareVersion = () => {
    const payload = {
      softwareVersion: oldSoftwareVersion
    };
    const apiEndPoint = `${config.baseUrl}${config.apiName.updateSoftwareVersion}`;
    const response = userService.post(apiEndPoint, payload);
    try {
      if (response != null) {
        alert("Update Successfully!");
        getSoftwareVersion();
        setOpenSoftwareVersion(false);
      }
      // else{
      //     alert("Please Enter Correct Software Version.")
      // }
    } catch (error) {
      alert(error.message);
    }
  };
  const commandModalHandler=()=>{
    navigate('/imeiRequestsList')

  }
  // useEffect function to call api's on first render
  useEffect(() => {
    getConfigList();
    getClientList();
    getStateList();
    getSoftwareVersion();
  }, []);

  console.log("old", oldSoftwareVersion);
  return (
    <div className="main_container">
      <Box className="main">
        <ThemeProvider theme={theme}>
          <Grid container sx={{ marginTop: "1rem" }} rowGap={2}>
            <Grid item xs={12} container alignItems="center">
              <Grid item lg={4} md={6} sm={12} xs={12}>
                <Typography variant="h5">Configuration Master</Typography>
              </Grid>
              {/* <Grid
                item
                lg={4}
                md={6}
                sm={12}
                xs={12}
                container
                justifyContent="flex-end"
                alignItems="center"
                spacing={1}
              >
                <TextField
                  id="outlined-basic"
                  label="Software Version"
                  variant="outlined"
                  size="small"
                  value={softwareVersion || "NA"}
                  onClick={handleClickOpenSoftwareVersion}
                />
                <Dialog
                  open={openSoftwareVersion}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Update The Software Version"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        size="small"
                        placeholder="enter Software Version"
                        style={{width: "100%"}}
                        value={oldSoftwareVersion}
                        onChange={(e)=>setOldSoftwareVersion(e.target.value)}
                    />
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={()=>UpdateSoftwareVersion()} autoFocus>
                      Update
                    </Button>
                  </DialogActions>
                </Dialog>
              </Grid> */}
              <Grid
                item
                lg={8}
                md={6}
                sm={12}
                xs={12}
                container
                justifyContent="flex-end"
                alignItems="center"
                spacing={2}
              >
                {JSON.parse(localStorage.getItem("data")).showCommandConfigurator &&
                <Grid>
                  <Button onClick={commandModalHandler} sx={{color:'#fff',marginTop:'19px'}}  variant="contained">Command Configurator</Button>
                </Grid>}
                
                <Grid item>
                  <TextField
                    id="outlined-basic"
                    label="Software Version"
                    variant="outlined"
                    size="small"
                    sx={{ marginTop: "3px" }}
                    value={softwareVersion || "NA"}
                    onClick={handleClickOpenSoftwareVersion}
                  />
                  <Dialog
                    open={openSoftwareVersion}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Update The Software Version"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          size="small"
                          placeholder="enter Software Version"
                          style={{ width: "100%" }}
                          value={oldSoftwareVersion}
                          onChange={(e) =>
                            setOldSoftwareVersion(e.target.value)
                          }
                        />
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>Cancel</Button>
                      <Button onClick={() => UpdateSoftwareVersion()} autoFocus>
                        Update
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
                <Grid item>
                  <Autocomplete
                    value={state || ""}
                    options={stateList || []}
                    getOptionLabel={(option) =>
                      option.name ? option.name : ""
                    }
                    onChange={(e, newValue) => {
                      setState(newValue);
                    }}
                    sx={{ width: "200px" }}
                    size="small"
                    margin="dense"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        margin="dense"
                        label="Filter By State"
                      />
                    )}
                  />
                </Grid>

                <Grid item>
                  <Autocomplete
                    value={client || ""}
                    options={clientList || []}
                    getOptionLabel={(option) =>
                      option.companyName ? option.companyName : ""
                    }
                    onChange={(e, newValue) => {
                      setClient(newValue);
                    }}
                    sx={{ width: "200px" }}
                    size="small"
                    margin="dense"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        margin="dense"
                        label="Filter By Clients"
                      />
                    )}
                  />
                </Grid>

                <Grid item>
                  <IconButton onClick={() => setOpen(true)}>
                    <FcPlus />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ width: "100%", mb: 2 }} elevation={1}>
                <TableContainer
                  component={Paper}
                  elevation={1}
                  style={{ maxHeight: "700px", overflow: "scroll" }}
                >
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
                              textAlign: ele?.textAlign
                            }}
                          >
                            {ele.name}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {updatedConfigList &&
                        updatedConfigList.length > 0 &&
                        updatedConfigList.map((val, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{val?.comndName}</TableCell>
                            <TableCell>{val?.state?.name}</TableCell>

                            <TableCell>{val?.client?.companyName}</TableCell>

                            <TableCell>
                              <Editedtext text={val?.command} num={50} />
                            </TableCell>

                            <TableCell>
                              <Editedtext
                                text={val?.isActive ? "Yes" : "No"}
                                num={50}
                              />
                            </TableCell>

                            <TableCell>
                              <IconButton
                                disabled={
                                  val.isActive == false || !val.isActive
                                }
                                onClick={() => handleEdit(val)}
                              >
                                <AiFillEdit
                                  color={
                                    val.isActive == false || !val.isActive
                                      ? "grey"
                                      : "blue"
                                  }
                                />
                              </IconButton>
                              <IconButton
                                disabled={
                                  val.isActive == false || !val.isActive
                                }
                                onClick={() => handleDelete(val)}
                              >
                                <MdDeleteForever
                                  color={
                                    val.isActive == false || !val.isActive
                                      ? "grey"
                                      : "red"
                                  }
                                />
                              </IconButton>

                              <IconButton onClick={() => viewTrail(val)}>
                                <FaHistory color="green" size="18px" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <ConfigModal
                  open={open}
                  closeDialogBox={closeDialogBox}
                  configDetails={configDetails}
                  setConfigDetails={setConfigDetails}
                  handleConfigDetails={handleConfigDetails}
                  customErrors={customErrors}
                  setCustomErrors={setCustomErrors}
                  handleSubmit={handleSubmit}
                  stateList={stateList}
                  clientList={clientList}
                  isEditing={isEditing}
                />

                <TrialModal
                  open={openTrailModal}
                  closeTrailBox={closeTrailBox}
                  trailData={trailData}
                  setConfigDetails={setConfigDetails}
                />
               

                {loading && <Loader isOpen={loading} />}
              </Paper>
            </Grid>
          </Grid>
        </ThemeProvider>
      </Box>
    </div>
  );
}

export default Configuration;
