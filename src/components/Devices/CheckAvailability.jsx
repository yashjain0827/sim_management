import {
  Button,
  Grid,
  TextField,
  Typography,
  Box,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import Link from "@mui/material/Link";
import axios from "axios";
import { companyAction } from "../company/companyFetchData";
import { BoxPackaging } from "../actions/boxPackaging";
import { DeviceApiAction } from "./GetDevicesAPI";
import { TextareaAutosize } from "@mui/base";
import _ from "lodash";
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

const blockInvalidChar = (e) =>
  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
function CheckAvailability() {
  const navigate = useNavigate();
  const [companiesList, setCompaniesList] = useState([]);
  const [companyId, setCompanyId] = useState();
  const [stateList, setStateList] = useState([]);
  const [companyName, setCompaniesName] = useState();
  const [state, setState] = useState();
  const [deviceQuantity, setDeviceQuantity] = useState("");
  const [stateCompany, setStateCompany] = useState(null);
  const [inputValue, setInputValue] = useState("");

  // const [formErrors, setFormErrors] = useState({});
  const [formErrors, setFormErrors] = useState({
    // companyName: "",
    state: "",
    deviceQuantity: "",
  });
  const [boxString, setBoxString] = useState("");

  // Define the debounced function
  const debouncedHandleChange = _.debounce((data) => {
    // Your logic here (e.g., API request, state update, etc.)
    console.log("Performing action with:", data);
    setBoxString((pre) => {
      console.log(`${pre}${data.trim()}`);
      return `${pre},${data.trim()}`;
    });
  }, 2000); // Adjust the debounce delay (in milliseconds) as per your requirement

  // Handle the text field change
  const handleChange = (value) => {
    // const { value } = event.target;
    setInputValue(value);

    // Call the debounced function
    debouncedHandleChange(value);
  };

  const getBoxList = (data) => {
    if (data) {
      setInputValue(data.trim());

      setBoxString(data.trim());
    } else {
      setBoxString("");
    }
  };
  const getAllCompanies = () => {
    companyAction
      .getCompanyList()
      .then((response) => {
        if (response != null) {
          setCompaniesList(response.data);
        } else {
          setCompaniesList([]);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    getAllCompanies();
  }, []);

  function companiesHandler(e, data) {
    console.log(data);
    if (data) {
      setCompanyId(data?.id);
      setCompaniesName(data?.companyName);
      setState(data?.state);
    } else {
      setCompanyId(null);
      setCompaniesName(null);
    }
  }

  const getAllStates = () => {
    BoxPackaging.getAllStatesList()
      .then((res) => {
        if (res != null) {
          setStateList((previous) => {
            return previous.concat(res);
          });
        } else {
          setStateList([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllStates();
  }, []);

  // function companiesHandler(data) {
  //   if (data) {
  //     setCompaniesName(data);
  //   } else {
  //     setCompaniesName({ id: "", name: "" });
  //   }
  // }

  function stateHandler(data) {
    if (data) {
      setState(data);
    } else {
      setState({ id: "", name: "" });
    }
  }

  const requestDeviceQuantity = (e) => {
    const inputValue = e.target.value.trim();

    if (inputValue !== "") {
      const parsedValue = parseInt(inputValue, 10);

      if (
        isNaN(parsedValue) ||
        parsedValue <= 0 ||
        parsedValue !== parseFloat(inputValue)
      ) {
        alert("Requested Qty cannot be 0 or in decimal");
        return;
      }

      setDeviceQuantity(parsedValue);
    } else {
      alert("Please enter a valid number greater than zero");
    }
  };

  const checkAvailabilityHandle = async (e) => {
    console.log(state, "stjkhkdsasate");
    const regex = /^[1-9]\d*$/;

    // let errors = {};
    e.preventDefault();
    const key = deviceQuantity;

    const payload = {
      boxesList: boxString,
      requestedQuantity: key,
      stateId: state?.id,
    };
    const errors = {
      companyName: "",
      state: "",
      deviceQuantity: "",
    };

    if (!companyName) {
      errors.companyName = "Please select a company.";
      return;
    }

    if (!state) {
      errors.state = "Please select a state.";
      return;
    }

    if (!deviceQuantity) {
      errors.deviceQuantity = "Please enter the device quantity.";
      return;
    }
    if (!regex.test(deviceQuantity)) {
      alert("Requested Qty cannot be 0 or in decimal!");
      return;
    }

    if (Object.keys(errors).length === 0 || (state && deviceQuantity)) {
      const api = await DeviceApiAction.checkAvailabilityAPI(payload);
      const navigationState = {
        key: deviceQuantity,
        stateId: state?.id,
        boxesList: boxString,
        clientId: companyId,
        quantity: deviceQuantity,
      };

      if (api && api.data && api.data.length > 0) {
        if (api?.requestedURI) {
          alert(api?.requestedURI);
        }

        navigate("/BoxSelectionQuantity", { state: navigationState });
      } else {
        alert(api?.message || "Something went wrong");
      }
    } else {
      setFormErrors(errors);
    }
  };



  return (
    <div className="main_container">
      <Box className="main">
        <ThemeProvider theme={theme}>
          <Grid container sx={{ marginTop: "1rem" }} rowGap={10}>
            <Grid item xs={12}>
              <Typography
                sx={{
                  color: "rgb(14 57 115 / 86%)",
                  fontSize: "25px",
                  padding: "",
                }}
              >
                Device Allocation Request
                <Divider />
              </Typography>
            </Grid>

            <Grid item container spacing={2} rowGap={4}>
              <Grid item xs={4}>
                <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                  Select Company<span style={{ color: "red" }}>*</span>
                </Typography>
                <CustomAutoComplete
                  disablePortal
                  id="combo-box-demo"
                  options={
                    companiesList
                      ? companiesList.filter(
                          (company) => company.isActive === true
                        )
                      : []
                  }
                  value={companyName}
                  getOptionLabel={({ companyName }) => companyName}
                  onChange={(e, newValue) => {
                    companiesHandler(e, newValue);
                  }}
                  sx={{ width: 220 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={formErrors.companyName}
                      helperText={formErrors.companyName}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                  State<span style={{ color: "red" }}>*</span>
                </Typography>
                <CustomAutoComplete
                  disablePortal
                  id="combo-box-demo"
                  options={stateList ? stateList : []}
                  value={state || ""}
                  getOptionLabel={(option) =>
                    option ? option.name || option.name : ""
                  }
                  getOptionSelected={(option, value) =>
                    option.name == value.name
                  }
                  onChange={(e, newValue) => stateHandler(newValue)}
                  sx={{ width: 220 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={formErrors.state}
                      helperText={formErrors.state}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                  Request Device Quantity
                  <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  onKeyDown={(e) => blockInvalidChar(e)}
                  name="search"
                  type="number"
                  size="small"
                  variant="outlined"
                  inputProps={{
                    style: {
                      width: "12rem",
                    },
                  }}
                  onChange={(e) => {
                    requestDeviceQuantity(e);
                  }}
                  error={formErrors.deviceQuantity}
                  helperText={formErrors.deviceQuantity}
                />
              </Grid>

              <Grid item xs={6} flexGrow={1}>
                <div>
                  <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                    Enter Box No(To be dispatched)
                  </Typography>
                  <TextareaAutosize
                    name="search"
                    // type="textarea"
                    // size="small"
                    variant="outlined"
                    value={inputValue}
                    onChange={(e) => getBoxList(e.target.value)}
                    inputProps={
                      {
                        // style: {
                        //   minWidth: "100%",
                        // },
                      }
                    }
                    style={{
                      minWidth: "400px",
                      minHeight: "100px",
                    }}
                  />
                </div>
                {/* {errors.companyName && <p style={{color: "red"}}>{errors.companyName}</p>} */}
              </Grid>
              <Grid xs={3}></Grid>
              <Grid item xs={3}>
                <Button
                  sx={{ color: "white", height: "2.7rem" }}
                  variant="contained"
                  onClick={checkAvailabilityHandle}
                >
                  Check Availability
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </ThemeProvider>
      </Box>
    </div>
  );
}

export default CheckAvailability;
