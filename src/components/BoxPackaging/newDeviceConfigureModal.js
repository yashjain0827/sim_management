import React, { useState, useRef } from "react";
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
import { BoxPackaging } from "../actions/boxPackaging";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
    width: 600,
    overflow: "hidden",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    display: "block",
    whiteSpace: "pre-wrap",
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const NewDeviceConfigData = ({
  open,
  setOpen,

  handleSubmit,
  boxNumber,
  setBoxNumber,
  command,
  setCommand,
  stateHandler,
  state,
  setState,
  stateList,
  deviceNumber,
  setDeviceNumber,
  getDeviceDataHandler,
}) => {
  const scannerTimeoutId = useRef(null);
  async function addDeviceToBox(searchTerm) {
    try {
      let data = {
        search: searchTerm,
        // id: +createdBoxId,
        createdById: JSON.parse(localStorage.getItem("data")).id,
      };

      const response = await BoxPackaging.addDeviceToBox(data);
      //   if (response.responseCode == 200) {
      //     setDevicesList((pre) => {
      //       if (pre.length == 0) {
      //         return [response.data];
      //       } else {
      //         return [response.data, ...pre];
      //       }
      //     });
      //   } else {
      //     alert(response.message);
      //   }
      setDeviceNumber("");
      document.getElementById("deviceNumber").focus();
    } catch (err) {
      console.log(err);
    }
  }
  function searchDevice(getData, delay) {
    // console.log(searchTerm);
    const that = this;
    let latestArgs;

    // console.log(timer);
    return (...args) => {
      debugger;
      latestArgs = args;
      // setSearchKeyword(...args);
      console.log(scannerTimeoutId.current);
      if (scannerTimeoutId.current) {
        // alert("on");
        clearTimeout(scannerTimeoutId.current);
      }
      scannerTimeoutId.current = setTimeout(() => {
        debugger;
        getData.apply(that, latestArgs);
      }, delay);
    };
  }

  const debounceHandler = searchDevice(addDeviceToBox, 500);
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="sm"
      style={{ maxWidth: "1200px", minWidth: "600px", margin: "auto" }}
      onClose={() => setOpen(false)}
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Typography variant="h6">Add device manually</Typography>

        <IconButton onClick={() => setOpen()}>
          <ClearIcon sx={{ cursor: "pointer" }} />
        </IconButton>
      </DialogTitle>
      <Divider style={{ marginTop: "2%" }} />
      <DialogContent>
        <Grid container spacing={1} alignItems={"center"}>
          <Grid item>
            <Grid>
              <Typography>Imei/ccid number</Typography>
            </Grid>

            <TextField
              name="deviceNumber"
              type="text"
              //   label="ToDate"
              id="deviceNumber"
              size="small"
              variant="outlined"
              value={deviceNumber}
              fullWidth
              InputLabelProps={{ shrink: true }}
              //   value={toDate}
              inputProps={{
                style: {
                  width: "350px",
                },
              }}
              onChange={(e) => {
                // setDeviceNumber(e.target.value);
                // debounceHandler(e.target.value);
                setDeviceNumber(e.target.value);
              }}
              placeholder="Device Detail"
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              sx={{ marginTop: "20px" }}
              onClick={getDeviceDataHandler}
            >
              get data
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider style={{ marginTop: "2%" }} />
      <DialogActions>
        {/* <Button
          color="primary"
          variant="contained"
          sx={{ color: "white" }}
          onClick={handleSubmit}
        >
          Save
        </Button>
        <Button color="error" variant="contained" onClick={setOpen} autoFocus>
          Cancel
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default NewDeviceConfigData;
