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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
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
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationDialog from "../CommonComponents/confirmationDialog";
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

function CompanyProfile() {
  let counter = 0;
  console.log(counter);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isadding, setIsAdding] = useState(false);
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
  const [stateList, setStateList] = useState([]);
  const [state, setState] = useState(null);
  const [companyCodeList, setCompanyCodeList] = useState([]);
  const [clientPoc, setClientPoc] = useState("");
  const [clientOwner, setClientOwner] = useState("");
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [selectedDeleteRow, setSelectedDeleteRow] = useState();
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({
    companyName: "",
    companyLogo: "",
    address: "",
    contactNumber: "",
    email: "",
    state: "",
    city: "",
    panNumber: "",
    gstNumber: "",
  });
  const [stateGstList, setStateGstList] = useState([]);

  async function getCompanies() {
    const response = await companyAction.getCompanyList();
    if (response !== null) {
      const companyCodeList = response.data.map((ele) => {
        return ele.companyCode;
      });
      setCompanyCodeList(companyCodeList);
    } else {
      console.log("error");
    }
  }
  useEffect(() => {
    // getCompanies();
  }, []);
  console.log("state", state);

  const getAllStates = () => {
    BoxPackaging.getAllStatesList()
      .then((res) => {
        if (res != null) {
          setStateList(res);
        } else {
          setStateList([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    setCompanyLogo(file?.name);
    if (file) {
      const formData = new FormData();
      formData.append("token", "staging");
      formData.append("files[0]", file);
      try {
        const response = await axios.post(
          "https://storage.nyggs.com/setmedia/api/save/file",
          formData
        );
        if (
          response &&
          response.data &&
          response.data.responseCode === 200 &&
          response.data.data
        ) {
          console.log("url", response?.data?.data?.fileUrls);
          setConvertedUrl(response?.data?.data?.fileUrls);
          setPreviewImage(response?.data?.data?.fileUrls);
          document.getElementById("logo").value = null;
        }
      } catch (error) {
        console.log("error:", error);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    debugger;
    if (stateGstList.length == 0) {
      alert("Please Enter atleast one State and it's respective gst number!");
      return;
    }

    const stateGstList1 =
      stateGstList &&
      stateGstList.length > 0 &&
      stateGstList.map((ele) => {
        return {
          stateId: ele?.stateId?.id ?? null,
          gst: ele?.gst ?? "",
        };
      });

    // const existingCode = companyCodeList.filter((ele) => {
    //   return ele === companyCode;
    // });
    // if (!isUpdating && existingCode.length > 0) {
    //   alert("this company code already exist!");
    //   return;
    // }

    const payload = {
      companyName: companyName || null,
      companyAddress: address || null,
      // state: state ? state.id : null,
      city: city || null,
      email: email,
      phoneNumber: contactNumber,
      panNumber: PanNumber,
      companyLogo:
        convertedUrl && Array.isArray(convertedUrl) && convertedUrl.length > 0
          ? convertedUrl[0]
          : null,
      companyCode: companyCode || null,
      clientOwner: clientOwner || "",
      clientPOC: clientPoc || "",
      id: location?.state?.id ?? null,
      userId: JSON.parse(localStorage.getItem("data")).id,
      // gstNumber: GSTNumber || null,
      isOwn,
      stateGstList: stateGstList1,
    };
    console.log(payload.companyLogo);
    // Reset errors object
    const newErrors = {
      companyName: "",
      companyLogo: "",
      address: "",
      contactNumber: "",
      email: "",

      city: "",
      panNumber: "",
    };
    if (!companyName) {
      newErrors.companyName = "Company name is required";
    }
    if (!convertedUrl) {
      newErrors.companyLogo =
        "Company logo is required in only JPG, PNG, JPEG, JPG files";
    }

    if (!address) {
      newErrors.address = "Address is required";
    }
    console.log(contactNumber);
    if (
      !contactNumber ||
      contactNumber === null ||
      contactNumber === undefined
    ) {
      newErrors.contactNumber = "Contact number is required";
    } else if (contactNumber.length > 10) {
      newErrors.contactNumber = "Contact number should be 10 digits";
    }

    if (!email) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Invalid email address";
    }

    console.log("validating email", state);

    // if (!state) {
    //   newErrors.state = "Please select a state";
    // }

    if (!city) {
      newErrors.city = "City is required";
    }

    if (!PanNumber) {
      newErrors.panNumber = "Pan number is required";
    } else if (!/^([A-Z]{5}[0-9]{4}[A-Z]{1})$/.test(PanNumber.trim())) {
      newErrors.panNumber = "Invalid pan number";
    }
    // if (!state) {
    //   newErrors.state = "Please select a state";
    // }
    // if (!GSTNumber) {
    //   newErrors.gstNumber = "Please enter a GST Number";
    // } else {
    //   const regex = new RegExp(
    //     `/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/`
    //   );
    //   if (!regex.test(GSTNumber.trim())) {
    //     newErrors.gstNumber = "Invalid GST number";
    //   }
    // }

    console.log("newWeeoe", newErrors);

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      debugger;
      if (isUpdating === false) {
        const api = await companyAction.postCompanyProfile(payload);
        console.log("postCompanyProfile", api);
        if (api.responseCode == 201) {
          alert("Client Created successfully!");
      navigate("/CompanyList");

        } else {
          alert(api.message);
        }
      } else {
        const api = await companyAction.updateCompanyProfile(payload);
        console.log(api);
        if (api.responseCode == 200 || api.responseCode == 201) {
          alert("Client updated successfully!");
      navigate("/CompanyList");

        } else {
          alert(api.message);
        }

        console.log("updateCompanyProfile", api);
      }
    }
  };
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
          clientOwner,
          clientPOC,
        } = apiResponse.data;
        setPreviewImage(companyLogo)
        setClientPoc(clientPOC || "NA");
        setClientOwner(clientOwner);
        setStateGstList(apiResponse.data.clientStateGstMapping);
        setUserId(id);
        setCompanyName(companyName);
        setConvertedUrl(companyLogo);
        setAddress(companyAddress);
        setContactNumber(phoneNumber);
        setEmail(email);
        // setState(state);
        setCity(city);
        setCompanyCode(companyCode);
        setPanNumber(panNumber);
        // setGSTNumber(gstNumber);
        setIsOwn(isOwn);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (location && location.state && location.state.id) {
      const companyId = location.state.id;
      setIsUpdating(true);
      getCompanyDataById(location?.state?.id);
    }
  }, [location]);

  function stateHandler(data) {
    if (data) {
      setState(data);
    } else {
      setState();
    }
  }

  useEffect(() => {
    getAllStates();
  }, []);

  const cancelAddProfile = () => {
    navigate(`/CompanyList`);
  };
  const updateGstNumberHandler = () => {
    setStateGstList((pre) => {
      return pre.filter((ele,i) => {
        return i != selectedDeleteRow;
      });
    });
  };
  function deleteConfirmHandler(data,index) {
    setSelectedDeleteRow(index);
    setIsConfirmationDialogOpen(true);
  }

  return (
    <div className="main_container">
      <Box className="main">
        <ThemeProvider theme={theme}>
          <ConfirmationDialog
            open={isConfirmationDialogOpen}
            setOpen={setIsConfirmationDialogOpen}
            title={"Remove GST number"}
            description={`Do you want to delete the GST number ?`}
            confirmHandler={updateGstNumberHandler}
            data={selectedDeleteRow}
          />
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
                    {isUpdating
                      ? "Client profile Updating"
                      : isadding
                      ? "View Client Profile"
                      : "Client Profile"}
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
                  <Grid item xs={3}>
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
                      value={companyName || ""}
                      onChange={(e) => setCompanyName(e.target.value)}
                      error={errors.companyName}
                      helperText={errors.companyName}
                    />
                    {/* {errors.companyName && <p style={{color: "red"}}>{errors.companyName}</p>} */}
                  </Grid>
                  <Grid item xs={3}>
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
                      value={address || ""}
                      onChange={(e) => setAddress(e.target.value)}
                      error={errors.address}
                      helperText={errors.address}
                      disabled={isadding ? true : false}
                    />
                    {/* {errors.address && <p style={{color: "red"}}>{errors.address}</p>} */}
                  </Grid>
                  <Grid item xs={3}>
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
                      value={contactNumber || ""}
                      onChange={(e) => setContactNumber(e.target.value)}
                      error={errors.contactNumber}
                      helperText={errors.contactNumber}
                    />
                    {/* {errors.contactNumber && <p style={{color: "red"}}>{errors.contactNumber}</p>} */}
                  </Grid>
                  <Grid item xs={3}>
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
                      value={email || ""}
                      onChange={(e) => setEmail(e.target.value)}
                      error={errors.email}
                      helperText={errors.email}
                    />
                    {/* {errors.email && <p style={{color: "red"}}>{errors.email}</p>} */}
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Client Owner<span style={{ color: "red" }}>*</span>
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
                      value={clientOwner || ""}
                      onChange={(e) => setClientOwner(e.target.value)}
                      // error={errors.email}
                      // helperText={errors.email}
                    />
                    {/* {errors.email && <p style={{color: "red"}}>{errors.email}</p>} */}
                  </Grid>{" "}
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Client POC<span style={{ color: "red" }}>*</span>
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
                      value={clientPoc || ""}
                      onChange={(e) => setClientPoc(e.target.value)}
                      // error={errors.email}
                      // helperText={errors.email}
                    />
                    {/* {errors.email && <p style={{color: "red"}}>{errors.email}</p>} */}
                  </Grid>
                  <Grid item xs={3}>
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
                      value={city || ""}
                      onChange={(e) => setCity(e.target.value)}
                      error={errors.city}
                      helperText={errors.city}
                    />
                    {/* {errors.city && <p style={{color: "red"}}>{errors.city}</p>} */}
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Client Code
                    </Typography>
                    <TextField
                      name="search"
                      type="text"
                      size="small"
                      variant="outlined"
                      disabled={true}
                      inputProps={{
                        style: {
                          width: "12rem",
                        },
                      }}
                      value={isUpdating ? companyCode : "Auto-generated"}
                      onChange={(e) => setCompanyCode(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      PAN Card Number<span style={{ color: "red" }}>*</span>
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
                      value={PanNumber || ""}
                      onChange={(e) => setPanNumber(e.target.value)}
                      error={errors.panNumber}
                      helperText={errors.panNumber}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      is Owned
                    </Typography>
                    <Checkbox
                      checked={isOwn}
                      onChange={(e) => setIsOwn(e.target.checked)}
                    />
                  </Grid>
                </Grid>
                {/* <Grid item xs={1}> */}
                {/* <Divider orientation="vertical" flexItem></Divider> */}
                {/* </Grid> */}
                <Grid
                  item
                  xs={3}
                  container
                  // rowGap={1}
                  justifyContent={"start"}
                >
                  <Grid item xs={3} sx={{ paddingLeft: "10px" }}>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Client Logo<span style={{ color: "red" }}>*</span>
                    </Typography>
                    <TextField
                      sx={{ width: "220px" }}
                      id="logo"
                      size="small"
                      type="string"
                      variant="outlined"
                      value={companyLogo || ""}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              variant="contained"
                              component="label"
                              sx={{ height: "20px", color: "white" }}
                            >
                              Upload
                              <input
                                hidden
                                type="file"
                                onChange={handleFileUpload}
                              />
                            </Button>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {previewImage && (
                      <img
                        src={previewImage}
                        alt="Preview"
                        style={{ maxWidth: "220px", marginTop: "10px" }}
                      />
                    )}
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
                    <Grid
                      item
                      container
                      spacing={3}
                      alignItems={"center"}
                      // justifyContent={"space-between"}
                    >
                      {" "}
                      <Grid item xs={4}>
                        <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                          State<span style={{ color: "red" }}>*</span>
                        </Typography>
                        <CustomAutoComplete
                          disablePortal
                          id="combo-box-demo"
                          options={stateList ? stateList : []}
                          value={state || ""}
                          getOptionLabel={({ name }) => {
                            return name || "";
                          }}
                          onChange={(e, newValue) => stateHandler(newValue)}
                          // sx={{ width: 220 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              // error={errors.state}
                              // helperText={errors.state}
                            />
                          )}
                        />

                        {/* {errors.state && <p style={{color: "red"}}>{errors.state}</p>} */}
                      </Grid>
                      <Grid item xs={6}>
                        <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                          GST Number<span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                          name="search"
                          type="text"
                          size="small"
                          value={GSTNumber || ""}
                          variant="outlined"
                          inputProps={{
                            style: {
                              width: "17rem",
                            },
                          }}
                          onChange={(e) => setGSTNumber(e.target.value)}
                          // error={errors.gstNumber}
                          // helperText={errors.gstNumber}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Button
                          variant="contained"
                          sx={{ marginTop: "25px", color: "white" }}
                          onClick={(e) => {
                            console.log(e);
                            if (!state) {
                              alert("Please select a state");
                              return;
                            }
                            if (!GSTNumber) {
                              alert("Please enter a GST Number");
                              return;
                            }
                            setStateGstList((pre) => {
                              return [
                                ...pre,
                                {
                                  id: GSTNumber,
                                  stateId: state,
                                  gst: GSTNumber,
                                },
                              ];
                            });
                            counter++;
                            setState();
                            setGSTNumber("");
                          }}
                        >
                          Add More
                        </Button>
                      </Grid>
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
                                sx={{ backgroundColor: "rgb(14 57 115 / 86%)" }}
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
                                <TableCell
                                  key={"Action"}
                                  sx={{
                                    // minWidth: ele.width,
                                    color: "white",
                                    textAlign: "center",
                                  }}
                                >
                                  {"Action"}
                                </TableCell>
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
                                      <TableCell sx={{ textAlign: "center" }}>
                                        <IconButton
                                          aria-label="delete"
                                          onClick={() => {
                                            deleteConfirmHandler(user,index);
                                            // updateGstNumberHandler(user);
                                          }}
                                        >
                                          <DeleteIcon />
                                        </IconButton>
                                      </TableCell>
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
                <Grid
                  item
                  xs={12}
                  container
                  direction={"row-reverse"}
                  columnGap={2}
                >
                  <Grid item rowGap={3} sx={{ margin: "0px 5px" }}>
                    <Button
                      sx={{ color: "white", width: "7rem", height: "2.7rem" }}
                      variant="contained"
                      onClick={handleFormSubmit}
                    >
                      Submit
                    </Button>
                  </Grid>
                  <Grid item rowGap={3} sx={{ margin: "0px 5px" }}>
                    <Button
                      sx={{ color: "white", width: "7rem", height: "2.7rem" }}
                      variant="contained"
                      onClick={cancelAddProfile}
                    >
                      Cancel
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

export default CompanyProfile;
