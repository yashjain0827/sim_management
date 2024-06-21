import { Button, Grid, TextField } from "@mui/material";
import Divider from "@mui/material/Divider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import moment, { locale } from "moment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { DeviceApiAction } from "./GetDevicesAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { companyAction } from "../company/companyFetchData";
import { styled } from "@mui/material/styles";
import { Autocomplete } from "@mui/material";
import CompanyList from "../company/CompanyList";
import { all } from "axios";
import Loader from "../CommonComponents/loader";
import LoadingComponent from "../CommonComponents/LoadingComponts";
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

function createData(box, date, quantity) {
  return {
    box,
    date,
    quantity,
  };
}

function Row(props) {
  const {
    row,
    data,
    setData,
    index,
    deviceRequestQuantity,
    setRequestQuantity,
    requestQuantity,
  } = props;
  console.log(row, data, index)
  const [open, setOpen] = React.useState(false);
  const list = [...data];
  const handleParentCheck = (checked) => {
    const testArray = [...data];
    testArray[index].isChecked = checked;
    if (
      testArray[index] &&
      testArray[index].deviceDtoList &&
      testArray[index].deviceDtoList.length > 0
    ) {
      for (let i = 0; i < testArray[index].deviceDtoList.length; i++) {
        testArray[index].deviceDtoList[i].isChecked = checked;
      }
    }
    setData(testArray);
  };
  const changeCount = () => {
    let count = requestQuantity;
    const testArray = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].deviceDtoList.length; j++) {
        if (data[i].deviceDtoList[j].isChecked === true) {
          testArray.push(data[i].deviceDtoList[j]);
        }
      }
    }
    // setRequestQuantity(count);
    const lengthOfCHeckedArray = testArray.length;
    setRequestQuantity(lengthOfCHeckedArray);
  };
  // changeCount()

  const handleChildCheck = (checked, parentIndex, childIndex) => {
    setData((prevData) => {
      const updatedData = [...prevData];
      if (updatedData[parentIndex] && updatedData[parentIndex].deviceDtoList) {
        const childItem = updatedData[parentIndex].deviceDtoList[childIndex];
        if (childItem) {
          childItem.isChecked = checked;
        }
      }
      return updatedData;
    });
    const selectedParent = data[parentIndex];
    const lengthOfChildItems = selectedParent?.deviceDtoList?.length;
    const checkedChildItems = selectedParent?.deviceDtoList?.filter(
      (val) => val?.isChecked
    ).length;
    if (lengthOfChildItems == checkedChildItems) {
      selectedParent.isChecked = true;
    } else selectedParent.isChecked = false;
    console.log("selectedParent", selectedParent);
    changeCount();
  };

  // if (list && list.length > 0) {
  //   list.forEach(({ deviceDtoList }) => {
  //     deviceDtoList.forEach((device) => {
  //       if (device && deviceRequestQuantity > 0) {
  //         device.isChecked = true;
  //         deviceRequestQuantity--;
  //       }
  //     });
  //   });
  // }
  // setData(list);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell align="center">
          <Checkbox
            checked={row.isChecked || false}
            onChange={(e) => handleParentCheck(e.target.checked, index)}
          />
        </TableCell>
        <TableCell align="center">{row.boxNo}</TableCell>
        <TableCell align="center">
          {row.createdAt
            ? moment
              .utc(row.createdAt)
              .utcOffset("+05:30")
              .format("DD/MM/YYYY hh:mm a")
            : null}{" "}
        </TableCell>
        <TableCell align="center">
          {row.quantity || ""}{" "}
          <IconButton
            aria-label="expand row"
            size="small"
            align="center"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "rgb(14 57 115 / 86%)",
                      opacity: "0.8",
                    }}
                  >
                    <TableCell
                      sx={{ color: "white" }}
                      align="center"
                    ></TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      S. No.
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      Updated At
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      created By
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      IMEI No.
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      ICCID No.
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      UUID No.
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      Software Version
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      Status
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>

                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.deviceDtoList.map((device, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row" align="center">
                        <Checkbox
                          color="primary"
                          checked={device.isChecked || false}
                          onClick={(e) =>
                            handleChildCheck(
                              e.target.checked,
                              props.index,
                              index
                            )
                          }
                        />
                      </TableCell>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">
                        {device.createdAt
                          ? moment
                            .utc(device.createdAt)
                            .utcOffset("+05:30")
                            .format("DD/MM/YYYY hh:mm a")
                          : null}{" "}
                      </TableCell>
                      <TableCell align="center">
                        {device.createdBy || "NA"}
                      </TableCell>
                      <TableCell align="center">{device.imeiNo}</TableCell>
                      <TableCell align="center">{device.iccidNo}</TableCell>
                      <TableCell align="center">{device.uuidNo}</TableCell>
                      <TableCell align="center">
                        {device.softwareVersion}
                      </TableCell>
                      <TableCell align="center">{device.status}</TableCell>
                      <TableCell align="center"><Button variant="contained">Scan</Button></TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    box: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    quantity: PropTypes.string.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        updatedAt: PropTypes.string.isRequired,
        createdBy: PropTypes.string.isRequired,
        IMEINo: PropTypes.string.isRequired,
        ICCIDNo: PropTypes.string.isRequired,
        UUIDNo: PropTypes.string.isRequired,
        SoftwareVersion: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

function BoxSelectionQuantity() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  // const [companiesList, setCompaniesList] = useState([]);
  const [allDevicesList, setAllDevicesList] = useState([]);
  const [firstRender, setFirstRender] = useState(true);
  // const [companyName, setCompaniesName] = useState();
  const [clientId, setClientId] = useState(null);
  const [requestQuantity, setRequestQuantity] = useState(null);
  let [key, setKey] = useState();
  const [formErrors, setFormErrors] = useState({
    companyName: "",
  });

  const getAllDevicesBox = (stateId, key, boxesList) => {
    console.log("stateId", stateId, key);
    const payload = {
      stateId: stateId,
      boxesList: boxesList,
      requestedQuantity: key
    };
    DeviceApiAction.checkAvailabilityAPI(payload, key)
      .then((response) => {
        if (response != null) {
          if (response.data) {
            setAllDevicesList(response.data);
            console.log(response);
          } else {
            alert(response.message);
            setAllDevicesList([])
          }

        } else {
          setAllDevicesList([]);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  const list = [...allDevicesList];

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const currentDate = `${year}-${month}-${day}`;
    return currentDate;
  }

  const saveAllDevicesList = async (e) => {

    setIsLoading(true);
    const currentDate = getCurrentDate();
    const { stateId, key } = location?.state || { stateId: "NA", key: "NA" };

    console.log(currentDate);
    const userId = localStorage.getItem("userID");
    console.log("userId", userId);
    const payload = {
      clientId: clientId,
      stateId: stateId,
      issuedDate: currentDate,
      requestDevices: Number(key),
      boxs: allDevicesList.map(({ deviceDtoList, id }) => ({
        deviceIds: deviceDtoList
          .filter(({ isChecked }) => isChecked)
          .map(({ id }) => id),
        id,
      })),
      createdAt: currentDate,
      createdBy: Number(userId),
      updatedAt: null,
      updatedBy: null,
     

    };
    console.log("payload", payload);
    console.log("boxs", payload.boxs);
    const response = await DeviceApiAction.saveAllDevicesFromBox(payload);
    if (response != null) {
      setIsLoading(false);
      if (response.status == 200) {
        alert(response.message);

        navigate("/AllIssuesDevices");
      } else {
        setIsLoading(false);

        alert(response.message);
      }
    }
    // if (payload) {
    //   const saveApi = await DeviceApiAction.saveAllDevicesFromBox(payload);
    //   debugger;
    //   console.log(saveApi);
    //   // if (
    //   //   saveApi?.message !== "Bad Request" ||
    //   //   saveApi?.message !== "Network Error"
    //   // ) {
    //   //   alert(saveApi?.message);
    //   //   navigate("/AllIssuesDevices");
    //   // } else {
    //   //   alert(saveApi?.message);
    //   // }
    // } else {
    //   alert("something went wrong");
    // }
  };

  const rows =
    allDevicesList &&
    Array.isArray(allDevicesList) &&
    allDevicesList.length > 0 &&
    allDevicesList.map((device) => {
      return createData(
        device.boxNo,
        device.createdAt
          ? moment.utc(device.createdAt).format("DD/MM/YYYY hh:mm a")
          : null,
        device.currentQuantity
      );
    });

  useEffect(() => {
    if (list && list.length > 0 && firstRender) {

      const updatedList = list.map((item) => {
        const updatedDeviceDtoList = item.deviceDtoList.map((device) => {
          if (device && key > 0) {
            const updatedDevice = {
              ...device,
              isChecked: true,
            };
            key--;

            return updatedDevice;
          }
          return device;
        });

        const checkedChildList = updatedDeviceDtoList.filter(
          (device) => device.isChecked
        );

        return {
          ...item,
          deviceDtoList: updatedDeviceDtoList,
          isChecked: updatedDeviceDtoList.length === checkedChildList.length,
        };
      });
      console.log(updatedList);
      setAllDevicesList(updatedList);
      setFirstRender(false);
    }
  }, [location, allDevicesList, firstRender]);

  useEffect(() => {
    console.log("allDevicesList", allDevicesList);
  }, [allDevicesList]);

  // useEffect(() => {
  //   setAllDevicesList((prevList) => {
  //     return prevList.map((item) => {
  //       const childLength = item.deviceDtoList.length;
  //       const filteredChildLength = item.deviceDtoList.filter((val) => val.isChecked).length;

  //       return {
  //         ...item,
  //         isChecked: childLength === filteredChildLength,
  //       };
  //     });
  //   });
  // }, [list]);
  // const changeCount = () => {
  //   let count = requestQuantity;
  //   for (let i = 0; i < allDevicesList.length; i++) {
  //     for (let j = 0; j < allDevicesList[i].deviceDtoList.length; j++) {
  //       if (allDevicesList[i].deviceDtoList[j].isChecked === true) {
  //         count++;
  //       } else {
  //         count--;
  //       }
  //     }
  //   }
  //   setRequestQuantity(count);
  //   console.log("requestQuantityString", count);
  // };
  React.useEffect(() => {
    if (location?.state) {
      let { stateId, key, clientId, quantity, boxesList } = location.state;
      setKey(key);
      setClientId(clientId);
      setKey(key);
      setRequestQuantity(quantity);
      stateId && key && getAllDevicesBox(stateId, key, boxesList);
    }
  }, [location]);
  // console.log("all", requestQuantity);
  return (
    <div className="main_container">
      {/* <Loader isOpen={isLoading}/> */}
      <LoadingComponent isLoading={isLoading} />

      <Box className="main">
        <ThemeProvider theme={theme}>
          <Grid container sx={{ marginTop: "0rem" }} rowGap={2}>
            <Grid
              item
              xs={12}
              container
              justifyContent={"space-between"}
              flexWrap="nowrap"
            // alignItems={"center"}
            >
              <Grid item>
                <Typography
                  sx={{
                    color: "rgb(14 57 115 / 86%)",
                    fontSize: "25px",
                    padding: "",
                  }}
                >
                  Select Devices from Boxes
                  <Divider />
                </Typography>
              </Grid>
              <Grid item sx={{ padding: "10px 20px" }}>
                <Typography
                  sx={{
                    color: "rgb(14 57 115 / 86%)",
                    // fontSize: "25px",
                    padding: "",
                  }}
                >
                  Request Quantity: {requestQuantity || "NA"}
                </Typography>
              </Grid>
            </Grid>
            {/* <Grid item sx={{ width: "33.33%" }}>
              <Grid item sx={{ padding: "10px 20px" }}>
                <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                  Select Company<span style={{ color: "red" }}>*</span>
                </Typography>
                <CustomAutoComplete
                  disablePortal
                  id="combo-box-demo"
                  options={companiesList ? companiesList : []}
                  value={companyName}
                  getOptionLabel={({ companyName }) => {
                    return companyName;
                  }}
                  onChange={(e, newValue) => {
                    companiesHandler(e, newValue);
                    setClientId(newValue?.id);
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
            </Grid> */}
            <Grid item xs={12}>
              <Paper sx={{ width: "100%", mb: 2 }} elevation={1}>
                <TableContainer>
                  <Table aria-label="collapsible table">
                    <TableHead>
                      <TableRow
                        sx={{ backgroundColor: "rgb(14 57 115 / 86%)" }}
                      >
                        <TableCell align="center" sx={{ color: "white" }}>
                          Select All Devices
                        </TableCell>
                        <TableCell align="center" sx={{ color: "white" }}>
                          Boxes
                        </TableCell>
                        <TableCell align="center" sx={{ color: "white" }}>
                          Date
                        </TableCell>
                        <TableCell align="center" sx={{ color: "white" }}>
                          Quantity
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allDevicesList &&
                        Array.isArray(allDevicesList) &&
                        allDevicesList.length > 0 &&
                        allDevicesList.map((row, index) => (
                          <Row
                            key={row.id}
                            index={index}
                            row={row}
                            data={allDevicesList}
                            setData={setAllDevicesList}
                            deviceRequestQuantity={key}
                            setRequestQuantity={setRequestQuantity}
                            requestQuantity={requestQuantity}
                          />
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
            <Grid item sx={{ width: "100%" }} align="right">
              <Grid item sx={{ padding: "0px 20px" }}>
                <Button
                  sx={{ color: "white", height: "2.7rem", width: "10rem" }}
                  variant="contained"
                  onClick={(e) => saveAllDevicesList(e)}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </ThemeProvider>
      </Box>
    </div>
  );
}

export default BoxSelectionQuantity;
