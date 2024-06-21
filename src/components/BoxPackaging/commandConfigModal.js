import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import CustomizedSteppers from "../LotConfiguratin/CustomStepper";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function ReconfigurationCommandStepperModal({
  showTestedDeviceSaveBtn,
  saveReconfigureDevice,
  isPortConnected,
  connectDeviceWithUsbPort,
  boxNumber,
  clientModalCommands,
  open,
  setOpen,
}) {
  console.log(clientModalCommands, isPortConnected);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullScreen={true}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          <Button
            onClick={(event) => {
              console.log(event.currentTarget.textContent);
              connectDeviceWithUsbPort(event.currentTarget.textContent);
            }}
          >
            {isPortConnected ? "Start test" : "Connect Device"}
          </Button>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <CustomizedSteppers steps={clientModalCommands} />
        </DialogContent>
        <DialogActions>
          {showTestedDeviceSaveBtn && (
            // {true && (
            <Button autoFocus onClick={saveReconfigureDevice}>
              Save changes
            </Button>
          )}
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
