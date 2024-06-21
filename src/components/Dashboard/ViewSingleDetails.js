import {
  Button,
  Grid,
  TextField,
  Typography,
  Box,
  Autocomplete,
  InputAdornment
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";
import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Link from "@mui/material/Link";
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DashboardAction } from "../actions/dashboard";
import Tooltip from "@mui/material/Tooltip";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import PopupState, { bindToggle, bindPopper } from "material-ui-popup-state";
import Fade from "@mui/material/Fade";
export const CustomAutoComplete = styled(Autocomplete)(
  ({ theme, ...props }) => ({
    width: "100%",
    "& input": {
      background: props.background ? props.background : "#fff",
      borderRadius: "5px",
      padding: "11px 15px !important",
      borderLeft: props.required ? "2px solid #EF3434" : "0",
      fontSize: "13px"
    },

    "& .MuiOutlinedInput-root": {
      background: props.background ? props.background : "#fff",
      borderRadius: "5px",
      marginBottom: "0px"
    },
    "& .MuiTextField-root": {
      margin: 0
    },
    "& fieldset": {
      border: ".5"
    },
    "& label": {
      lineHeight: "initial",
      fontSize: "13px"
    },
    "& .MuiInputLabel-shrink": {
      // background: "#ffffff",
      transform: " translate(14px, -7px) scale(0.8) !important"
    },
    "& .MuiInputLabel-root": {
      transform: "translate(14px, 9px) scale(1)"
    },
    " & .MuiOutlinedInput-root": {
      padding: "0"
    }
  })
);
const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(14 57 115 / 86%)"
    }
  }
});

const ViewSingleDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [deviceDetails, setDeviceDetails] = useState([]);
  const [command, setCommand] = useState("");
  const [providePermission, setProvidePermission] = useState([]);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const permission =
    localStorage.getItem("data") && localStorage.getItem("data");
  const [commandPermission, setCommandPermission] = useState(null);

  const showCommandText = JSON.parse(
    localStorage.getItem("data")
  ).webPermissionDTOList.filter((ele) => {
    return ele.name === "SEND_DEVICE_COMMAND" && ele.forWeb;
  });

  useEffect(() => {
    if (permission) {
      const parsedPermission = JSON.parse(permission);
      setUserId(parsedPermission.id);
      setUserName(parsedPermission.name);
      if (parsedPermission.menuVisiblity) {
        setProvidePermission(parsedPermission.menuVisiblity);
      }
    }
  }, []);

  useEffect(() => {
    if (location && location.state) {
      setDeviceDetails(location?.state?.user?.userId);
    }
  }, [location]);

  const postCommandPermission = async () => {
    debugger;
    const payload = {
      command: command,
      imeiNo: deviceDetails?.imeiNo,
      userName: userName,
      userId: userId
    };
    const commandTextAPI = await DashboardAction.commandPermissionByUser(
      payload
    );
    if (commandTextAPI && commandTextAPI.status === 200) {
      alert("Command Submit Successfully!");
      navigate("/dashboard");
    } else {
      alert("Device Not Found!");
    }
  };
  console.log("ass", showCommandText);
  const TextToolTip = ({ name }) => {
    return (
      <Tooltip
        // style={{ border: "none" }}
        title={
          <Typography
          // style={{ backgroundColor: "white", color: "black" }}
          >
            {name}
          </Typography>
        }
        placement="bottom-start"
      >
        <span style={{ color: "blue", fontSize: 14, cursor: "pointer" }}>
          ...more
        </span>
      </Tooltip>
    );
  };
  const Editedtext = ({ text, num }) => {
    return (
      <div
        style={{
          border: "1.6px solid #e4dddd",
          borderRadius: "5px",
          color: "rgb(137 132 132)",
          overflowWrap: "anywhere",
          width: "225px",
          height: "45px"
          // backgroundColor: "white"
        }}
      >
        {text && text.length > num ? (
          <span>{text.slice(0, num)} </span>
        ) : text ? (
          text
        ) : (
          "-"
        )}
        {text && text.length > num && <TextToolTip name={text} />}
      </div>
    );
  };

  return (
    <div className="main_container">
      <Box className="main">
        <ThemeProvider theme={theme}>
          <Grid container sx={{ marginTop: "0rem" }} rowGap={2}>
            <Grid
              item
              xs={12}
              container
              justifyContent={"space-between"}
              flexWrap="nowrap"
              alignItems={"center"}
            >
              <Grid
                item
                xs={12}
                container
                justifyContent={"flex-start"}
                alignItems={"center"}
                spacing={1}
                sx={{ paddingTop: "0px" }}
              >
                <Grid item>
                  <Typography
                    sx={{
                      color: "rgb(14 57 115 / 86%)",
                      fontSize: "25px",
                      padding: ""
                    }}
                  >
                    <ArrowBackIcon
                      color="#1976d2"
                      sx={{
                        width: "30px",
                        padding: "0px 2px",
                        cursor: "pointer"
                      }}
                      justifyContent={"flex-start"}
                      alignItems={"center"}
                      onClick={() => navigate("/dashboard")}
                    />
                    Device Details
                    <Divider />
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              container
              justifyContent={"space-between"}
              flexWrap="nowrap"
              alignItems={"center"}
            >
              <Grid item xs={12} container sx={{ background: "" }} rowGap={2}>
                <Grid item xs={12} container rowGap={3}>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      IMEI No
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.imeiNo || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      ICCID No
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.iccidNo || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      UUID No
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.uuidNo || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Software Version
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.softwareVersion || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Created At
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={
                        deviceDetails.createdAt
                          ? moment
                              .utc(deviceDetails.createdAt)
                              .format("DD/MM/YYYY hh:mm A")
                          : "NA"
                      }
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Updated At
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={
                        deviceDetails.updatedAt
                          ? moment
                              .utc(deviceDetails.updatedAt)
                              .format("DD/MM/YYYY hh:mm A")
                          : "NA"
                      }
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Old ICCID No
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.oldIccid || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      IMEI Updated At
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.imeiUpdatedAt || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Created By
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.createdBy?.name || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Modified By
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.modifiedBy || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      State
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.state?.name || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Status
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.status || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Issue Date
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={
                        deviceDetails?.issueDate
                          ? moment
                              .utc(deviceDetails.issueDate)
                              .format("DD/MM/YYYY hh:mm A")
                          : "NA"
                      }
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Command Send
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.isCommandSend || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Command Send Date
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.commandSendDate || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Configuration Complete
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.isConfigurationComplete || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Config Done Date
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.configDoneDate || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Device Activated Date
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.deviceActivatedDate || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Last Command
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.lastCommand || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      SIM 1 Number
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.sim1Number || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      SIM 2 Number
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.sim2Number || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      SIM 1 Operator
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.sim1Operator || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      SIM 2 Operator
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.sim2Operator || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      SIM 1 Activate Date
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.sim1ActivationDate || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      SIM 1 Expiry Date
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.sim1ExpiryDate || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      SIM 2 Activation Date
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.sim2ActivationDate || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      SIM 2 Expiry Date
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.sim2ExpiryDate || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Client ID
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.clientId || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Config Activated
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.isConfigActivated || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      User Id
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.userId || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      User Name
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.userName || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      User Email
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails.userEmail || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Token
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.token || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      State Reference Key
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.stateRefKey || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Response Key
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.responseKey || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Client Name
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.clientName || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Box No
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.boxNo || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Box Code
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.boxCode || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Order Code
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.orderCode || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Order Id
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.orderId || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Client Name
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.clientNames || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Is Own Device
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.isOwnDevice || "NA"}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Request Body
                    </Typography>
                    {/* <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.requestBody || "NA"}
                      disabled
                    /> */}
                    <Editedtext text={deviceDetails?.requestBody} num={25} />
                  </Grid>
                  <Grid item xs={4}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Packet
                    </Typography>
                    {/* <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: "12rem"
                        }
                      }}
                      value={deviceDetails?.packet || "NA"}
                      disabled
                    />*/}

                    {/* <Editedtext text={deviceDetails.packet} num={50} /> */}
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      inputProps={{
                        style: {
                          width: deviceDetails?.packet ? "100rem" : "12rem"
                        }
                      }}
                      value={deviceDetails?.packet || "NA"}
                      disabled
                    />
                    {/* <Editedtext text={deviceDetails?.packet} num={50} /> */}
                    {/* <TextField
                    maxRows={2}
                    multiline={true}
                    value={deviceDetails?.packet}
                    /> */}
                  </Grid>
                </Grid>
                {showCommandText && showCommandText.length > 0 ? (
                  <>
                    <hr
                      style={{
                        border: "1.5px solid rgb(209 207 207)",
                        width: "100%"
                      }}
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={10}>
                        <Typography sx={{ color: "rgba(14, 57, 115, 0.86)" }}>
                          Enter The Command
                        </Typography>
                        <TextField
                          name="search"
                          type="text"
                          size="small"
                          variant="outlined"
                          sx={{ width: "100%" }}
                          value={command || ""}
                          onChange={(e) => setCommand(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={2} sx={{ marginTop: "22px" }}>
                        <Button
                          sx={{
                            color: "white",
                            width: "7rem",
                            height: "2.5rem"
                          }}
                          variant="contained"
                          onClick={postCommandPermission}
                        >
                          Submit
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                ) : null}
              </Grid>
            </Grid>
          </Grid>
        </ThemeProvider>
      </Box>
    </div>
  );
};

export default ViewSingleDetails;
