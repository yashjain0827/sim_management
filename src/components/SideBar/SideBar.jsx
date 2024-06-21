import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import "./sideMenu.css";
import { useNavigate } from "react-router-dom";
// import BoxIcon from "../../img/Box_icon.svg"

import config from "../../config/config";
import Header from "../Header/Header";
import dashboard from "../../img/Icons/Dashboard.svg";
import BoxPakage from "../../img/Icons/Box Packaging.svg";
import BoxDashboard from "../../img/Icons/Packaging.svg";
import CompanyIcon from "../../img/Icons/Vector-1.svg";
import DeviceIcon from "../../img/Icons/Device.svg";
import settingsIcon from "../../img/Icons/settings.png";
import Customer_icon from "../../img/Icons/Customer_icon.svg";
import returnPermission from "../../img/Icons/returnPermission.svg";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Collapse } from "@mui/material";
import MaintenanceIcon from "../../img/Maintainance.svg";
import RepairIcon from "../../img/Device repair.svg";
import ReplaceIcon from "../../img/Replace.svg";
import ReturnIcon from "../../img/Return.svg";
import iccidIcon from "../../img/Icons/SIM.svg";
import deviceLotIcon from "../../img/deviceLot.svg";
import subscriptionMasterIcon from "../../img/Subscription Master2.svg";
import rawDataIcon from "../../img/Raw Data icon.svg";
// console.log(AllUser)
const drawerWidth = 280;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 10px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 10px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Sidebar = () => {
  //const open = useSelector((state) => state.HeaderSlice.value);
  const navigate = useNavigate();

  const profileName = JSON.parse(localStorage.getItem("data"));

  const [open, setOpen] = React.useState(false);
  const [openSubmenu, setOpenSubMenu] = React.useState(false);
  const [sideBarList, setSideBarList] = React.useState([]);
  const handleMouseEnter = () => {
    setOpen(true);
  };
  const handleDrawerOpen = (event) => {
    setOpen(true);
  };
  const handleMouseLeave = () => {
    const s1 = [...sideBarList].map((ele, item) => {
      return { ...ele, isSubMenuOpen: false };
    });
    setSideBarList(s1);
    setOpen(false);
  };
  const handleClick = (menuItem) => {
    debugger;
    if (menuItem.submenu.length == 0) {
      navigate(menuItem.link);
    } else if (menuItem.submenu.length > 0) {
      const s1 = [...sideBarList].map((ele, item) => {
        if (ele.id == menuItem.id) {
          return { ...ele, isSubMenuOpen: !ele.isSubMenuOpen };
        } else {
          return ele;
        }
      });
      setSideBarList(s1);
    }
  };
  // const dispatch = useDispatch();
  //const [open, setOpen] = React.useState(false);
  //   const ShowSubMenu = JSON.parse(localStorage.getItem("data")).hrmsUserId;
  //   const NavMenuitems=ShowSubMenu == 59436?onlyOneUser:AllUser

  // { title: "Box Package", icon: BoxPakage, link: "/boxList" },
  // { title: "Packaging", icon: BoxDashboard, link: "/deviceStatusUpdate" },
  // console.log(profileName.menuVisiblity);

  const group = profileName.subMenuVisibilty.reduce((result, item) => {
    // for the first iteration result will be an empty array
    const mainMenuId = item.menuId;
    if (!result[mainMenuId]) {
      result[mainMenuId] = [];
    }
    if (item.isVisible) {
      result[mainMenuId].push({
        ...item,
        icon:
          item.name == "REPAIR"
            ? RepairIcon
            : item.name == "REPLACE"
            ? ReplaceIcon
            : item.name == "RETURN"
            ? ReturnIcon
            : "",
      });
    }

    return result;
  }, {});

  // console.log(group);
  React.useEffect(() => {
    const sidebarItem =
      profileName?.menuVisiblity !== null &&
      profileName?.menuVisiblity?.map((ele) => {
        return {
          id: ele.id,
          isVisible: ele.isVisible,
          link: ele.link,
          name: ele.name,
          isSubMenuOpen: false,
          icon:
            ele.name === "Dashboard"
              ? dashboard
              : ele.name === "Box Package"
              ? BoxPakage
              : ele.name === "Packaging"
              ? BoxDashboard
              : ele.name == "Configuration Master"
              ? settingsIcon
              : ele.name == "Clients"
              ? CompanyIcon
              : ele.name == "Issued Devices"
              ? DeviceIcon
              : ele.name == "Customer Care"
              ? Customer_icon
              : ele.name == "Maintenance"
              ? MaintenanceIcon
              : ele.name == "Version Request"
              ? Customer_icon
              : ele.name == "Iccid Master"
              ? iccidIcon
              : ele.name == "Device Lot"
              ? deviceLotIcon
              : ele.name == "Return"
              ? ReturnIcon
              : ele.name == "Subscription Master"
              ? subscriptionMasterIcon
              : ele.name == "RawDataMaster"
              ? rawDataIcon
              : ele.name == "Reconfigure"
              ? rawDataIcon
              : "",

          submenu: group[ele.id] ? group[ele.id] : [],
        };
      });
    // sidebarItem.push({
    //   id: 20,
    //   isVisible: true,
    //   link: "version_update",
    //   name: "version_update",
    //   isSubMenuOpen: false,
    //   icon: Customer_icon,
    //   submenu: [],
    // });
    // console.log(sidebarItem);

    setSideBarList([...sidebarItem]);
  }, []);

  // sidebarItem &&
  //   sidebarItem.push({
  //     id: 3,
  //     isVisible: true,
  //     link: "/Companylist",
  //     name: "Clients",
  //     icon: CompanyIcon,
  //   });
  // sidebarItem &&
  //   sidebarItem.push({
  //     id: 4,
  //     isVisible: true,
  //     link: "/AllIssuesDevices",
  //     name: "Issued Devices",
  //     icon: DeviceIcon,
  //   });
  // sidebarItem &&
  //   sidebarItem.push({
  //     id: 7,
  //     isVisible: true,
  //     link: "/ReturnReportDashboard",
  //     name: "Order Management",
  //     icon: returnPermission,
  //     hasSubmenu: true,
  //   });

  // console.log(sidebarItem, "iiiiiiiiiii")
  const currentLocation = window.location.pathname;
  // console.log(sidebarItem, "currentLocation");

  // function history(data) {
  //     console.log(data);
  //     if (data == "Meeting Reports") {
  //         window.open("/outdoorduties", "_self");
  //     } else if (data == "Dashboard") {
  //         window.open("/dashboard", "_self");
  //     }
  // }

  return (
    <Box sx={{ display: "flex" }}>
      <Header
        open={open}
        setOpen={setOpen}
        handleDrawerOpen={handleDrawerOpen}
      />
      <CssBaseline />
      <Drawer
        variant="permanent"
        open={open}
        className="sidebar"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <DrawerHeader />

        <Divider />
        <List className="menu">
          {sideBarList &&
            sideBarList.length > 0 &&
            sideBarList.map((item, index, a1) => {
              // console.log(a1);
              return (
                item.isVisible === true &&
                item.link && (
                  <>
                    <ListItem
                      key={index}
                      disablePadding
                      sx={{ display: "block" }}
                      onClick={() => {
                        handleClick(item);
                      }}
                    >
                      <ListItemButton
                        className={`list__items ${
                          item.link === currentLocation ? "active" : ""
                        }`}
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? "initial" : "center",
                          px: 2.5,
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: "40px",
                            mr: open ? 1 : "auto",
                            justifyContent: open ? "start" : "center",
                          }}
                        >
                          {<img src={`${item.icon}`} alt="icons"></img>}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.name}
                          sx={{ opacity: open ? 1 : 0, color: "white" }}
                        />
                        {item.submenu.length > 0 && open ? (
                          item.isSubMenuOpen ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )
                        ) : null}

                        {/* <span>{item.title}</span> */}
                      </ListItemButton>
                    </ListItem>

                    <Collapse
                      in={item.isSubMenuOpen}
                      timeout={"auto"}
                      unmountOnExit
                      component={"div"}
                    >
                      {item.submenu.length > 0 &&
                        item.submenu.map((ele, i) => {
                          return (
                            <div
                              className="list__items"
                              sx={{
                                background: "blue",
                              }}
                              onClick={() =>
                                navigate(`${item.link}${ele.link}`)
                              }
                            >
                              <ListItemButton
                                sx={{
                                  pl: 5,
                                }}
                              >
                                <ListItemIcon
                                  sx={{
                                    minWidth: "25px",
                                    mr: "auto",
                                    justifyContent: open ? "start" : "center",
                                  }}
                                >
                                  {<img src={`${ele.icon}`} alt="icons"></img>}
                                </ListItemIcon>
                                <ListItemText
                                  primary={ele.name}
                                  sx={{
                                    // opacity: open ? 1 : 0,
                                    color: "white",
                                  }}
                                />
                              </ListItemButton>
                            </div>
                          );
                        })}
                    </Collapse>
                  </>
                )
              );
            })}
        </List>
        {/* <div className="versionstyle">
          <span
            style={{ fontSize: ".5rem", marginBottom: 0, marginRight: "300px" }}
          >
            Version {config.version}
          </span>
        </div> */}
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, background: "#F4F4F4", padding: "28px 10px" }}
      >
        {/* <Dashboard /> */}
        {/* <Routerr /> */}
      </Box>
    </Box>
  );
};

export default Sidebar;
