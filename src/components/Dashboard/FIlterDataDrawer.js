import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Grid, TextField, Typography, filledInputClasses } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CustomAutoComplete } from "./Dashboard";

export default function FilterDataDrawer({
  setOpen,
  open,
  right,
  tabStatus,
  tabStatusHandler,
  softwareVersionList,
  setSoftwareVersionId,
  setNewSoftwareVersionList,
  IdBool,
  setIdBool,
  setPageSize,
  setPageNo
}) {
  const [state, setState] = useState({
    right: false
  });
  const [selectedValue, setSelectedValue] = useState("all");
  const [errors, setErrors] = useState({});
  const [softwareVersionsArray, setSoftwareVersionArray] = useState([]);
  const [previousValue, setPreviousValue] = useState("");
  const [softwareError, setSoftwareError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  // const [newErrors, setNewErrors] = useState({
  //   all: {},
  //   live: {},
  //   history: {}
  // });
  const variable = {
    softwareVersion: "",
    can: "",
    L89: ""
  };
  const [dataList, setDataList] = useState({
    all: variable,
    live: {
      ...variable,
      network: "",
      accWorking: ""
    },
    history: {
      ...variable,
      mainServerState: "",
      secondServerState: "",
      thirdServerState: "",
      fourthServerState: ""
    }
  });
  const handleRadioChange = (event) => {
    setPreviousValue(event.target.value);
    setSelectedValue(event.target.value);
  };
  console.log("ss", dataList);
  const canNotCan = [
    { id: 1, name: "Can", value: "_C" },
    { id: 2, name: "Without Can", value: "_W" }
  ];

  const L89OkNot = [
    { id: 1, name: "L89 Ok", value: "_1" },
    { id: 2, name: "L89 Not Working", value: "_0" }
  ];

  const Network = [
    { id: 1, name: "Primary", value: [0, 2, 4, 6] },
    { id: 2, name: "Secondary", value: [1, 3, 5] }
  ];

  const aacordingG = [
    { id: 1, name: "Acc_Gyro Working", value: "_1" },
    { id: 2, name: "Acc_Gyro Not Working", value: "_0" }
  ];

  const serverSite = Array.from({ length: 21 }, (_, i) => ({
    id: i,
    name: i,
    value: `_${i}`
  }));

  const countToOtherData = Array.from({ length: 9 }, (_, i) => ({
    id: i,
    name: i,
    value: `_${i}`
  }));

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const newErrors = {
    all: {},
    live: {},
    history: {}
  };

  // const validation = () => {
  //   const fieldErrorMap = {
  //     softwareVersion: "Please Select Software version!",
  //     can: "Please Select Can",
  //     L89: "Please Select L89",
  //     network: "Please Select Network",
  //     accWorking: "Please Select According Gyro",
  //     mainServerState: "Please Select Main Server State",
  //     secondServerState: "Please Select Second Server State",
  //     thirdServerState: "Please Select Third Server State",
  //     fourthServerState: "Please Select Fourth Server State"
  //   };

  //   // // Iterate through fields and check for missing values
  //   // for (const field in fieldErrorMap) {
  //   //   if (!dataList[selectedValue][field]) {
  //   //     newErrors[field] = fieldErrorMap[field];
  //   //   } else {
  //   //     delete newErrors[field]; // Remove error if field is valid
  //   //   }
  //   // }
  //   if (!dataList[selectedValue].softwareVersion) {
  //     newErrors[selectedValue] = {softwareVersion: fieldErrorMap.softwareVersion}
  //   }

  //   setErrors(newErrors);

  //   return Object.keys(newErrors[selectedValue]).length === 0; // Return true if there are no errors, false if there are errors
  // };

  const handleSubmit = () => {
    debugger;
    const data = dataList[selectedValue];
    const baseData =
      (data?.softwareVersion ? data.softwareVersion : "") +
      (data?.can ? data.can.value : "") +
      (data?.L89 ? data.L89.value : "");

      console.log("baseData",baseData);

    // const isValidation = validation();
    // if (isValidation) {
    let softwareVersionsArray = [];

    if (baseData !== undefined && baseData !== null && baseData !== "") {
      switch (selectedValue) {
        case "all":
          softwareVersionsArray.push(baseData);
          break;
        case "live":
          if (
            data &&
            data.network &&
            data.network.value &&
            data.network.value.length > 0
          ) {
            const networkArray = data.network.value.map(
              (ele) => baseData + "_" + ele
            );
            softwareVersionsArray.push(...networkArray);
            if (data?.accWorking?.value) {
              softwareVersionsArray = [];
              // setSoftwareVersionArray([]);
              const liveData = networkArray.map(
                (ele) => ele + data.accWorking.value
              );
              softwareVersionsArray.push(...liveData);
            }
          } else {
            softwareVersionsArray.push(baseData);
          }
          break;
        case "history":
          softwareVersionsArray.push(
            baseData +
              (data.mainServerState ? data.mainServerState.value : "") +
              (data.secondServerState ? data.secondServerState.value : "") +
              (data.thirdServerState ? data.thirdServerState.value : "") +
              (data.fourthServerState ? data.fourthServerState.value : "")
          );
          break;
        default:
          break;
      }
    }
    console.log(softwareVersionsArray === "", "hhab");

    if (softwareVersionsArray.length > 0) {
      // setSelectedValue("all");
      // console.log(softwareVersionsArray, "hhab");

      setNewSoftwareVersionList(softwareVersionsArray);
      setIdBool(true);
      setPageSize(10);
      setPageNo(0);
      // setDataList({
      //   all: variable,
      //   live: {
      //     ...variable,
      //     network: "",
      //     accWorking: ""
      //   },
      //   history: {
      //     ...variable,
      //     mainServerState: "",
      //     secondServerState: "",
      //     thirdServerState: "",
      //     fourthServerState: ""
      //   }
      // });
      setSoftwareVersionArray([]);
      setState({ right: false });
    } else {
      setNewSoftwareVersionList([]);
      setIdBool(true);
      setState({ right: false });
    }
    // }
  };

  console.log(softwareVersionsArray, "vaghdb");
  const autoCompleteHandle = (selected, name, value) => {
    console.log(value);
    if (value !== null) {
      setDataList((prev) => ({
        ...prev,
        [selected]: {
          ...prev[selected],
          [name]: value
        }
      }));
    } else {
      setDataList({
        ...dataList,
        [selected]: {
          ...dataList[selected],
          [name]: ""
        }
      });
    }
  };

  console.log(dataList, "dataList");
  const list = (anchor) => (
    <Box
      sx={{
        width: anchor === "top" || anchor === "bottom" ? "auto" : 500,
        overflow: "hidden"
      }}
      role="presentation"
    >
      <Grid
        container
        xs={12}
        spacing={2}
        style={{ padding: "0px 15px", marginTop: "50px" }}
      >
        <Grid item xs={10} align="left">
          <Typography
            variant={"h5"}
            style={{
              fontWeight: "bold",
              marginTop: 10,
              width: "100%",
              color: "rgb(14 57 115 / 86%)"
            }}
          >
            Filter Preferences
          </Typography>
        </Grid>
        <Grid item xs={2} align="right" style={{ marginTop: 15 }}>
          <CloseIcon
            style={{ cursor: "pointer", color: "rgb(14 57 115 / 86%)" }}
            onClick={toggleDrawer(anchor, false)}
          />
        </Grid>
      </Grid>
      <Divider className="divider" />
      <Grid container justifyContent="center" alignItems="center">
        <FormControl sx={{ marginTop: "10px", textAlign: "center" }}>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={selectedValue}
            onChange={handleRadioChange}
          >
            <FormControlLabel value="all" control={<Radio />} label="All" />
            <FormControlLabel value="live" control={<Radio />} label="Live" />
            <FormControlLabel
              value="history"
              control={<Radio />}
              label="History"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Divider className="divider" />
      <Grid
        container
        sx={{
          margin: "0px",
          justifyContent: "center",
          fontSize: "32px",
          paddingTop: "20px"
        }}
        xs={12}
      >
        {selectedValue === "all" ||
        selectedValue === "live" ||
        selectedValue === "history" ? (
          <>
            <Grid style={{ marginTop: "1.4rem", width: "100%" }} xs={10}>
              <CustomAutoComplete
                disablePortal
                id="combo-box-demo"
                options={softwareVersionList || []}
                value={dataList[selectedValue].softwareVersion || []}
                getOptionLabel={(value) => {
                  return value;
                }}
                onChange={(e, newValue) =>
                  autoCompleteHandle(selectedValue, "softwareVersion", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    label={
                      <span style={{ fontSize: "18px" }}>Software Version</span>
                    }
                    error={errors[selectedValue]?.softwareVersion}
                    helperText={errors[selectedValue]?.softwareVersion}
                  />
                )}
              />
            </Grid>
            <Grid style={{ marginTop: "1.4rem", width: "100%" }} xs={10}>
              <CustomAutoComplete
                disablePortal
                id="combo-box-demo"
                options={canNotCan ? canNotCan : []}
                value={
                  dataList[selectedValue].softwareVersion === ""
                    ? (dataList[selectedValue].can = "")
                    : dataList[selectedValue].can
                }
                disabled={
                  dataList[selectedValue].softwareVersion ? false : true
                }
                getOptionLabel={(option) => option.name || ""}
                onChange={(e, newValue) =>
                  autoCompleteHandle(selectedValue, "can", newValue)
                }
                // onBlur={() => {
                //   if (!dataList[selectedValue]?.softwareVersion) {
                //     setSoftwareError("Please provide software version.");
                //   } else setSoftwareError(false);
                // }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    label={<span style={{ fontSize: "18px" }}>Can</span>}
                    error={
                      errors[selectedValue]?.can || softwareError?.data?.can
                    }
                    helperText={
                      errors[selectedValue]?.can || softwareError?.data?.can
                    }
                  />
                )}
              />
            </Grid>
            <Grid style={{ marginTop: "1.4rem", width: "100%" }} xs={10}>
              <CustomAutoComplete
                disablePortal
                id="combo-box-demo"
                options={L89OkNot ? L89OkNot : []}
                value={
                  dataList[selectedValue].softwareVersion === "" ||
                  dataList[selectedValue].can === ""
                    ? (dataList[selectedValue].L89 = "")
                    : dataList[selectedValue].L89
                }
                disabled={
                  dataList[selectedValue].softwareVersion &&
                  dataList[selectedValue].can
                    ? false
                    : true
                }
                getOptionLabel={(option) => option.name || ""}
                onChange={(e, newValue) =>
                  autoCompleteHandle(selectedValue, "L89", newValue)
                }
                // onBlur={() => {
                //   if (
                //     !dataList[selectedValue]?.softwareVersion ||
                //     !dataList[selectedValue]?.can
                //   ) {
                //     setSoftwareError({
                //       data: {
                //         softwareVersion: "Select Software Version",
                //         can: "Select Can"
                //       }
                //     });
                //   } else setSoftwareError(false);
                // }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    label={<span style={{ fontSize: "18px" }}>L89</span>}
                    error={errors[selectedValue]?.L89}
                    helperText={errors[selectedValue]?.L89}
                  />
                )}
              />
            </Grid>
          </>
        ) : (
          ""
        )}

        {selectedValue === "live" && (
          <>
            <Grid style={{ marginTop: "1.4rem", width: "100%" }} xs={10}>
              <CustomAutoComplete
                disablePortal
                id="combo-box-demo"
                options={Network ? Network : []}
                value={
                  dataList[selectedValue].softwareVersion === "" ||
                  dataList[selectedValue].can === "" ||
                  dataList[selectedValue].L89 === ""
                    ? (dataList[selectedValue].network = "")
                    : dataList[selectedValue].network
                }
                getOptionLabel={(option) => option.name || ""}
                disabled={
                  dataList[selectedValue].softwareVersion &&
                  dataList[selectedValue].can &&
                  dataList[selectedValue].L89
                    ? false
                    : true
                }
                onChange={(e, newValue) =>
                  autoCompleteHandle(selectedValue, "network", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    label={<span style={{ fontSize: "18px" }}>Network</span>}
                    error={errors[selectedValue]?.network}
                    helperText={errors[selectedValue]?.network}
                  />
                )}
              />
            </Grid>
            <Grid style={{ marginTop: "1.4rem", width: "100%" }} xs={10}>
              <CustomAutoComplete
                disablePortal
                id="combo-box-demo"
                options={aacordingG ? aacordingG : []}
                value={
                  dataList[selectedValue].softwareVersion === "" ||
                  dataList[selectedValue].can === "" ||
                  dataList[selectedValue].L89 === "" ||
                  dataList[selectedValue].network === ""
                    ? (dataList[selectedValue].accWorking = "")
                    : dataList[selectedValue].accWorking
                }
                getOptionLabel={(option) => option.name || ""}
                disabled={
                  dataList[selectedValue].softwareVersion &&
                  dataList[selectedValue].can &&
                  dataList[selectedValue].L89 &&
                  dataList[selectedValue].network
                    ? false
                    : true
                }
                onChange={(e, newValue) =>
                  autoCompleteHandle(selectedValue, "accWorking", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    label={
                      <span style={{ fontSize: "18px" }}>According Gyro</span>
                    }
                    error={errors[selectedValue]?.accWorking}
                    helperText={errors[selectedValue]?.accWorking}
                  />
                )}
              />
            </Grid>
          </>
        )}
        {selectedValue === "history" && (
          <>
            <Grid style={{ marginTop: "1.4rem", width: "100%" }} xs={10}>
              <CustomAutoComplete
                disablePortal
                id="combo-box-demo"
                options={serverSite ? serverSite : []}
                value={
                  dataList[selectedValue].softwareVersion === "" ||
                  dataList[selectedValue].can === "" ||
                  dataList[selectedValue].L89 === ""
                    ? (dataList[selectedValue].mainServerState = "")
                    : dataList[selectedValue].mainServerState
                }
                getOptionLabel={(option) => option.name || ""}
                disabled={
                  dataList[selectedValue].softwareVersion &&
                  dataList[selectedValue].can &&
                  dataList[selectedValue].L89
                    ? false
                    : true
                }
                onChange={(e, newValue) =>
                  autoCompleteHandle(selectedValue, "mainServerState", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    label={
                      <span style={{ fontSize: "18px" }}>
                        Main Server State
                      </span>
                    }
                    error={errors[selectedValue]?.mainServerState}
                    helperText={errors[selectedValue]?.mainServerState}
                  />
                )}
              />
            </Grid>
            <Grid style={{ marginTop: "1.4rem", width: "100%" }} xs={10}>
              <CustomAutoComplete
                disablePortal
                id="combo-box-demo"
                options={countToOtherData ? countToOtherData : []}
                value={
                  dataList[selectedValue].softwareVersion === "" ||
                  dataList[selectedValue].can === "" ||
                  dataList[selectedValue].L89 === "" ||
                  dataList[selectedValue].mainServerState === ""
                    ? (dataList[selectedValue].secondServerState = "")
                    : dataList[selectedValue].secondServerState
                }
                getOptionLabel={(option) => option.name || ""}
                disabled={
                  dataList[selectedValue].softwareVersion &&
                  dataList[selectedValue].can &&
                  dataList[selectedValue].L89 &&
                  dataList[selectedValue].mainServerState
                    ? false
                    : true
                }
                onChange={(e, newValue) =>
                  autoCompleteHandle(
                    selectedValue,
                    "secondServerState",
                    newValue
                  )
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    label={
                      <span style={{ fontSize: "18px" }}>
                        Second Server Site
                      </span>
                    }
                    error={errors[selectedValue]?.secondServerState}
                    helperText={errors[selectedValue]?.secondServerState}
                  />
                )}
              />
            </Grid>
            <Grid style={{ marginTop: "1.4rem", width: "100%" }} xs={10}>
              <CustomAutoComplete
                disablePortal
                id="combo-box-demo"
                options={countToOtherData ? countToOtherData : []}
                value={
                  dataList[selectedValue].softwareVersion === "" ||
                  dataList[selectedValue].can === "" ||
                  dataList[selectedValue].L89 === "" ||
                  dataList[selectedValue].mainServerState === "" ||
                  dataList[selectedValue].secondServerState === ""
                    ? (dataList[selectedValue].thirdServerState = "")
                    : dataList[selectedValue].thirdServerState
                }
                getOptionLabel={(option) => option.name || ""}
                disabled={
                  dataList[selectedValue].softwareVersion &&
                  dataList[selectedValue].can &&
                  dataList[selectedValue].L89 &&
                  dataList[selectedValue].mainServerState &&
                  dataList[selectedValue].secondServerState
                    ? false
                    : true
                }
                onChange={(e, newValue) =>
                  autoCompleteHandle(
                    selectedValue,
                    "thirdServerState",
                    newValue
                  )
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    label={
                      <span style={{ fontSize: "18px" }}>
                        Third Server Site
                      </span>
                    }
                    error={errors[selectedValue]?.thirdServerState}
                    helperText={errors[selectedValue]?.thirdServerState}
                  />
                )}
              />
            </Grid>
            <Grid style={{ marginTop: "1.4rem", width: "100%" }} xs={10}>
              <CustomAutoComplete
                disablePortal
                id="combo-box-demo"
                options={countToOtherData ? countToOtherData : []}
                value={
                  dataList[selectedValue].softwareVersion === "" ||
                  dataList[selectedValue].can === "" ||
                  dataList[selectedValue].L89 === "" ||
                  dataList[selectedValue].mainServerState === "" ||
                  dataList[selectedValue].secondServerState === "" ||
                  dataList[selectedValue].thirdServerState === ""
                    ? (dataList[selectedValue].fourthServerState = "")
                    : dataList[selectedValue].fourthServerState
                }
                getOptionLabel={(option) => option.name || ""}
                disabled={
                  dataList[selectedValue].softwareVersion &&
                  dataList[selectedValue].can &&
                  dataList[selectedValue].L89 &&
                  dataList[selectedValue].mainServerState &&
                  dataList[selectedValue].secondServerState &&
                  dataList[selectedValue].thirdServerState
                    ? false
                    : true
                }
                onChange={(e, newValue) =>
                  autoCompleteHandle(
                    selectedValue,
                    "fourthServerState",
                    newValue
                  )
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    label={
                      <span style={{ fontSize: "18px" }}>
                        Fourth Server Site
                      </span>
                    }
                    error={errors[selectedValue]?.fourthServerState}
                    helperText={errors[selectedValue]?.fourthServerState}
                  />
                )}
              />
            </Grid>
          </>
        )}
      </Grid>

      <Grid
        container
        sx={{
          margin: "4px 0px",
          justifyContent: "end",
          fontSize: "32px",
          paddingTop: "20px"
        }}
        xs={12}
      >
        <Button
          variant="contained"
          sx={{
            padding: "0.5rem",
            border: "1px solid rgb(14 57 115 / 86%)",
            color: "white",
            backgroundColor: "rgb(14 57 115 / 86%)",
            margin: "4px 10px"
          }}
          onClick={toggleDrawer(anchor, false)}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            padding: "0.5rem",
            border: "1px solid rgb(14 57 115 / 86%)",
            color: "white",
            backgroundColor: "rgb(14 57 115 / 86%)",
            margin: "4px 10px"
          }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Grid>
      <Divider className="divider" />
    </Box>
  );

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button
            onClick={toggleDrawer(anchor, true)}
            variant={
              tabStatus === "filterConfiguration" ? "contained" : "outlined"
            }
            sx={{
              padding: "0.5rem",
              border: "1px solid rgb(14 57 115 / 86%)",
              color: tabStatus === "filterConfiguration" ? "white" : "black",
              backgroundColor:
                tabStatus === "filterConfiguration"
                  ? "rgb(14 57 115 / 86%)"
                  : "#f5f5dc"
            }}
          >
            {"Filter Preferences"}
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
