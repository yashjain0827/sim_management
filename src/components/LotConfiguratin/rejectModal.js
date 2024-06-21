import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { TextareaAutosize } from "@mui/material";

export default function RejectModal({
  open,
  setOpen,
  rejectHandler,
  rejectRemark,
  setRejectRemark,
}) {
  //   const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        //   sx={{width:"400px"}}
        open={open}
        onClose={handleClose}
        // PaperProps={{
        //   component: 'form',
        //   onSubmit: (event) => {
        //     event.preventDefault();
        //     rejectHandler(rejectRemark);

        //     handleClose();
        //   },
        // }}
      >
        <DialogTitle>Reject Device</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the reason for rejection</DialogContentText>
          <div style={{ width: "400px" }}>
            <TextareaAutosize
              sx={{ width: 400, fontSize: "1.1rem" }}
              autoFocus
              required
              // margin="dense"
              id="name"
              name="email"
              minRows={5}
              label="Enter the reason"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setRejectRemark(e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              rejectHandler(rejectRemark);
            }}
          >
            Submit Remark
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
