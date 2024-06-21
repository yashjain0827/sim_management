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
  TextareaAutosize,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { styled } from "@mui/system";
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
const blue = {
  100: "#DAECFF",
  200: "#b6daff",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};
const Textarea = styled(BaseTextareaAutosize)(
  ({ theme }) => `
  box-sizing: border-box;
  width: 560px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 12px;
  border-radius: 12px 12px 0 12px;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${
    theme.palette.mode === "dark" ? grey[900] : grey[50]
  };

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    outline: 0;
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${
      theme.palette.mode === "dark" ? blue[600] : blue[200]
    };
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);

const ReconfigurationModal = ({
  open,
  closeDialogBox,
  handleSubmit,
  boxNumber,
  setBoxNumber,
  command,
  setCommand,
  stateHandler,
  state,
  setState,
  stateList,
  simProviderList,
  simProvider,
  setSimProvider,
}) => {
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="sm"
      style={{ maxWidth: "1200px", margin: "auto" }}
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Typography variant="h6">Reconfiguration</Typography>

        <IconButton onClick={() => closeDialogBox()}>
          <ClearIcon sx={{ cursor: "pointer" }} />
        </IconButton>
      </DialogTitle>
      <Divider style={{ marginTop: "2%" }} />
      <DialogContent>
        <Grid container rowGap={1}>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <Grid>
              <Typography>State*</Typography>
            </Grid>
            <CustomAutoComplete
              disablePortal
              id="combo-box-demo"
              options={stateList ? stateList : []}
              value={state}
              getOptionLabel={({ name }) => {
                return name;
              }}
              onChange={(e, newValue) => stateHandler(newValue)}
              // sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Select State" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{}}>Sim Provider*</Typography>
            <CustomAutoComplete
              disablePortal
              id="combo-box-demo"
              options={simProviderList || []}
              value={simProvider}
              getOptionLabel={({ name }) => {
                return name || "";
              }}
              onChange={(e, newValue) => setSimProvider(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  // error={errors.state}
                  // helperText={errors.state}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <Grid
            //   style={{
            //     display: "flex",
            //     justifyContent: "flex-start",
            //     alignContent: "center",
            //     alignItems: "center",
            //     gap: "10px",
            //   }}
            >
              <Grid>
                <Typography>Command*</Typography>
              </Grid>
              <Textarea
                minRows={3}
                placeholder={"Enter Your Command"}
                value={command}
                onChange={(e) => setCommand(e.target.value)}
              />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid>
              <Typography>Box Number</Typography>
            </Grid>
            <TextField
              label="Box Number"
              // style={{ width: 350 }}
              variant="outlined"
              fullWidth
              size="small"
              margin="dense"
              value={boxNumber}
              onChange={(e) => setBoxNumber(e.target.value)}
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
          Save
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

export default ReconfigurationModal;
