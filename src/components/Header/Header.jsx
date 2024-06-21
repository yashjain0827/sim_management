import React, { useState, useContext } from "react";
import { Button, Grid, IconButton, Toolbar, Typography } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import LogoutIcon from "@mui/icons-material/Logout";
import { Box } from "@mui/system";
import { styled, alpha, makeStyles } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../img/watsoo logo.svg";

import InputBase from "@mui/material/InputBase";
import "./Header.css";
import Divider from "@mui/material/Divider";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";
// import auth from "../../route/auth";
import { Avatar } from "@mui/material";
// const drawerWidth = 240;
import config from "../../config/config";

const UnderlineSpan = styled("span")({
  textDecoration: "underline",
  color: "#7DEF74",
  paddingLeft: "10px",
});
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "8px",
  backgroundColor: alpha(theme.palette.common.white, 1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.9),
  },
  //   marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(2),
    width: "100%",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  //   pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  top: "0",
  right: "0",
  cursor: "pointer",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 1),
    // vertical padding + font size from searchIcon
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Header = ({ open, setOpen, handleDrawerOpen }) => {
  // const [webPermission, setWebPermission] = useContext(permissionContext);

  //
  // const pol = JSON.parse(localStorage.getItem("name"))

  const name =
    localStorage.getItem("data") !== null &&
    JSON.parse(localStorage.getItem("data")).name;

  // const [open,setOpen]=useState(false);
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");

    // sessionStorage.clear();
  };

  const handleDrawerClose = () => {
    setOpen(false);
    // dispatch(closeSidebar());
  };

  const parentHandle = (event) => {
    // alert("ddddddddd");
    // event.stopPropagation();
    // dispatch(closeSidebar());
  };
  // const pathname = window.location.pathname;

  const profileName = { userPhotoPath: null };
  // const profileName = JSON.parse(localStorage.getItem("data"));

  return (
    <div className="header">
      <AppBar position="fixed" open={open} className="mein__header">
        <Toolbar>
          <Grid container alignItems={"center"} onClick={parentHandle}>
            <Grid item xs={4} className="logo__bg">
              <Box className="logo" display={"flex"} alignItems={"center"}>
                <div className="toggle__btn">
                  {open == true ? (
                    <IconButton
                      onClick={handleDrawerClose}
                      sx={{
                        marginRight: 5,
                      }}
                      className="openNav"
                    >
                      <ChevronRight />
                    </IconButton>
                  ) : (
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      onClick={handleDrawerOpen}
                      edge="start"
                      sx={{
                        marginRight: 5,
                        marginLeft: "auto",
                        ...(open && { display: "none" }),
                      }}
                    >
                      <MenuIcon sx={{ color: "black" }} />
                    </IconButton>
                  )}
                </div>

                <img
                  onClick={() => navigate("/dashboard")}
                  src={logo}
                  alt="Logo"
                ></img>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6">
                {window.location.pathname === "/dashboard" ? "Dashboard" : ""}
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
              textAlign={"end"}
              sx={{
                display: "flex",
                gap: "8px",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  className="profile"
                  // sx={{ justifyContent: `${open ? "initial" : "center"}` }}
                >
                  <Avatar
                    alt="Cindy Baker"
                    src={`${
                      profileName.userPhotoPath == null
                        ? ""
                        : profileName.userPhotoPath
                    }`}
                  />
                  {`${name}`}
                </Typography>
              </Box>
              <Button
                startIcon={<LogoutIcon />}
                sx={{
                  color: "var(--clr-white)",
                  fontWeight: "bold",
                  border: "2px solid #ffffff87",
                  borderRadius: "10px",
                  "&:hover": {
                    background: "#fff",
                    color: "#222",
                  },
                  transition: "all 0.3s ease-in-out",
                  textTransform: "none",
                  fontSize: "1rem",
                }}
                onClick={() => {
                  handleLogout();
                  handleDrawerClose();
                }}
              >
                Sign Out
              </Button>
              {/* <span style={{fontSize:".5rem",marginBottom:0,marginRight:"0rem"}}>{config.version}</span> */}
            </Grid>
            <Grid></Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
