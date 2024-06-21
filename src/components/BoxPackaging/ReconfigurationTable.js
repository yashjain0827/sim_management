import React, { useRef } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import styled, { ThemeProvider } from "styled-components";
import { Button, Grid, TablePagination, createTheme } from "@mui/material";
import { useState } from "react";
import { CommandAction } from "../actions/command";
import { useEffect } from "react";
import moment from "moment";
import LoadingComponent from "../CommonComponents/LoadingComponts";
import { BoxPackaging } from "../actions/boxPackaging";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReconfigurationCommandStepperModal from "./commandConfigModal";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import NewDeviceConfigData from "./newDeviceConfigureModal";
import DeleteIcon from "@mui/icons-material/Delete";
const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 800,
    fontSize: 20,
    background: "#666",
  },
});
// import './style.css'
const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(14 57 115 / 86%)",
    },
  },
});

const tableCellStyle = {
  color: "#fff",
  fontSize: "15px",

  background: "rgb(14 57 115 / 86%)",
};
const innerTableCellStyle = {
  color: "#fff",
  fontSize: "15px",

  background: "rgb(14 57 115 / 86%)",
  zIndex: 100,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.white,
    color: theme.palette.common.white,
    // zIndex: 10,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
    fontWeight: "bold",
    fontSize: "15px",
  },
  "&:last-child td, &:last-child th": {},
}));

function ReconfigurationTable({
  TableHeadData,
  data,
  setLoading,
  InnerTableHeader,
  reconfigurationList,
  finishReconfiguration,
}) {
  const port = useRef(null);
  const [deviceNumber, setDeviceNumber] = useState("");

  // ref to store device response
  const accumulateString = useRef("");
  const count = useRef(null);
  const isPromiseResolved = useRef(null);
  const bufferVoltage = useRef(0);
  const timerId = useRef(null);
  const [selectedBox, setSelectedBox] = useState();
  const [selectedDevice, setSelecetedDevice] = useState();
  const [showTestedDeviceSaveBtn, setShowTestedDeviceSaveBtn] = useState(false);

  const [isPortConnected, setIsPortConnected] = useState(false);
  const [openRowIndex, setOpenRowIndex] = React.useState(null);
  const [commandModalOpen, setCommandModalOpen] = useState(false);
  const [clientModalCommands, setClientModalCommands] = useState([]);
  const [clientModalCommandsOld, setClientModalCommandsOld] = useState([]);
  const [alldeviceList, setAlldeviceList] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [open, setOpen] = useState(false);
  const [isNewConfigModalOpen, setIsNewConfigModalOpen] = useState(false);
  const openModalHandler = () => {
    setCommandModalOpen(true);
  };

  async function getDeviceDataHandler() {
    setLoading(true);

    debugger;
    let data = {
      search: deviceNumber,
    };
    const res = await BoxPackaging.getDeviceInfoByImeiNo(data);
    if (res.responseCode == 200 || res.responseCode == 200) {
      const array = { ...res?.data, withoutBox: true };
      // setSelecetedDevice(array);

      setAlldeviceList((pre) => [array, ...pre]);
      setDeviceList((pre) => [array, ...pre]);
      setIsNewConfigModalOpen(false);
    }
    setLoading(false);
  }

  function newDeviceRemoveHandler(data) {
    setAlldeviceList((pre) =>
      pre.filter((ele) => {
        return ele.id != data.id;
      })
    );
    setDeviceList((pre) =>
      pre.filter((ele) => {
        return ele.id != data.id;
      })
    );
  }
  async function fetchReconfigCommands(reconfigBoxId) {
    let data = {
      reConfigureBoxId: reconfigBoxId,
    };

    const response = await BoxPackaging.fetchReconfigCommands(data);

    if (response) {
      console.log(response.data);
      return response?.data ?? [];
    }
  }

  async function getBoxListById(rowData) {
    setLoading(true);
    const data = {
      boxId: Number(rowData?.boxId),
      reConfigureBoxId: rowData ? rowData.id : "",
    };
    await BoxPackaging.fetchreconfigureBoxDevicesList(data)
      .then((res) => {
        console.log(res);
        if (res != null && res.responseCode == 200) {
          setLoading(false);
          setAlldeviceList(res?.data?.deviceList);
          setDeviceList(res?.data?.deviceList);
          //   setBoxDetails(res?.data?.boxDeviceDTO?.boxDTO);
        } else {
          setLoading(false);
          setDeviceList([]);
          setAlldeviceList([]);
          //   setBoxDetails();
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        setAlldeviceList([]);
        setDeviceList([]);
      });
  }

  async function saveReconfigureDevice() {
    const { id } = selectedBox;
    const { imeiNo } = selectedDevice;
    let data = {
      isReConfigured: true,
      userId: JSON.parse(localStorage.getItem("data")).id,
      imeiNo: imeiNo,
      reConfigureBoxId: id || null,
    };

    const res = await BoxPackaging.saveReconfigureDevice(data);
    if (res) {
      if (res.responseCode != 200 || res.responseCode != 201) {
        alert(res.message);
        reconfigurationList();
      }
      console.log(res);
      // setClientModalCommands([]);
      count.current = 0;
      accumulateString.current = 0;
      setShowTestedDeviceSaveBtn(false);
      setSelecetedDevice();
      setOpen(false);
      getBoxListById(selectedBox);

      // return res.responseCode;
    }
  }

  async function saveCommand(response, command, success) {
    const { id } = selectedBox;
    const { imeiNo } = selectedDevice;
    let data = {
      command: command,
      userId: JSON.parse(localStorage.getItem("data")).id,
      imeiNo: imeiNo,
      reConfigureBoxId: id,
      response: response,
    };

    const res = await BoxPackaging.saveReconfigurationResponse(data);
    if (res) {
      if (res.responseCode != 200 || res.responseCode != 201) {
        // alert(res.message);
      }
      console.log(res);

      return res.responseCode;
    }
  }
  let masterInfo = {};
  function areKeysPresent(object, string, commandType, sequenceNo) {
    // let resultObj = { ...object };
    let resultObj = {};

    string = string.toUpperCase();
    console.log(string);
    for (const key in object) {
      let pattern, match;

      if (object.hasOwnProperty(key)) {
        if (key == "SINFO4" || key == "SINFO2") {
          return { valid: true, key: key };
        }
        // const pattern = new RegExp(`${key.toUpperCase()}:(.*?)(,|$)`);
        if (object[key] != "CHECKONLYKEY") {
          pattern = new RegExp(`${key.toUpperCase()}:(.*?)(,|$)`);

          match = string.match(pattern);
        } else if (!match) {
          // pattern = new RegExp(`${key.toUpperCase()}(.*?)(,|$)`);

          // match = string.match(pattern);
          const isPresent = string.includes(key.toUpperCase());
          if (!isPresent) {
            resultObj[key.toUpperCase()] = "Not Present";
            return { valid: false, key: key, resultObj };
          } else {
            pattern = new RegExp(`${key.toUpperCase()}`);
            match = string.match(pattern);

            resultObj[key.toUpperCase()] = "Present";
          }

          // match[0]=`${key.toUpperCase()}:Present`
          // match[1]=`Present`
        }

        console.log(match);
        if (match && commandType == "client" && count.current == 0) {
          let [name, value] = match[0].split(",")[0].split(":");
          console.log(name, value);
          resultObj[name] = value;
          if (localStorage.getItem("masterInfo")) {
            masterInfo = JSON.parse(localStorage.getItem("masterInfo"));
            if (masterInfo.IMEI && name == "UID") {
              value = `${moment().format("YYMM")}${masterInfo.IMEI.slice(-8)}`;
            }
          }

          localStorage.setItem(
            "masterInfo",
            JSON.stringify({ [name]: value, ...masterInfo })
          );
        }

        if (
          commandType == "beforeMaster" &&
          object[key]
            .toUpperCase()
            .includes(match[1].split(" ")[0].toUpperCase())
          // match[1].split(" ")[0].trim() !== "" &&
          // match[1].split(" ")[0].trim() !== "000" &&
          // match[1].split(" ")[0].trim() !== "6A6A"
        ) {
          return { valid: false, key: `${match[1].split(" ")[0]} detected` };
        } else if (
          commandType == "beforeMaster" &&
          true
          // (match[1].split(" ")[0].trim() == "" ||
          //   match[1].split(" ")[0].trim() == "000" ||
          //   match[1].split(" ")[0].trim() == "6A6A")
        ) {
          return { valid: true, key: `${match[1].split(" ")[0]} detected` };
        }
        if (
          object[key] != "CHECKONLYKEY" &&
          (!match || match[1].trim() === "")
        ) {
          return { key: key, valid: false };
        } else if (commandType != "master" && key == "ExtV") {
          console.log(match[1]);
          // if (
          //   Number(lotDetails?.externalVoltage) - bufferVoltage.current >
          //     Number(match[1]) ||
          //   Number(match[1]) >
          //     Number(lotDetails?.externalVoltage) + bufferVoltage.current
          // ) {
          //   resultObj[key.toUpperCase()] = match[1];
          //   return { valid: false, key, resultObj };
          // }
        } else if (commandType != "master" && key == "IntV") {
          console.log(match[1]);
          if (3.6 > Number(match[1]) || Number(match[1]) > 4.2) {
            resultObj[key.toUpperCase()] = match[1];

            return { valid: false, key, resultObj };
          }
        } else if (
          commandType != "master" &&
          object[key] != "CHECKONLYKEY" &&
          !object[key].toUpperCase().includes(match[1].toUpperCase()) &&
          sequenceNo == 3
        ) {
          return { key: key, valid: false };
        }
      }
      debugger;
      if (match.length > 1) {
        const [name, value] = match[0].split(",")[0].split(":");
        resultObj[name] = value;
      }
    }
    return { valid: true, resultObj };
  }

  function extractStringBetweenPattern(inputString) {
    const pattern = /\$DBG(.*?)DBG#/s;

    // Use regex.exec to extract the expression between "$DBG:" and "DBG#"
    const matches = pattern.exec(inputString);

    // Print the extracted expression
    if (matches && matches[1]) {
      return matches[1];
      console.log(matches[1]);
    } else {
      console.log("No match found.");
      return null;
    }

    return matches[1];
  }

  async function connectDeviceWithUsbPort(buttonText) {
    if ("serial" in navigator) {
      try {
        if (buttonText == "Connect Device") {
          port.current = await navigator.serial.requestPort();
          debugger;
          console.log(port.current.getInfo());
          setLoading(true);
          const p = await port.current.open({
            baudRate: 19200,
            dataBits: 8,
            stopBits: 1,
            flowControl: "none",
            // bufferSize: 1024 ,
            parity: "none",
          });

          setLoading(false);
          setIsPortConnected(true);
        } else {
          // alert(count.current);
          setLoading(true);
          count.current = 0;
          bufferTransactionHandler(
            clientModalCommands,
            clientModalCommands,
            "client"
          );
        }
      } catch (err) {
        alert(err);
        console.log("error connecting to device Please check the device", err);
        setLoading(false);
        setIsPortConnected(false);
      }
    } else {
      // this block run if your browser does not support serial API
      console.error(
        "Web serial doesn't seem to be enabled in your browser. Try enabling it by visiting:"
      );
      console.error(
        "chrome://flags/#enable-experimental-web-platform-features"
      );
      console.error("opera://flags/#enable-experimental-web-platform-features");
      console.error("edge://flags/#enable-experimental-web-platform-features");
    }
  }

  async function bufferTransactionHandler(
    commandArray,
    commandArrayForStepper,
    commandType
  ) {
    console.log(commandArray, commandArrayForStepper, commandType);

    // const p1=new Promise((resolve,reject)=>{
    //   setTimeout(()=>{
    //     // isPromiseResolved.current=true;
    //     alert("promise is resolved")
    //     return resolve(isPromiseResolved.current=true)
    //   },60000)
    // })
    timerId.current = null;

    timerId.current = setTimeout(() => {
      // console.log("Alarm triggered!");
      isPromiseResolved.current = true; // Set the flag to indicate alarm trigger
      // Throw an error to interrupt the execution of bufferTransactionHandler
      // setLoading(false);
      // alert("there is some issue with the device please check the software version!")
      // throw new Error("Alarm triggered");
    }, 60000);

    // 60 seconds timeout
    debugger;
    isPromiseResolved.current = false;
    const serialData = commandArray[count.current].command;
    const keyToVerify = commandArray[count.current].keyToVerify;
    const sequenceNo = commandArray[count.current].sequenceNo;

    // const waitingTime =
    //   commandArray[count.current].waitingTime - currentDelay.current;
    // expectedDelay.current = waitingTime;
    // // alert(serialData);
    console.log(serialData, keyToVerify);
    if (port.current && port.current.writable) {
      try {
        const writer = port.current.writable.getWriter();
        // setLoading(true);
        accumulateString.current = "";
        // if ("GET SINFO2:" == serialData && currentDelay.current == 0) {
        //   alert("Please bring the magnet close to device!");
        // }
        // if (
        //   "GET SINFO1:" == serialData &&
        //   commandType == "client" &&
        //   currentDelay.current == 0
        // ) {
        //   alert("Please plugin the emergency device!");
        // }
        //new TextEncoder().encode(serialData) this actually converts a string into Unit8Array/arrayBuffer/typedArray
        await writer.write(new TextEncoder().encode(serialData));
        writer.releaseLock();

        console.log(port.current, "serialport");

        let decoder = new TextDecoder();
        // setIsLoading(true);
        // setIsLoading(false);
        const reader = port.current.readable.getReader();

        // if (waitingTime > 0) {
        //   await sleepFunction();
        // }

        while (true) {
          const { value, done } = await reader.read();
          // setIsLoading(true);
          console.log(accumulateString.current);

          if (
            value &&
            keyToVerify != null &&
            keyToVerify != undefined &&
            Object.keys(keyToVerify).length != 0
          ) {
            console.log(decoder.decode(value));
            accumulateString.current += decoder.decode(value);
            console.log(accumulateString.current);
            if (accumulateString.current.includes("DBG#")) {
              isPromiseResolved.current = false;
              reader.releaseLock();
              // port.current.readable.cancel();
              console.log(accumulateString.current);
              accumulateString.current = extractStringBetweenPattern(
                accumulateString.current
              );
              // setSerialDataResponse(accumulateString.current);
              console.log(accumulateString.current);
              // ==========================================================
              if (
                accumulateString.current &&
                accumulateString.current != null &&
                accumulateString.current != undefined
              ) {
                debugger;
                const cleanString = accumulateString.current
                  .replace(/\s+/g, " ")
                  .trim();
                console.log(
                  accumulateString.current.replace(/\s+/g, " ").trim()
                );

                const { valid, key, resultObj } = areKeysPresent(
                  keyToVerify,
                  cleanString,
                  commandType,
                  sequenceNo
                );
                console.log(valid, key, resultObj);
                if (
                  false &&
                  "IMEI" in resultObj &&
                  resultObj.IMEI != selectedDevice?.imeiNo
                ) {
                  alert(
                    "Plugged in device's imei number is different from box's device!"
                  );
                  accumulateString.current = "";
                  setIsPortConnected(false);
                  setLoading(false);
                  break;
                }
                debugger;
                if (valid) {
                  debugger;
                  // setIsLoading(false);

                  // alert("command successfull!");
                  const commandResponse = await saveCommand(
                    accumulateString.current,
                    serialData,
                    valid
                  );
                  debugger;
                  if (commandResponse != 200 && commandResponse != 201) {
                    // count.current = 0;
                    accumulateString.current = "";
                    setLoading(false);

                    const finalArray = commandArrayForStepper.map((ele) => {
                      return ele.sequenceNo < sequenceNo
                        ? { ...ele, isCompleted: true }
                        : ele.sequenceNo == sequenceNo
                        ? { ...ele, isCompleted: false, resultObj }
                        : ele;
                    });
                    if (commandType == "client") {
                      setClientModalCommands(finalArray);
                    } else {
                      setClientModalCommands(finalArray);
                    }
                    return;
                  }
                  // expectedDelay.current = 0;
                  // currentDelay.current = 0;
                  accumulateString.current = "";
                  count.current++;
                  debugger;
                  // check wheather all the commands are finished if so make all stepper green
                  if (commandArray.length == count.current) {
                    const finalArray = commandArrayForStepper.map((ele) => {
                      return ele.sequenceNo < sequenceNo
                        ? { ...ele, isCompleted: true }
                        : ele.sequenceNo == sequenceNo
                        ? { ...ele, isCompleted: true, resultObj }
                        : ele;
                    });
                    if (commandType == "client") {
                      setClientModalCommands(finalArray);
                    } else {
                      setClientModalCommands(finalArray);
                    }
                    setLoading(false);
                    setShowTestedDeviceSaveBtn(true);
                    return;
                    // setIsMasterDOne(true);
                  }
                  // if (commandType == "client" && count.current == commandArray.length) {
                  //   setShowTestedDeviceSaveBtn(true);
                  // }
                  if (
                    commandType == "client" &&
                    count.current == commandArray.length &&
                    (commandResponse == 200 || commandResponse == 201)
                  ) {
                    setShowTestedDeviceSaveBtn(true);
                  }

                  if (commandArray.length > count.current) {
                    const finalArray = commandArrayForStepper.map((ele) => {
                      return ele.sequenceNo < sequenceNo
                        ? { ...ele, isCompleted: true }
                        : ele.sequenceNo == sequenceNo
                        ? { ...ele, isCompleted: true, resultObj }
                        : ele;
                    });
                    if (commandType == "client") {
                      setClientModalCommands(finalArray);
                    } else {
                      setClientModalCommands(finalArray);
                    }
                    bufferTransactionHandler(
                      commandArray,
                      // commandArrayForStepper,
                      finalArray,
                      commandType
                    );
                  }
                  // count.current++;
                  // bufferTransactionHandler(commandArray[count.current]);
                  // document.getElementById("check-command-btn").click()
                } else {
                  // expectedDelay.current = 0;
                  // currentDelay.current = 0;
                  alert("command failed!");
                  // setIsLoading(false);
                  saveCommand(accumulateString.current, serialData, valid, key);

                  const finalArray = commandArrayForStepper.map((ele) => {
                    return ele.sequenceNo < sequenceNo
                      ? { ...ele, isCompleted: true }
                      : ele.sequenceNo == sequenceNo
                      ? { ...ele, isCompleted: false, resultObj }
                      : { ele };
                  });
                  if (commandType == "master") {
                    // setMasterCommandsOld(finalArray);
                  } else {
                    setClientModalCommandsOld(finalArray);
                  }
                  accumulateString.current = "";
                }
              } else {
                alert("Unexpected Response Found From Device!!");
                accumulateString.current = "";
                // setIsLoading(false);

                break;
              }
              //=====================================================
              // return accumulateString.current;
            } else if (isPromiseResolved.current) {
              setLoading(false);
              reader.releaseLock();
              accumulateString.current = "";

              alert(
                "no data is comming from the device please check the version and hardware as well!"
              );
            }
            // setLoading(false);
          }
          if (
            value &&
            (keyToVerify == null || Object.keys(keyToVerify).length == 0)
          ) {
            console.log(decoder.decode(value));
            accumulateString.current += decoder.decode(value);
            console.log(accumulateString.current);
            if (accumulateString.current.includes("DBG#")) {
              isPromiseResolved.current = false;

              reader.releaseLock();
              // port.current.readable.cancel();
              console.log(accumulateString.current);
              accumulateString.current = extractStringBetweenPattern(
                accumulateString.current
              );
              // setSerialDataResponse(accumulateString.current);
              console.log(accumulateString.current);
              // setSerialDataResponse(accumulateString.current);
              // ==========================================================
              if (
                accumulateString.current &&
                accumulateString.current != undefined
              ) {
                debugger;
                const cleanString = accumulateString.current
                  .replace(/\s+/g, " ")
                  .trim();
                console.log(
                  accumulateString.current.replace(/\s+/g, " ").trim()
                );

                const finalArray = commandArrayForStepper.map((ele) => {
                  return ele.sequenceNo <= sequenceNo
                    ? { ...ele, isCompleted: true }
                    : ele;
                });
                if (commandType == "client") {
                  setClientModalCommandsOld(finalArray);
                } else {
                  setClientModalCommandsOld(finalArray);
                }

                debugger;
                accumulateString.current = "";
                count.current++;
                // if (commandArray.length == count.current) {
                //   // setIsMasterDOne(true);
                //   setShowTestedDeviceSaveBtn(true);
                // }

                if (commandArray.length > count.current) {
                  bufferTransactionHandler(
                    commandArray,
                    commandArrayForStepper,
                    commandType
                  );
                }
                const { valid, key } = areKeysPresent(
                  keyToVerify,
                  cleanString,
                  commandType
                );
                if (valid) {
                  // saveCommand(accumulateString.current, serialData, valid);

                  const commandResponse = await saveCommand(
                    accumulateString.current,
                    serialData,
                    valid
                  );
                  //debugger;
                  if (commandResponse != 200 || commandResponse != 201) {
                    // count.current = 0;
                    accumulateString.current = 0;
                    // setLoading(false);

                    const finalArray = commandArrayForStepper.map((ele) => {
                      return ele.sequenceNo < sequenceNo
                        ? { ...ele, isCompleted: true }
                        : ele.sequenceNo == sequenceNo
                        ? { ...ele, isCompleted: false }
                        : ele;
                    });
                    if (commandType == "client") {
                      setClientModalCommandsOld(finalArray);
                    } else {
                      setClientModalCommandsOld(finalArray);
                    }
                    return;
                  }

                  //       alert("command successfull!");
                  //       const finalArray = commandArrayForStepper.map((ele) => {
                  //         return ele.sequenceNo == sequenceNo
                  //           ? { ...ele, isCompleted: true }
                  //           : ele;
                  //       });
                  //       if (commandType == "master") {
                  //         setMasterCommandsOld(finalArray);
                  //       } else {
                  //         setClientModalCommandsOld(finalArray);
                  //       }
                  //       accumulateString.current = "";
                  //  count.current++;
                  //        if(commandArray.length>count.current){
                  //       bufferTransactionHandler(commandArray,commandArrayForStepper,commandType);
                  // }
                  // count.current++;
                  // bufferTransactionHandler(commandArray[count.current]);
                  // document.getElementById("check-command-btn").click()
                } else {
                  alert("command failed!");
                  const finalArray = commandArrayForStepper.map((ele) => {
                    return ele.sequenceNo == sequenceNo
                      ? { ...ele, isCompleted: false }
                      : ele;
                  });
                  if (commandType == "client") {
                    setClientModalCommandsOld(finalArray);
                  } else {
                    setClientModalCommandsOld(finalArray);
                  }
                  saveCommand(accumulateString.current, serialData, valid);

                  accumulateString.current = "";
                }
              }
              //=====================================================
              // return accumulateString.current;
            } else if (isPromiseResolved.current) {
              setLoading(false);
              reader.releaseLock();
              accumulateString.current = "";

              alert(
                "no data is comming from the device please check the version and hardware as well 1!"
              );
            }
            // setIsLoading(false);
          }
          if (done) {
            // setIsLoading(false)

            reader.releaseLock();
            const finalArray = commandArrayForStepper.map((ele) => {
              return ele.sequenceNo < sequenceNo
                ? { ...ele, isCompleted: true }
                : { ...ele, isCompleted: false };
            });
            if (commandType == "client") {
              setClientModalCommands(finalArray);
            } else {
              setClientModalCommands(finalArray);
            }
            accumulateString.current = "";

            break;
          }
        }
      } catch (err) {
        debugger;
        // if (err.message === "Alarm triggered") {
        //   // reader.releaseLock();
        //   accumulateString.current="";
        //   setLoading(false)
        //   console.log("Execution interrupted due to alarm trigger");
        //   return; // Exit the function
        // }
        console.error("Error sending/receiving data:", err);
        // setIsLoading(false);
      }
    } else {
      console.error("COM Port not connected or not writable.");
      // setIsLoading(false);
    }
  }

  async function unboxDeviceHandler(event, unboxData) {
    event.stopPropagation();

    let data = {
      boxId: unboxData.boxId,
      reConfigureBoxId: unboxData.id,
      userId: JSON.parse(localStorage.getItem("data")).id,
    };

    const res = await BoxPackaging.unboxing(data);
    if (res) {
      alert(res.message);
      reconfigurationList();
      console.log(res);
    }
  }

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Grid>
          <TableContainer
            component={Paper}
            sx={{ maxHeight: "75vh", overflow: "auto" }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                {TableHeadData &&
                  TableHeadData.map((header) => {
                    return (
                      <>
                        <StyledTableCell sx={tableCellStyle}>
                          {header.name}
                        </StyledTableCell>
                      </>
                    );
                  })}
                {/* <StyledTableCell sx={tableCellStyle}></StyledTableCell> */}
                <TableRow></TableRow>
              </TableHead>
              <TableBody>
                {data &&
                  data?.map((row, ind) => (
                    <Row
                      key={row.id}
                      row={row}
                      index={ind}
                      openRowIndex={openRowIndex}
                      setOpenRowIndex={setOpenRowIndex}
                      setLoading={setLoading}
                      InnerTableHeader={InnerTableHeader}
                      clientModalCommands={clientModalCommands}
                      setClientModalCommands={setClientModalCommands}
                      setClientModalCommandsOld={setClientModalCommandsOld}
                      open={open}
                      setOpen={setOpen}
                      connectDeviceWithUsbPort={connectDeviceWithUsbPort}
                      isPortConnected={isPortConnected}
                      setIsPortConnected={setIsPortConnected}
                      selectedBox={selectedBox}
                      setSelectedBox={setSelectedBox}
                      setSelecetedDevice={setSelecetedDevice}
                      saveReconfigureDevice={saveReconfigureDevice}
                      showTestedDeviceSaveBtn={showTestedDeviceSaveBtn}
                      getBoxListById={getBoxListById}
                      alldeviceList={alldeviceList}
                      setAlldeviceList={setAlldeviceList}
                      deviceList={deviceList}
                      setDeviceList={setDeviceList}
                      unboxDeviceHandler={(event, data) =>
                        unboxDeviceHandler(event, data)
                      }
                      finishReconfiguration={(data) =>
                        finishReconfiguration(data)
                      }
                      fetchReconfigCommands={(id) => fetchReconfigCommands(id)}
                      deviceNumber={deviceNumber}
                      setDeviceNumber={setDeviceNumber}
                      isNewConfigModalOpen={isNewConfigModalOpen}
                      setIsNewConfigModalOpen={setIsNewConfigModalOpen}
                      getDeviceDataHandler={getDeviceDataHandler}
                      newDeviceRemoveHandler={(data) =>
                        newDeviceRemoveHandler(data)
                      }
                    />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </ThemeProvider>
    </div>
  );
}

export default ReconfigurationTable;

function Row(props) {
  const {
    fetchReconfigCommands,
    unboxDeviceHandler,
    row,
    index,
    setOpenRowIndex,
    openRowIndex,
    setLoading,
    InnerTableHeader,
    clientModalCommands,
    setClientModalCommands,
    open,
    setOpen,
    connectDeviceWithUsbPort,
    isPortConnected,
    setIsPortConnected,
    selectedBox,
    setSelectedBox,
    setSelecetedDevice,
    saveReconfigureDevice,
    showTestedDeviceSaveBtn,
    setClientModalCommandsOld,
    getBoxListById,
    alldeviceList,
    setAlldeviceList,
    deviceList,
    setDeviceList,
    finishReconfiguration,
    deviceNumber,
    setDeviceNumber,
    isNewConfigModalOpen,
    setIsNewConfigModalOpen,
    getDeviceDataHandler,
    newDeviceRemoveHandler,
  } = props;
  console.log(row, isPortConnected);
  const unboxingPermission = JSON.parse(
    localStorage.getItem("data")
  ).webPermissionDTOList.filter((ele) => {
    return ele.name == "UNBOX_DEVICE" && ele.forWeb;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  // const [alldeviceList, setAlldeviceList] = useState([]);
  // const [deviceList, setDeviceList] = useState([]);
  const [page, setPage] = useState(deviceList?.length);
  const isRowOpen = index === openRowIndex;
  let batchSize = 50;
  let currentIndex = deviceList?.length;

  const expandrowOpenHandler = async (index, data) => {
    if (isRowOpen) {
      setOpenRowIndex(null); // Close the currently open row
      setAlldeviceList([]);
      setDeviceList([]);
      setHasMore(true);
      currentIndex = 0;
      setSelectedBox();
      setClientModalCommands([]);
    } else {
      const array = await fetchReconfigCommands(data.id);
      debugger;
      const array2 = array.map((ele, index) => {
        console.log(ele.command);
        // Remove "GET", spaces, and colons
        let result;
        if (ele?.keyToVerify != null && ele?.command.split(" ")[0] == "GET") {
          result = ele.command.replace(/GET|:|\s/g, "").trim();
        }
        console.log(result);
        // ele.keyToVerify=null;
        return {
          ...ele,
          sequenceNo: index + 1,
          keyToVerify:
            ele?.keyToVerify == null &&
            ele.response != null &&
            ele.command.split(" ")[0] == "GET"
              ? {
                  [ele.command.replace(/GET|:|\s/g, "").trim()]:
                    ele?.response ?? null,
                }
              : JSON.parse(ele?.keyToVerify),

          isCompleted: null,
          isActive: false,
        };
      });
      console.log(array2);
      setClientModalCommands(array2);

      setSelectedBox(data);

      //   const commandArray = [
      //     {
      //       id: 1,
      //       command: "GET SINFO1:",
      //       response: "qwertyuiop",
      //       isActive: true,
      //       createdAt: null,
      //       createdBy: null,
      //       keyToVerify:
      //         '{"IMEI":"value1","CCID":"value2","UID":"UID","DFV":"DFV"}',
      //       sequenceNo: 1,
      //       waitingTime: null,
      //       isAfterModelConfig: null,
      //     },
      //     {
      //       id: 2,
      //       command: "GET PIP:,PPT:",
      //       response: "qwertyuiop",
      //       isActive: true,
      //       createdAt: null,
      //       createdBy: null,
      //       keyToVerify: '{"PIP":"value1","PPT":"value2"}',
      //       sequenceNo: 2,
      //       waitingTime: null,
      //       isAfterModelConfig: null,
      //     },

      //     {
      //       id: 871,
      //       command: data.configCommand,
      //       response: null,
      //       isActive: true,
      //       createdAt: null,
      //       createdBy: null,
      //       updatedAt: "2024-03-19T05:25:50.000+00:00",
      //       updatedBy: 1,
      //       keyToVerify: null,
      //       modelId: 1,
      //       stateId: 44,
      //       sequenceNo: 3,
      //       providerId: 4,
      //       operatorId: 1,
      //       clientId: 6,
      //       isDefault: false,
      //       waitingTime: null,
      //     },

      //     {
      //       id: 2,
      //       command: "GET PPT:,PIP:",
      //       response: "qwertyuiop",
      //       isActive: true,
      //       createdAt: null,
      //       createdBy: null,
      //       keyToVerify: jsonString,
      //       sequenceNo: 4,
      //       waitingTime: null,
      //       isAfterModelConfig: null,
      //     },
      //   ];
      //   console.log(commandArray);
      //   const array2 = commandArray.map((ele) => {
      //     console.log(ele.command);
      //     // Remove "GET", spaces, and colons
      //     let result;
      //     if (ele.keyToVerify != null && ele.command.split(" ")[0] == "GET") {
      //       result = ele.command.replace(/GET|:|\s/g, "").trim();
      //     }
      //     console.log(result);
      //     return {
      //       ...ele,
      //       sequenceNo: ele.sequenceNo,
      //       keyToVerify:
      //         ele.keyToVerify == null && ele.command.split(" ")[0] == "GET"
      //           ? {
      //               [ele.command.replace(/GET|:|\s/g, "").trim()]:
      //                 ele?.response ?? null,
      //             }
      //           : JSON.parse(ele.keyToVerify),

      //       isCompleted: null,
      //       isActive: false,
      //     };
      //   });
      //   console.log(array2);
      //   setClientModalCommandsOld(array2);
      //   return array2;
      // });
      setOpenRowIndex(null); // Close the currently open row
      setAlldeviceList([]);
      setDeviceList([]);
      setHasMore(true);
      currentIndex = 0;
      setOpenRowIndex(index); // Open the clicked row
      getBoxListById(data);
    }
  };

  const checkExitCoomand = async (id) => {
    setLoading(true);
    const data = { boxId: Number(id) };
    await BoxPackaging.fetchExitCommand(data).then((response) => {
      try {
        if (response !== null) {
          setLoading(false);
          if (response.responseCode === 404) {
            alert(response.message);
          } else {
            getBoxListById(response?.data?.boxId, response?.data?.id);
          }
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    });
  };
  // async function getBoxListById(rowData) {
  //   setLoading(true);
  //   const data = {
  //     boxId: Number(rowData.boxId),
  //     reConfigureBoxId: rowData ? rowData.id : "",
  //   };
  //   await BoxPackaging.fetchreconfigureBoxDevicesList(data)
  //     .then((res) => {
  //       if (res != null) {
  //         setLoading(false);
  //         setAlldeviceList(res?.data?.deviceList);
  //         setDeviceList(res?.data?.deviceList);
  //         //   setBoxDetails(res?.data?.boxDeviceDTO?.boxDTO);
  //       } else {
  //         setLoading(false);
  //         setDeviceList([]);
  //         //   setBoxDetails();
  //       }
  //     })
  //     .catch((err) => {
  //       setLoading(false);
  //       console.log(err);
  //     });
  // }

  const handleScroll = async (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;
    if (
      scrollTop + clientHeight >= scrollHeight - 20 &&
      !isLoading &&
      hasMore
    ) {
      // const totalPages = Math.ceil(oldImeiCommandList?.length / batchSize);

      if (currentIndex < alldeviceList.length) {
        // Slice data from AlldeviceList in reverse order to get batches of 50 items
        const newData =
          alldeviceList &&
          alldeviceList?.slice(currentIndex, currentIndex + batchSize);
        setDeviceList((prevData) => [...prevData, ...newData]);
        currentIndex += batchSize;
        setPage((prevPage) => prevPage + batchSize); // Increment page for the next batch
      } else {
        // No more data to fetch
        setHasMore(false);
      }
    }
  };

  return (
    <React.Fragment>
      <ReconfigurationCommandStepperModal
        open={open}
        setOpen={setOpen}
        clientModalCommands={clientModalCommands || []}
        boxNumber="NA"
        connectDeviceWithUsbPort={connectDeviceWithUsbPort}
        setIsPortConnected={setIsPortConnected}
        isPortConnected={isPortConnected}
        selectedBox={selectedBox}
        saveReconfigureDevice={saveReconfigureDevice}
        showTestedDeviceSaveBtn={showTestedDeviceSaveBtn}
      />
      <NewDeviceConfigData
        deviceNumber={deviceNumber}
        setDeviceNumber={setDeviceNumber}
        open={isNewConfigModalOpen}
        setOpen={setIsNewConfigModalOpen}
        getDeviceDataHandler={getDeviceDataHandler}
      />
      <StyledTableRow
        sx={{
          "& > *": {
            borderBottom: "unset",
            background: row?.isCompleted ? "#0080005e" : "",
          },
        }}
      >
        <StyledTableCell component="th" scope="row">
          {index + 1}
        </StyledTableCell>
        <StyledTableCell>
          {row?.createdAt
            ? moment(row?.createdAt).format("DD-MM-YYYY hh:mm A")
            : "NA"}
        </StyledTableCell>
        <StyledTableCell>{row?.boxNo ? row?.boxNo : "NA"}</StyledTableCell>
        <StyledTableCell>
          {row?.reConfigBoxCode ? row?.reConfigBoxCode : "NA"}
        </StyledTableCell>
        <StyledTableCell>
          {row?.unsettledBoxCode ? row?.unsettledBoxCode : "NA"}
        </StyledTableCell>

        <StyledTableCell>
          <CustomWidthTooltip
            title={row?.configCommand ? row?.configCommand : "NA"}
            arrow
          >
            <Button>
              {row?.configCommand
                ? `${row?.configCommand.slice(0, 20)} more...`
                : "NA"}
            </Button>
          </CustomWidthTooltip>
        </StyledTableCell>
        <StyledTableCell>{row?.stateDTO?.name ?? "NA"}</StyledTableCell>

        <StyledTableCell>
          {row?.totalConfigureDevice !== null
            ? row?.totalConfigureDevice
            : "NA"}
        </StyledTableCell>
        <StyledTableCell>
          {row?.totalUnboxDevice !== null ? row?.totalUnboxDevice : "NA"}
        </StyledTableCell>
        <StyledTableCell>
          {row ? (row.isCompleted === true ? "Completed" : "Pending") : "NA"}
        </StyledTableCell>

        <StyledTableCell>
          <div style={{ display: "flex", width: "100%" }}>
            <div>
              {row?.boxNo &&
                !row?.isCompleted &&
                unboxingPermission?.length > 0 && (
                  <Button
                    sx={{ color: "white" }}
                    variant="contained"
                    onClick={(event) => unboxDeviceHandler(event, row)}
                  >
                    unbox
                  </Button>
                )}
            </div>
            <div>
              <IconButton
                aria-label="expand row"
                // size="small"
                onClick={() => expandrowOpenHandler(index, row)}
              >
                {isRowOpen ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>
            </div>
          </div>
        </StyledTableCell>
        {/* <StyledTableCell>
          <Button variant="contained" onClick={(event)=>unboxDeviceHandler(event,row)}>unbox</Button>
        </StyledTableCell> */}
      </StyledTableRow>
      <StyledTableRow sx={{ margin: "auto" }}>
        <StyledTableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={15}
        >
          <Collapse in={isRowOpen} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <div
                style={{ maxHeight: "400px", overflowY: "auto" }}
                onScroll={handleScroll}
              >
                <Paper>
                  <Table size="small" stickyHeader aria-label="sticky table">
                    <TableHead>
                      <StyledTableRow>
                        {InnerTableHeader &&
                          InnerTableHeader.map((header) => {
                            return (
                              <>
                                <StyledTableCell sx={innerTableCellStyle}>
                                  {header.name}
                                </StyledTableCell>
                              </>
                            );
                          })}
                        <StyledTableCell sx={innerTableCellStyle}>
                          {deviceList?.length > 0 && deviceList[0]?.boxCode ? (
                            <Button
                              sx={{ background: "#a3b4dd" }}
                              onClick={() => {
                                setDeviceNumber("");
                                setIsNewConfigModalOpen(true);
                              }}
                              variant="contained"
                            >
                              Add device
                            </Button>
                          ) : deviceList.length == 0 ? (
                            <Button
                              sx={{ background: "#a3b4dd" }}
                              onClick={() => {
                                setDeviceNumber("");
                                setIsNewConfigModalOpen(true);
                              }}
                              variant="contained"
                            >
                              Add device
                            </Button>
                          ) : null}
                          {/* {deviceList.length == 0 && (
                            <Button
                              sx={{ background: "#a3b4dd" }}
                              onClick={() => {
                                setDeviceNumber("");
                                setIsNewConfigModalOpen(true);
                              }}
                              variant="contained"
                            >
                              Add device
                            </Button>
                          )} */}
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {deviceList &&
                        deviceList?.map((historyRow, ind) => (
                          <TableRow
                            key={historyRow.date}
                            sx={{
                              background: historyRow?.isConfigured
                                ? "#00800052"
                                : "",
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {ind + 1}
                            </TableCell>
                            <TableCell>
                              {historyRow?.updatedAt
                                ? moment(historyRow?.updatedAt).format(
                                    "DD-MM-YYYY hh:mm A"
                                  )
                                : "NA"}
                            </TableCell>
                            <TableCell>
                              {historyRow?.imeiNo ? historyRow?.imeiNo : "NA"}
                            </TableCell>
                            <TableCell>
                              {historyRow?.state
                                ? historyRow?.state?.name
                                : "NA"}
                            </TableCell>
                            <TableCell>
                              {historyRow
                                ? historyRow?.isConfigured === true
                                  ? "Completed"
                                  : "Pending"
                                : "NA"}
                            </TableCell>
                            <TableCell>
                              {historyRow ? (
                                historyRow?.isConfigured === true ? (
                                  <IconButton>
                                    <CheckCircleIcon sx={{ color: "#fff" }} />
                                  </IconButton>
                                ) : (
                                  <>
                                    <Button
                                      sx={{ color: "white", background: "" }}
                                      onClick={() => {
                                        setSelecetedDevice(historyRow);
                                        setOpen(true);
                                      }}
                                      variant="contained"
                                    >
                                      Reconfigure
                                    </Button>
                                    {historyRow.withoutBox && (
                                      <IconButton>
                                        <DeleteIcon
                                          onClick={() => {
                                            newDeviceRemoveHandler(historyRow);
                                          }}
                                        />
                                      </IconButton>
                                    )}
                                  </>
                                )
                              ) : (
                                "NA"
                              )}
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Paper>
                <Grid
                  container
                  justifyContent={"flex-end"}
                  sx={{ marginTop: "10px", padding: "5px" }}
                  spacing={2}
                >
                  {!selectedBox?.isCompleted && selectedBox?.boxNo && (
                    <Button
                      variant="contained"
                      sx={{ color: "white" }}
                      onClick={() => {
                        finishReconfiguration(selectedBox);
                        setOpenRowIndex(null); // Close the currently open row
                      }}
                    >
                      finish Reconfig
                    </Button>
                  )}
                </Grid>
              </div>
            </Box>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </React.Fragment>
  );
}
