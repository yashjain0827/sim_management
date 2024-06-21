import React, { useState } from "react";
import { LoginAction } from "../actions/login";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Paper,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import auth from "../../route/auth";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0d5257",
    },
  },
});

const Login = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = React.useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    let payload = {
      email: email,
      password: password,
    };

    // const data = new FormData(event.currentTarget);
    // const email = data.get("email");
    // const password = data.get("password");
    if (email.trim() && password.trim()) {
      const res = await LoginAction.fetchLoginData(payload);
      if (res !== null) {
        console.log(res, "loginres");
        localStorage.setItem("data", JSON.stringify(res.data));
        localStorage.setItem("userID", JSON.stringify(res.data.id));
        localStorage.setItem("deviceConfigPermission", true);
        // localStorage.setItem("token", JSON.stringify(res.token));
        sessionStorage.setItem("auth", "true");
        const firstRoute =
          res?.data?.menuVisiblity?.filter((ele) => {
            return ele.isVisible;
          }) || [];
        const route = firstRoute?.length > 0 ? firstRoute[0].link : "/";
        console.log(firstRoute, route);
        auth.login(() => {
          if (firstRoute?.length == 0) {
            alert("Permission access required!");
          }
          navigate(route);
        });
      } else {
        alert("Invalid Email or Password");
      }
    } else {
      alert("All the fields are required");
    }
  };

  return (
    <main className="login_main">
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "1rem 2rem",
            }}
            component={Paper}
          >
            <Typography component="h1" variant="h5" required>
              Watsoo Device Management
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                //name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
                size="small"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                //name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                size="small"
                type={visible ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setVisible(!visible)}
                      >
                        {visible ? <VisibilityOffIcon /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </main>
  );
};

export default Login;
