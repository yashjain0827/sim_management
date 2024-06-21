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
import ClearIcon from "@mui/icons-material/Clear";

const ConfigModal = ({
  open,
  closeDialogBox,
  configDetails,
  setConfigDetails,
  handleConfigDetails,
  customErrors,
  handleSubmit,
  setCustomErrors,
  stateList,
  clientList,
  isEditing,
}) => {
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="sm"
      style={{ width: "450px", margin: "auto" }}
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Typography variant="h6">Configuration Details</Typography>

        <IconButton onClick={() => closeDialogBox()}>
          <ClearIcon sx={{ cursor: "pointer" }} />
        </IconButton>
      </DialogTitle>
      <Divider style={{ marginTop: "2%" }} />
      <DialogContent>
        <Grid container>
          <Grid item xs={12}>
            <TextField
              label="Name"
              style={{ width: 350 }}
              variant="outlined"
              fullWidth
              size="small"
              margin="dense"
              required={true}
              value={configDetails?.name || ""}
              onChange={(e) => handleConfigDetails(e.target.value, "name")}
              error={customErrors.name}
              onBlur={() => {
                configDetails?.name
                  ? setCustomErrors({ ...customErrors, name: false })
                  : setCustomErrors({ ...customErrors, name: true });

                setConfigDetails({
                  ...configDetails,
                  name: configDetails?.name?.replace(/\s+/g, " ").trim(),
                });
              }}
              disabled={isEditing}
            />
          </Grid>

          <Grid item xs={12} marginTop={2}>
            <Autocomplete
              value={configDetails?.state || ""}
              disabled={isEditing}
              options={stateList || []}
              getOptionLabel={(option) => (option.name ? option.name : "")}
              onChange={(e, newValue) => {
                handleConfigDetails(newValue, "state");
              }}
              style={{ width: 350 }}
              required={true}
              size="small"
              margin="dense"
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  required={true}
                  margin="dense"
                  label="State"
                  error={customErrors.state}
                  onBlur={() => {
                    configDetails?.state
                      ? setCustomErrors({ ...customErrors, state: false })
                      : setCustomErrors({ ...customErrors, state: true });
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} marginTop={2}>
            <Autocomplete
              disabled={isEditing}
              value={configDetails?.client || ""}
              options={clientList || []}
              required={true}
              getOptionLabel={(option) =>
                option.companyName ? option.companyName : ""
              }
              onChange={(e, newValue) => {
                handleConfigDetails(newValue, "client");
              }}
              style={{ width: 350 }}
              size="small"
              margin="dense"
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  required={true}
                  margin="dense"
                  label="Client"
                  error={customErrors.client}
                  onBlur={() => {
                    configDetails?.client
                      ? setCustomErrors({ ...customErrors, client: false })
                      : setCustomErrors({ ...customErrors, client: true });
                  }}
                />
              )}
            />
          </Grid>

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
          </Grid>
        </Grid>
      </DialogContent>
      <Divider style={{ marginTop: "2%" }} />
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          sx={{ color: "white" }}
          onClick={handleSubmit}
        >
          {isEditing ? "Update" : "Add"}
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

export default ConfigModal;
