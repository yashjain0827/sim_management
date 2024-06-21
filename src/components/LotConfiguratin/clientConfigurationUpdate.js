import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { Grid, IconButton } from "@mui/material";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { styled } from "@mui/system";
import { useEffect } from "react";
import { LotAction } from "../actions/Lot";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
};
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
    width: 320px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
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

export default function ClientConfigurationUpdate({
  open,
  setOpen,
  title,
  clientModalCommands,
  modelId,
  stateId,
  operatorId,
  providerId,
  clientId,
  checkCommandCheckListForLot

}) {
  const [commandValue, setCommandValue] = React.useState('');

  useEffect(() => {
   
    if (clientModalCommands) {
      setCommandValue(clientModalCommands[0]?.command);
    }
  }, [clientModalCommands]);

  console.log(clientModalCommands,"clientModalCommandsdcfvgbh")

  const fetchCleintUpdateCommand = () => {
    if(commandValue === "" && commandValue=== undefined && commandValue ===null){
        alert("Please Enter Your Command")
        return false
    }
    const data = {
      modelId:modelId?modelId.id:null,
      stateId:stateId?stateId?.id:null,
      operatorId:operatorId?operatorId?.id:null,
      providerId:providerId?providerId?.id:null,
      clientId:clientId?clientId?.id:null,
      userId:JSON.parse(localStorage.getItem("data"))?.id,
      command:commandValue,
      modelConfigId:clientModalCommands && clientModalCommands[0]?.id?clientModalCommands[0]?.id:null
    };

    LotAction.updateClientCommand(data).then((response) => {
      try {
        if (response !== null) {
            if(response?.responseCode === 200){
                checkCommandCheckListForLot()
                setCommandValue()
                setOpen(false)
                alert(response?.message)
            }
            else {
                alert(response?.message)  
            }
            
        } else {
            alert(response?.message)
        }
      } catch (error) {}
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* <LoadingComponent isLoading={isLoading} /> */}
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid grey",
              padding: "4px 15px",
            }}
          >
            <Typography id="modal-title" variant="h6" component="h3">
              {title}
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon sx={{ color: "red" }} />
            </IconButton>
          </Box>
          <Box style={{ padding: "10px" }}>
            <Grid>
              <Textarea
                aria-label="minimum height"
                minRows={3}
                value={commandValue}
                onChange={(e) => setCommandValue(e.target.value)}
                placeholder="Empty"
              />
            </Grid>
          </Box>

          <Box
            sx={{
              mt: 2,
              p: 2,
              display: "flex",
              justifyContent: "flex-end",
              alignContent: "flex-end",
              alignItems: "flex-end",
              gap: "10px",
            }}
          >
            <Button color="error" variant="contained" onClick={handleClose}>
              Close
            </Button>

            <Button
              color="primary"
              variant="contained"
              sx={{ color: "white" }}
             onClick={fetchCleintUpdateCommand}
            >
              Update
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
