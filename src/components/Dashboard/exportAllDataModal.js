import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
// import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

const style = {
  position: "relative",
  top: "33%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: "auto",
  bgcolor: "background.paper",
  border: "2px solid #ccc",
  boxShadow: 24,
  borderRadius: 3,

  padding: 2,
};

function ExportAllDataModal({ open, setAllExportModalOpen, fetchData }) {
  const [email, setEmail] = React.useState();

  const handleClose = () => {
    setEmail("");
    setAllExportModalOpen(false);
  };
  return (
    <>
      <div>
        {/* <Button onClick={handleOpen}>Open modal</Button> */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              xs={12}
              alignItems="center"
              // style={{ borderBottom: "1px solid grey" }}
              spacing={3}
            >
              <Grid item>
                <h4>Get All devices data on Email</h4>
              </Grid>
              <Grid item>
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Divider component="div" />

            <Grid container spacing={2} sx={{ padding: "7px 0px" }}>
              <Grid item xs={6}>
                <Typography
                // className="font14 greyfirstheading"
                // gutterBottom
                // variant="subtitle1"
                // style={{ margin: "5px 0" }}
                >
                  Email Id *
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography style={{ width: "100%" }}>
                  <input
                    style={{ padding: "10px 5px", borderRadius: "5px" }}
                    className="w-100"
                    type="email"
                    variant="outlined"
                    placeholder="Enter your Email ID"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </Typography>
              </Grid>
            </Grid>
            <Divider component="div" />

            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              spacing={2}
            >
              <Grid item>
                <Button
                  className="bg-success text-white px-3"
                  style={{ margin: "10px 0" }}
                  onClick={() => {
                    fetchData(email);
                    setAllExportModalOpen(false);
                    setEmail("");
                  }}
                >
                  Submit
                </Button>
              </Grid>
              <Grid item>
                <Button
                  className=" text-white px-3"
                  style={{
                    margin: "10px 0",
                    background: "#ff0000bd",
                    color: "white",
                  }}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </div>
    </>
  );
}

export default ExportAllDataModal;
