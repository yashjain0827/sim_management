import React from "react";
import {
  Autocomplete,
  Grid,
  Button,
  Typography,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import ClearIcon from "@mui/icons-material/Clear";

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
const MaintenanceModal = ({
  open,
  maintenanceType,
  closeDialogBox,
  //   clientList,
  client,
  setClient,
  searchDeviceList,
  configDetails,
  setConfigDetails,
  handleConfigDetails,
  customErrors,
  addToMaintenanceInventory,
  replacedByDeviceList,
  replacedDeviceBy,
  replacedDevice,
  //   handleSubmit,
  //   setCustomErrors,
  //   stateList,
  clientList,
  //   isEditing,
  debouncedFuntion1,
  selectedDeviceHandler,
}) => {
  console.log(searchDeviceList, replacedByDeviceList);
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      //   maxWidth="sm"
      style={{ width: "500px", height: "600px", margin: "auto" }}
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Typography variant="h6">{`${maintenanceType} Details`}</Typography>

        <IconButton onClick={() => closeDialogBox()}>
          <ClearIcon sx={{ cursor: "pointer" }} />
        </IconButton>
      </DialogTitle>
      <Divider style={{ marginTop: "2%" }} />
      <DialogContent>
        <Grid container>
          <Grid item xs={12} marginTop={2}>
            <Autocomplete
              value={client}
              //   disabled={isEditing}
              options={clientList || []}
              getOptionLabel={(option) =>
                option.companyName ? option.companyName : ""
              }
              onChange={(e, newValue) => {
                setClient(newValue);
              }}
              //   style={{ width: 350 }}
              //   required={true}
              //   size="small"
              //   margin="dense"
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  required={true}
                  margin="dense"
                  label="Select Client"
                  placeholder="Issued Device Client"
                  //   error={customErrors.state}
                  //   onBlur={() => {
                  //     configDetails?.state
                  //       ? setCustomErrors({ ...customErrors, state: false })
                  //       : setCustomErrors({ ...customErrors, state: true });
                  //   }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} marginTop={2}>
            <CustomAutoComplete
              // disablePortal
              //   multiple
              multiple={maintenanceType != "replace" && true}
              id="combo-box-demo"
              options={
                searchDeviceList && searchDeviceList.length > 0
                  ? searchDeviceList
                  : []
              }
              // value={lastOnline || {}}
              fullWidth
              getOptionLabel={({ imeiNo }) => (imeiNo ? imeiNo : "")}
              onChange={(e, newValue) =>
                selectedDeviceHandler(newValue, "replaced")
              }
              //   sx={{ width: 220 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputLabelProps={{ shrink: true }}
                  label="Search Devices..."
                  //   sx={{ top: "-50px", left: "19.5rem", zIndex: "100" }}
                  placeholder={`select device to be ${maintenanceType}`}
                  onChange={(e) =>
                    debouncedFuntion1(e.target.value, "replaced")
                  }
                />
              )}
            />
          </Grid>
          {maintenanceType == "replace" && (
            <Grid item xs={12} marginTop={2}>
              <CustomAutoComplete
                // disablePortal
                id="combo-box-demo1"
                options={
                  replacedByDeviceList && replacedByDeviceList.length > 0
                    ? replacedByDeviceList
                    : []
                }
                // value={lastOnline || {}}
                fullWidth
                getOptionLabel={({ imeiNo }) => (imeiNo ? imeiNo : "")}
                onChange={(e, newValue) =>
                  selectedDeviceHandler(newValue, "replacedBy")
                }
                //   sx={{ width: 220 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    label="Search Devices..."
                    //   sx={{ top: "-50px", left: "19.5rem", zIndex: "100" }}
                    placeholder="select Replaced Device"
                    onChange={(e) =>
                      debouncedFuntion1(e.target.value, "replacedBy")
                    }
                  />
                )}
              />
            </Grid>
          )}

          {/* 
          <Grid item xs={12} marginTop={2}>
            <TextField
              multiline
              minRows={1}
              label="Command"
              style={{ width: 350 }}
              variant="outlined"
              fullWidth
              size="small"
              margin="dense"
              required={true}
              value={configDetails?.configCommand || ""}
              onChange={(e) =>
                handleConfigDetails(e.target.value, "configCommand")
              }
              error={customErrors.configCommand}
              onBlur={() => {
                configDetails?.configCommand
                  ? setCustomErrors({ ...customErrors, name: false })
                  : setCustomErrors({ ...customErrors, name: true });
                setConfigDetails({
                  ...configDetails,
                  configCommand: configDetails?.configCommand
                    ?.replace(/\s+/g, " ")
                    .trim(),
                });
              }}
            />
          </Grid> */}
        </Grid>
      </DialogContent>
      <Divider style={{ marginTop: "2%" }} />
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          sx={{ color: "white" }}
          onClick={addToMaintenanceInventory}
        >
          {"Add"}
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={closeDialogBox}
          autoFocus
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MaintenanceModal;
