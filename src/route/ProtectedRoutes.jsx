import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import ViewNavbarSidebar from "../components/CommonComponents/ViewNavbarSidebar";
import Sidebar from "../components/SideBar/SideBar";
import auth from "./auth";

export const ProtectedRoutes = () => {
  return auth.isAuthenticated() ? (
    <>
      {/* return localStorage.getItem("data") ? (<> */}

      {/* <ViewNavbarSidebar/> */}
      <Sidebar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};
