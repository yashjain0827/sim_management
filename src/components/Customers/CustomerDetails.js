import {
  Button,
  Grid,
  TextField,
  Typography,
  Box,
  Autocomplete,
  InputAdornment
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import { CustomerCareAction } from "../actions/customerCare";
import { useNavigate, useLocation } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(14 57 115 / 86%)"
    }
  }
});
function CustomerDetails() {
  const navigate = useNavigate();
  const token =
    window.location.href.split("/")[2].includes("localhost") ||
    window.location.href.split("/")[2].includes("192.")
      ? "djb"
      : window.location.href.split("/")[2];

  console.log(token);
  const [disable, setDisable] = useState(true);
  const [editButton, setButton] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [bannerMessage, setBannerMessage] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [softBannerMessage, setSoftBannerMessage] = useState("");
  // const [data, setData] = useState({});
  const [errors, setErrors] = useState({
    phoneNumber: "",
    email: "",
    bannerMessage: "",
    bannerUrl: "",
    softBannerMessage: ""
  });

  // useEffect(()=>{
  //   const userLoginData = JSON.parse(localStorage.getItem("data")).datas;
  //   setPhoneNumber(userLoginData &&  userLoginData.number)
  //   setEmail(userLoginData &&  userLoginData.mailtoEmail)
  //   setBannerMessage(userLoginData &&  userLoginData.bannerName)
  //   setBannerUrl(userLoginData &&  userLoginData.bannerUrl)
  //   setSoftBannerMessage(userLoginData &&  userLoginData.softMessage)
  // }, [])

  const customersDetails = async () => {
    try {
      // const token = "eclvts";
      debugger;
      // const token = token;
      const response = await CustomerCareAction.getCustomersDetails(token);

      if (response != null) {
        const data = JSON.parse(response.data.datas);
        // setData(JSON.parse(response.data.datas));
        // console.log("vaibhav", data);
        setPhoneNumber(data?.support?.number || "NA");
        setBannerMessage(data?.support?.bannerName || "NA");
        setBannerUrl(data?.support?.bannerUrl || "NA");
        setEmail(data?.support?.mailtoEmail || "NA");
        setSoftBannerMessage(data?.support?.softMessage || "NA");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    customersDetails();
  }, []);
  const handleEdit = () => {
    setButton(true);
    setDisable(false);
  };

  const handleCancel = () => {
    setButton(false);
    setDisable(true);
  };

  const UpdateCustomerCareDetails = () => {
    const newErrors = {
      phoneNumber: "",
      email: "",
      bannerMessage: "",
      bannerUrl: "",
      softBannerMessage: ""
    };

    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone Number is required";
    } else if (phoneNumber.length > 10) {
      newErrors.phoneNumber = "Phone Number should be 10 digits";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Invalid email address";
    }

    if (!bannerMessage) {
      newErrors.bannerMessage =
        "Banner Message is reSoft Banner Message is requiredquired";
    }
    if (!bannerUrl) {
      newErrors.bannerUrl = "Banner Url is required";
    }
    if (!softBannerMessage) {
      newErrors.softBannerMessage = "Soft Banner Message is required";
    }

    setErrors(newErrors);
    if (Object.values(newErrors).every((error) => error === "")) {
      debugger;
      // const token = JSON.parse(localStorage.getItem("data")).token;
      // const token = "eclvts";

      const payload = {
        support: {
          number: phoneNumber,
          bannerName: bannerMessage,
          bannerUrl: bannerUrl,
          mailtoEmail: email,
          softMessage: softBannerMessage
        }
      };
      CustomerCareAction.updateCustomerDetails(token, payload).then(
        (response) => {
          if (response != null) {
            alert(response && response);
            navigate("/dashboard");
          } else {
            console.log(response.message);
          }
        }
      );
    }
  };

  return (
    <div className="main_container">
      <Box className="main">
        <ThemeProvider theme={theme}>
          <Grid container sx={{ marginTop: "1rem" }} rowGap={8}>
            <Grid item xs={12}>
              <Typography
                sx={{
                  color: "rgb(14 57 115 / 86%)",
                  fontSize: "22px",
                  padding: ""
                }}
              >
                Customer Care Details
                <Divider />
              </Typography>
            </Grid>

            <Grid item container spacing={2} rowGap={4}>
              <Grid item xs={4}>
                <Typography sx={{ color: "rgba(14, 57, 115, 0.86)" }}>
                  Phone Number<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  type="number"
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  sx={{ width: "80%" }}
                  value={phoneNumber || ""}
                  disabled={disable}
                  error={errors.phoneNumber}
                  helperText={errors.phoneNumber || ""}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                  Email<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  value={email || ""}
                  sx={{ width: "80%" }}
                  disabled={disable && disable}
                  errors={errors.email}
                  helperText={errors.phoneNumber}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                  Banner Message<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  value={bannerMessage || ""}
                  sx={{ width: "80%" }}
                  disabled={disable && disable}
                  errors={errors.bannerMessage}
                  helperText={errors.bannerMessage}
                  onChange={(e) => setBannerMessage(e.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                  Banner Url<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  value={bannerUrl || ""}
                  sx={{ width: "80%" }}
                  disabled={disable && disable}
                  errors={errors.bannerUrl}
                  helperText={errors.bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                  Soft Message<span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  value={softBannerMessage || ""}
                  sx={{ width: "80%" }}
                  disabled={disable && disable}
                  errors={errors.softBannerMessage}
                  helperText={errors.softBannerMessage}
                  onChange={(e) => setSoftBannerMessage(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              container
              direction={"row-reverse"}
              columnGap={2}
            >
              {!editButton && (
                <>
                  <Grid item rowGap={3} sx={{ margin: "0px 5px" }}>
                    <Button
                      sx={{ color: "white", width: "7rem", height: "2.7rem" }}
                      variant="contained"
                      onClick={() => handleEdit()}
                    >
                      Edit
                    </Button>
                  </Grid>
                </>
              )}
              {editButton && (
                <>
                  <Grid item rowGap={3} sx={{ margin: "0px 5px" }}>
                    <Button
                      sx={{ color: "white", width: "7rem", height: "2.7rem" }}
                      variant="contained"
                      onClick={() => UpdateCustomerCareDetails()}
                    >
                      Update
                    </Button>
                  </Grid>
                  <Grid item rowGap={3} sx={{ margin: "0px 5px" }}>
                    <Button
                      sx={{ color: "white", width: "7rem", height: "2.7rem" }}
                      variant="contained"
                      onClick={() => handleCancel()}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </ThemeProvider>
      </Box>
    </div>
  );
}

export default CustomerDetails;
