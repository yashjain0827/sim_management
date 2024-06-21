import React from "react";
import { useNavigate } from "react-router-dom";
import auth from "../../route/auth";
import LogoutIcon from "@mui/icons-material/Logout";
import { AppBar, Box, Button, Drawer, Toolbar } from "@mui/material";

const ViewNavbarSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout(() => navigate("/login"));
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <>
      {/* <Box sx={{minWidth:"var(---sidebar-width)",backgroundColor:"#0d5257",height:"100%",position:"fixed"}}></Box> */}
      <AppBar
        position="fixed"
        sx={{
          height: "var(--navbar-height)",
          display: "flex",
          justifyContent: "center",
          overflow: "hidden",
          background: "var(--clr-gradient-primary)",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ height: "75%", width: "195px", cursor: "pointer" }} />
          <Button
            startIcon={<LogoutIcon />}
            sx={{
              color: "var(--clr-white)",
              fontWeight: "bold",
              "&:hover": {
                background: "#fff",
                color: "#222",
              },
              transition: "all 0.3s ease-in-out",
              textTransform: "none",
              fontSize: "1rem",
            }}
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default ViewNavbarSidebar;
