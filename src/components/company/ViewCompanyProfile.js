import {
  Button,
  Grid,
  TextField,
  Typography,
  Box,
  Autocomplete,
  InputAdornment,
  Checkbox,
  Paper,
  IconButton,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { companyAction } from "./companyFetchData";
import Divider from "@mui/material/Divider";
import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Link from "@mui/material/Link";
import { BoxPackaging } from "../actions/boxPackaging";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";

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
const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(14 57 115 / 86%)",
    },
  },
});

function ViewCompanyProfile() {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [companyName, setCompanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState(null);
  const [convertedUrl, setConvertedUrl] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [PanNumber, setPanNumber] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [GSTNumber, setGSTNumber] = useState("");
  const [isOwn, setIsOwn] = useState(false);
  const [state, setState] = useState("");
  const [stateGstList, setStateGstList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const getCompanyDataById = async (id) => {
    if (!id) {
      return;
    }
    try {
      const apiResponse = await companyAction.getCompanyById(id);
      if (apiResponse && apiResponse.status === 200 && apiResponse.data) {
        const {
          id,
          companyName,
          companyLogo,
          companyAddress,
          phoneNumber,
          email,
          state,
          city,
          companyCode,
          panNumber,
          gstNumber,
          isOwn,
        } = apiResponse.data;
        setStateGstList(apiResponse?.data?.clientStateGstMapping ?? []);
        setUserId(id);
        setCompanyName(companyName);
        setConvertedUrl(companyLogo);
        setAddress(companyAddress);
        setContactNumber(phoneNumber);
        setEmail(email);
        setState(state ? state.name : "");
        setCity(city);
        setCompanyCode(companyCode);
        setPanNumber(panNumber);
        setCompanyLogo(companyLogo);
        setGSTNumber(gstNumber);
        setIsOwn(isOwn);
        setPreviewImage(companyLogo);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (location && location.state && location.state.id) {
      const companyId = location.state.id;
      getCompanyDataById(location?.state?.id);
    }
  }, [location]);

  const cancelAddProfile = () => {
    navigate("/CompanyList");
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
                      padding: "",
                    }}
                  >
                    Client Profile
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
                <Grid item xs={8} container rowGap={3}>
                  <Grid container spacing={4}>
                    <Grid item>
                      <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                        Client Name<span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        name="search"
                        type="text"
                        size="small"
                        variant="outlined"
                        inputProps={{
                          style: {
                            width: "12rem",
                          },
                        }}
                        value={companyName || "NA"}
                        disabled
                      />
                      {/* {errors.companyName && <p style={{color: "red"}}>{errors.companyName}</p>} */}
                    </Grid>
                    {/* <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Client Logo<span style={{ color: "red" }}>*</span>
                    </Typography>
                    <a
                      href={convertedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <TextField
                        sx={{ width: "220px" }}
                        id="logo"
                        size="small"
                        type="string"
                        margin="dense"
                        variant="outlined"
                        value={convertedUrl || "NA"}
                        readOnly
                        disabled
                        title={companyName + " logo"}
                      />
                    </a>
                  </Grid> */}
                    <Grid item>
                      <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                        Client Address<span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        name="search"
                        type="text"
                        size="small"
                        variant="outlined"
                        inputProps={{
                          style: {
                            width: "12rem",
                          },
                        }}
                        value={address || "NA"}
                        disabled
                      />
                    </Grid>
                    <Grid item>
                      <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                        Contact Number<span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        name="search"
                        type="text"
                        size="small"
                        variant="outlined"
                        inputProps={{
                          style: {
                            width: "12rem",
                          },
                        }}
                        value={contactNumber || "NA"}
                        disabled
                      />
                    </Grid>
                    <Grid item>
                      <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                        Email Address<span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        name="search"
                        type="text"
                        size="small"
                        variant="outlined"
                        inputProps={{
                          style: {
                            width: "12rem",
                          },
                        }}
                        value={email || "NA"}
                        disabled
                      />
                    </Grid>
                    <Grid item>
                      <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                        State<span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        name="search"
                        type="text"
                        size="small"
                        variant="outlined"
                        inputProps={{
                          style: {
                            width: "12rem",
                          },
                        }}
                        value={state || "NA"}
                        disabled
                      />
                    </Grid>
                    <Grid item>
                      <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                        City<span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        name="search"
                        type="text"
                        size="small"
                        variant="outlined"
                        inputProps={{
                          style: {
                            width: "12rem",
                          },
                        }}
                        value={city || "NA"}
                        disabled
                      />
                    </Grid>
                    <Grid item>
                      <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                        Client Code
                      </Typography>
                      <TextField
                        name="search"
                        type="text"
                        size="small"
                        variant="outlined"
                        inputProps={{
                          style: {
                            width: "12rem",
                          },
                        }}
                        value={companyCode || "NA"}
                        disabled
                      />
                    </Grid>
                    <Grid item>
                      <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                        PAN Card Number
                      </Typography>
                      <TextField
                        name="search"
                        type="text"
                        size="small"
                        variant="outlined"
                        inputProps={{
                          style: {
                            width: "12rem",
                          },
                        }}
                        value={PanNumber || "NA"}
                        disabled
                      />
                    </Grid>
                    <Grid item>
                      <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                        GST Number
                      </Typography>
                      <TextField
                        name="search"
                        type="text"
                        size="small"
                        variant="outlined"
                        inputProps={{
                          style: {
                            width: "12rem",
                          },
                        }}
                        value={GSTNumber || "NA"}
                        disabled
                      />
                    </Grid>

                    <Grid item>
                      <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                        is Owned
                      </Typography>
                      <Checkbox checked={isOwn} disabled />
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper elevation={2} sx={{ padding: 2 }}>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          backgroundColor: "rgb(14 57 115 / 86%)",
                          color: "#fff",
                          padding: "5px 8px",
                          fontSize: "1.1rem",
                          borderRadius: 1,
                          marginBottom: "10px",
                        }}
                      >
                        <Typography>State & GST Details</Typography>
                      </Grid>

                      <Grid item xs={12} sx={{ marginTop: "10px" }}>
                        <Paper sx={{ width: "100%", mb: 2 }} elevation={1}>
                          <TableContainer component={Paper} elevation={1}>
                            <Table
                              size="small"
                              aria-label="a dense table"
                              justifyContent={"center"}
                              alignItems="center"
                            >
                              <TableHead>
                                <TableRow
                                  sx={{
                                    backgroundColor: "rgb(14 57 115 / 86%)",
                                  }}
                                >
                                  <TableCell
                                    key={1}
                                    sx={{
                                      // minWidth: ele.width,
                                      color: "white",
                                      textAlign: "center",
                                    }}
                                  >
                                    {"S No."}
                                  </TableCell>
                                  <TableCell
                                    key={2}
                                    sx={{
                                      // minWidth: ele.width,
                                      color: "white",
                                      textAlign: "center",
                                    }}
                                  >
                                    {"State"}
                                  </TableCell>
                                  <TableCell
                                    key={3}
                                    sx={{
                                      // minWidth: ele.width,
                                      color: "white",
                                      textAlign: "center",
                                    }}
                                  >
                                    {"GST number"}
                                  </TableCell>
                                  {/* <TableCell
                                    key={"Action"}
                                    sx={{
                                      // minWidth: ele.width,
                                      color: "white",
                                      textAlign: "center",
                                    }}
                                  >
                                    {"Action"}
                                  </TableCell> */}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {stateGstList.length > 0 &&
                                  stateGstList.map((user, index, array) => {
                                    console.log(array);
                                    return (
                                      <TableRow key={user.id}>
                                        <TableCell sx={{ textAlign: "center" }}>
                                          {index + 1}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: "center" }}>
                                          {user?.stateId?.name ?? "NA"}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: "center" }}>
                                          {user?.gst ?? "NA"}
                                        </TableCell>
                                        {/* <TableCell sx={{ textAlign: "center" }}>
                                          <IconButton
                                            aria-label="delete"
                                            // onClick={() => {
                                            //   updateGstNumberHandler(user);
                                            // }}
                                          >
                                            <DeleteIcon />
                                          </IconButton>
                                        </TableCell> */}
                                      </TableRow>
                                    );
                                  })}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Paper>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>

                <Grid item xs={4}>
                  <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                    Client Logo<span style={{ color: "red" }}>*</span>
                  </Typography>

                  {true && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{ maxWidth: "220px", marginTop: "10px" }}
                    />
                  )}
                </Grid>
                {/* yutytuytuyt */}
                <Grid
                  item
                  xs={12}
                  container
                  direction={"row-reverse"}
                  columnGap={2}
                >
                  <Grid item>
                    <Button
                      sx={{ color: "white", width: "12rem", height: "2.7rem" }}
                      variant="contained"
                      onClick={cancelAddProfile}
                    >
                      Go To Clients Lists
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </ThemeProvider>
      </Box>
    </div>
  );
}

export default ViewCompanyProfile;
