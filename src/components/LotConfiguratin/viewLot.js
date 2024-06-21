import React, { useState, useEffect, useRef } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import moment from "moment";
import { useParams } from "react-router-dom";
import { LotAction } from "../../components/actions/Lot";

import { styled } from "@mui/material/styles";
import TopView from "../CommonComponents/topView";
import CustomizedSteppers from "./CustomStepper";
import RejectModal from "./rejectModal";
import LoadingComponent from "../CommonComponents/LoadingComponts";

import { useReactToPrint } from "react-to-print";
import {
  Button,
  Grid,
  Paper,
  Typography,
  Box,
  Autocomplete,
} from "@mui/material";
import BarCodePrint from "./BarcodePrint";
// import { debug } from "console";

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

const lotStatusList = [
  {
    id: 1,
    name: "Completed",
    value: true,
  },
  {
    id: 2,
    name: "Pending",
    value: false,
  },
];
// let port.current;
// let accumulateString.current = "";
// let count.current = 0;
// let isGyroFound = false;

const pageStyle = `
@page {
  size: 40mm 30mm; /* Custom page size */
  margin: 0;
  padding: 0;
}

@media print {
  html, body {
    margin: 0;
    padding: 0;
    // width:40mm; /* Set body width to match custom page size */
    // height: 30mm; /* Set body height to match custom page size */
    // transform: scale(0.8); /* Scale the content within the page */
    // transform-origin: top left; /* Set the origin of the scaling */
  }
}
`;

function ViewLot() {
  const id = window.location.pathname.split("/")[2];
  const port = useRef(null);
  // ref to store device response
  const accumulateString = useRef("");

  // ref to store current stepper index/ current command index
  const count = useRef(0);
  // isGyroFound ={current:false}

  const isGyroFound = useRef(false);

  // timeoutId ={current:null}

  const timeoutId = useRef(null);
  const bufferVoltage = useRef(0);
  // ref to store waiting Time

  const expectedDelay = useRef(0);
  // ref to store chunk of the waiting time

  const currentDelay = useRef(0);

  // =========================================================//
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [lotDetails, setLotDetails] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [masterCommands, setMasterCommands] = useState([]);
  const [masterCommandsOld, setMasterCommandsOld] = useState([]);

  const [clientModalCommands, setClientModalCommands] = useState([]);
  const [clientModalCommandsOld, setClientModalCommandsOld] = useState([]);

  const [isPortConnected, setIsPortConnected] = useState(isGyroFound.current);
  const [isMasterDone, setIsMasterDOne] = useState(false);
  const [showTestedDeviceSaveBtn, setShowTestedDeviceSaveBtn] = useState(false);
  const [rejectRemark, setRejectRemark] = useState("");
  const [openRejectModal, setOpenRejectModal] = useState(false);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: { pageStyle },
    onAfterPrint: () => window.location.reload(),
  });

  function findBufferVoltage(voltageInMiliVolt) {
    const buffer = voltageInMiliVolt * 0.1;
    bufferVoltage.current = buffer;
    //  return buffer;
  }
  async function getLotById() {
    setIsLoading(true);
    let data = {
      id: id,
    };
    const response = await LotAction.getLotList(data);
    if (response !== null) {
      setIsLoading(false);

      console.log(response);
      findBufferVoltage(response.data[0].externalVoltage);
      setLotDetails(response.data[0]);

      const res = await checkCommandCheckListForLot(response.data[0]);
    } else {
      setIsLoading(false);

      setLotDetails([]);
      console.log("error");
    }
  }

  async function checkCommandCheckListForLot(lotDetail) {
    let data = {
      modelId: lotDetail?.modelId?.id ?? null,
      stateId: lotDetail?.state?.id ?? null,

      providerId: lotDetail?.provider?.id ?? null,
      clientId: lotDetail?.client?.id ?? null,
      operatorId: lotDetail?.operators?.id ?? null,
    };
    LotAction.getCommandCheckList(data)
      .then((res) => {
        if (res.data) {
          const { commands, modelConfigs } = res.data;
          const array1 = commands.map((ele) => {
            console.log(JSON.parse(ele.keyToVerify));
            return {
              ...ele,
              keyToVerify: JSON.parse(ele.keyToVerify),
              isCompleted: null,
              isActive: false,
            };
          });
          console.log(array1);
          const array2 = modelConfigs.map((ele) => {
            console.log(ele.command);
            // Remove "GET", spaces, and colons
            let result;
            if (ele.keyToVerify != null && ele.command.split(" ")[0] == "GET") {
              result = ele.command.replace(/GET|:|\s/g, "").trim();
            }
            console.log(result);
            return {
              ...ele,
              sequenceNo: ele?.modelConfigSequenceNo,
              keyToVerify:
                ele?.keyToVerify == null && ele.command.split(" ")[0] == "GET"
                  ? {
                      [ele.command.replace(/GET|:|\s/g, "").trim()]:
                        ele?.response ?? null,
                    }
                  : JSON.parse(ele?.keyToVerify),

              isCompleted: null,
              isActive: false,
            };
          });
          console.log(array1, array2);
          setMasterCommands(array1);
          setMasterCommandsOld(array1);

          setClientModalCommands(array2);
          setClientModalCommandsOld(array2);
        } else {
          setMasterCommands([]);
          setClientModalCommands([]);
          setMasterCommandsOld([]);

          setClientModalCommandsOld([]);
        }
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    if (localStorage.getItem("masterInfo")) {
      localStorage.removeItem("masterInfo");
    }
    getLotById();
  }, []);

  async function saveTestedDevice() {
    setIsLoading(true);
    const {
      IMEI: imeiNo,
      UID: uuidNo,
      CCID: ccidNo,
    } = JSON.parse(localStorage.getItem("masterInfo"));
    let data = {
      imeiNo: imeiNo,
      lotId: id,
      userId: JSON.parse(localStorage.getItem("data")).id,
      uuidNo: uuidNo,
    };

    const res = await LotAction.saveTestedDevice(data);
    //debugger;
    if (res) {
      if (
        res.responseCode == 200 ||
        res.responseCode == 201 ||
        res.message == "DEVICE ALREADY EXIST"
      ) {
        if (res.message == "DEVICE ALREADY EXIST") {
          setIsDuplicate(true);
        }
        alert(res.message);
        handlePrint();
        alert("Please plugin new Device!");

        // window.location.reload();
      } else {
        alert(res.message);
      }
      // console.log(res);

      // return res.responseCode;
      setIsLoading(false);
    }
    // console.log(err);
  }

  async function saveCommand(details, command, commandSuccessfull, key) {
    if (!localStorage.getItem("masterInfo")) {
      alert(`No ${key} is detected!`);
      return;
    }
    if (
      command == "GET SINFO1:" &&
      (details == "" || details == null || details == undefined)
    ) {
      alert("No Details Fetched Please re-test!");
      return;
    }
    const {
      IMEI: imeiNo,
      UID: uuidNo,
      CCID: ccidNo,
      DFV: dfv,
    } = localStorage.getItem("masterInfo") &&
    JSON.parse(localStorage.getItem("masterInfo"));
    let data = {
      imeiNo: imeiNo,
      iccidNo: ccidNo,
      uuidNo: uuidNo,
      softwareVersion: dfv,
      userId: JSON.parse(localStorage.getItem("data")).id,
      failureReason: key && key,
      lotId: id,
      detail: details,
      // softwareVersion: "",
      command: command,
      response: details,
      status: commandSuccessfull ? "ACCEPT" : "REJECT",
    };

    const res = await LotAction.saveCommand(data);
    if (res) {
      if (res.responseCode != 200) {
        alert(res.message);
      }
      console.log(res);

      return res.responseCode;
    }
    // console.log(err);
  }

  let topViewData = {
    pageTitle: "View Lot",

    addText: "Add Company",

    hideAddButton: true,
    addClick: "/addNewLot",

    editText: "",
    hideEditButton: true,
    editClick: null,

    cancelText: null,
    hideCancelButton: true,
    cancelClick: null,

    updateText: null,
    hideUpdateButton: true,
    updateClick: null,

    hidePdfExport: true,
    exportPdfClick: "",
    onPdfDownload: null,

    hideExcelExport: true,
    exportExcelClick: "",
    onExcelDownload: null,

    hideExcelImport: true,
    excelImportClick: "",

    filter: true,
    filterHandler: null,

    searchFieldHandler: null,
    searchInput: null,
    searchField: true,
  };

  async function sleepFunction(ms = 0) {
    debugger;
    setIsLoading(true);
    currentDelay.current = currentDelay.current + 5000;
    expectedDelay.current = expectedDelay.current - currentDelay.current;
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (expectedDelay.current == 0) {
          // setIsLoading(false);
          // alert("expected time Expired");

          resolve("expected time Expired");
        }
        // setIsLoading(false);
        // alert("interval Expired");
        resolve("interval Expired");
      }, currentDelay.current);
    });

    // while (Date.now() - start < ms) {}
  }

  // const delayFunction = async () => {
  //   // Simulating an asynchronous operation

  //   setShowMessage(true);
  // };

  async function connectDeviceWithUsbPort() {
    if ("serial" in navigator) {
      try {
        port.current = await navigator.serial.requestPort();
        console.log(port.current.getInfo());
        await port.current.open({
          baudRate: 19200,
          dataBits: 8,
          stopBits: 1,
          flowControl: "none",
          // bufferSize: 1024 ,
          parity: "none",
        });
        // console.log(port.current);
        setIsPortConnected(true);

        alert("Please restart the device!");
        setIsLoading(true);

        let decoder = new TextDecoder();
        while (port.current.readable) {
          const reader = port.current.readable.getReader();

          try {
            while (true) {
              const { value, done } = await reader.read();
              if (done) {
                // Allow the serial port.current to be closed later.
                setIsLoading(false);
                reader.releaseLock();
                break;
              }
              if (value) {
                // console.log(value);
                accumulateString.current += decoder.decode(value);
                // console.log(accumulateString.current);
                if (accumulateString.current.includes("DBG#")) {
                  debugger;
                  // alert("got the response!");
                  reader.releaseLock();
                  console.log(port.current, reader);

                  accumulateString.current = extractStringBetweenPattern(
                    accumulateString.current
                  );
                  console.log(accumulateString.current);

                  if (
                    accumulateString.current &&
                    accumulateString.current != undefined
                  ) {
                    // debugger;

                    const cleanString = accumulateString.current
                      .replace(/\s+/g, " ")
                      .trim();
                    console.log(
                      accumulateString.current.replace(/\s+/g, " ").trim()
                    );
                    const { valid, key } = areKeysPresent(
                      { "ACC-GYRO_ID": "00" },
                      // { "ACC-GYRO_ID": "000" },

                      cleanString,
                      "beforeMaster"
                    );
                    console.log(valid, key);

                    if (valid) {
                      alert(key);
                      // // alert(key);
                      // clearTimeout(timeoutId.current);
                      // // await sleepFunction(10000);
                      await new Promise((resolve, reject) => {
                        setTimeout(() => {
                          resolve("interval Expired");
                          console.log("Promise Resolved");
                        }, 8000);
                      });

                      // while (Date.now() - start < 10000) {}
                      isGyroFound.current = true;
                      console.log(isGyroFound.current);
                      accumulateString.current = "";
                      setIsLoading(false);

                      // setIsLoading(false);

                      // setIsGyroFound(true);
                    } else {
                      alert("GYRO not found! Restart the device and try again");
                      setIsLoading(false);
                      isGyroFound.current = false;
                      accumulateString.current = "";
                    }
                  }

                  break;
                }
              }
            }
            break;
          } catch (error) {
            // TODO: Handle non-fatal read error.
          }
        }

        // if (port.current) {
        //   // let timeoutId;
        //   let decoder = new TextDecoder();
        //   const reader = port.current.readable.getReader();
        //   while (true) {
        //     const { value, done } = await reader.read();
        //     setIsLoading(true);

        //     if (value) {
        //       accumulateString.current += decoder.decode(value);
        //       console.log(accumulateString.current);
        //       if (accumulateString.current.includes("DBG#")) {
        //         reader.releaseLock();
        //         // port.current.readable.cancel();
        //         console.log(accumulateString.current);
        //         accumulateString.current = extractStringBetweenPattern(
        //           accumulateString.current
        //         );
        //         // setSerialDataResponse(accumulateString.current);
        //         console.log(accumulateString.current);
        //         // ==========================================================
        //         if (
        //           accumulateString.current &&
        //           accumulateString.current != undefined
        //         ) {
        //           // debugger;

        //           const cleanString = accumulateString.current
        //             .replace(/\s+/g, " ")
        //             .trim();
        //           console.log(
        //             accumulateString.current.replace(/\s+/g, " ").trim()
        //           );
        //           const { valid, key } = areKeysPresent(
        //             { "ACC-GYRO_ID": "6A10" },
        //             cleanString,
        //             "beforeMaster"
        //           );
        //           console.log(valid, key);
        //           if (valid) {
        //             alert("GYRO Detected!!!");
        //             // alert(key);
        //             clearTimeout(timeoutId.current);
        //             // await sleepFunction(10000);
        //             await new Promise((resolve, reject) => {
        //               setTimeout(() => {
        //                 resolve("interval Expired");
        //               }, 10000);
        //             });

        //             // while (Date.now() - start < 10000) {}
        //             isGyroFound.current = true;
        //             setIsLoading(false);

        //             // setIsGyroFound(true);
        //           } else {
        //             alert("GYRO not found! Restart the device and try again");
        //           }
        //         }
        //       } else {
        //         // if(timeoutId){
        //         //   clearTimeout(timeoutId)
        //         // }
        //         // setIsLoading(false);

        //         if (!timeoutId.current) {
        //           console.log(timeoutId.current);
        //           timeoutId.current = setTimeout(() => {
        //             accumulateString.current = "";
        //             alert("Please restart the device connection failed!");
        //             clearTimeout(timeoutId.current);
        //           }, 15000);
        //         }
        //       }
        //     }
        //     if (done) {
        //     }
        //   }
        // }

        console.log("Connected to GPS device.");
      } catch (err) {
        setIsPortConnected(false);

        console.error("Error connecting to GPS device:", err);
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

  // async function connectDeviceWithUsbPort() {
  //   if ("serial" in navigator) {
  //     try {
  //       port.current = await navigator.serial.requestPort();
  //       console.log(port.current.getInfo());
  //       await port.current.open({
  //         baudRate: 19200,
  //         dataBits: 8,
  //         stopBits: 1,
  //         flowControl: "none",
  //         // bufferSize: 1024 ,
  //         parity: "none",
  //       });
  //       console.log(port.current);
  //       setIsPortConnected(true);

  //       alert("Please restart the device!");

  //       if (port.current) {
  //         // let timeoutId;
  //         let decoder = new TextDecoder();
  //         const reader = port.current.readable.getReader();
  //         while (true) {
  //           const { value, done } = await reader.read();
  //           setIsLoading(true);

  //           if (value) {
  //             accumulateString.current += decoder.decode(value);
  //             console.log(accumulateString.current);
  //             if (accumulateString.current.includes("DBG#")) {
  //               reader.releaseLock();
  //               // port.current.readable.cancel();
  //               console.log(accumulateString.current);
  //               accumulateString.current = extractStringBetweenPattern(
  //                 accumulateString.current
  //               );
  //               // setSerialDataResponse(accumulateString.current);
  //               console.log(accumulateString.current);
  //               // ==========================================================
  //               if (
  //                 accumulateString.current &&
  //                 accumulateString.current != undefined
  //               ) {
  //                 // debugger;

  //                 const cleanString = accumulateString.current
  //                   .replace(/\s+/g, " ")
  //                   .trim();
  //                 console.log(
  //                   accumulateString.current.replace(/\s+/g, " ").trim()
  //                 );
  //                 const { valid, key } = areKeysPresent(
  //                   { "ACC-GYRO_ID": "6A10" },
  //                   cleanString,
  //                   "beforeMaster"
  //                 );
  //                 console.log(valid, key);
  //                 if (valid) {
  //                   alert("GYRO Detected!!!");
  //                   // alert(key);
  //                   clearTimeout(timeoutId.current);
  //                   // await sleepFunction(10000);
  //                   await new Promise((resolve, reject) => {
  //                     setTimeout(() => {
  //                       resolve("interval Expired");
  //                     }, 10000);
  //                   });

  //                   // while (Date.now() - start < 10000) {}
  //                   isGyroFound.current = true;
  //                   setIsLoading(false);

  //                   // setIsGyroFound(true);
  //                 } else {
  //                   alert("GYRO not found! Restart the device and try again");
  //                 }
  //               }
  //             } else {
  //               // if(timeoutId){
  //               //   clearTimeout(timeoutId)
  //               // }
  //               // setIsLoading(false);

  //               if (!timeoutId.current) {
  //                 console.log(timeoutId.current);
  //                 timeoutId.current = setTimeout(() => {
  //                   accumulateString.current = "";
  //                   alert("Please restart the device connection failed!");
  //                   clearTimeout(timeoutId.current);
  //                 }, 15000);
  //               }
  //             }
  //           }
  //           if (done) {
  //           }
  //         }
  //       }

  //       console.log("Connected to GPS device.");
  //     } catch (err) {
  //       setIsPortConnected(false);

  //       console.error("Error connecting to GPS device:", err);
  //     }
  //   } else {
  //     // this block run if your browser does not support serial API
  //     console.error(
  //       "Web serial doesn't seem to be enabled in your browser. Try enabling it by visiting:"
  //     );
  //     console.error(
  //       "chrome://flags/#enable-experimental-web-platform-features"
  //     );
  //     console.error("opera://flags/#enable-experimental-web-platform-features");
  //     console.error("edge://flags/#enable-experimental-web-platform-features");
  //   }
  // }

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

  async function bufferTransactionHandler(
    commandArray,
    commandArrayForStepper,
    commandType
  ) {
    // setIsLoading(true)
    if (!isGyroFound.current) {
      alert("GYRO not found!!");
      return;
    }
    console.log(accumulateString.current);

    debugger;
    const serialData = commandArray[count.current].command;
    const keyToVerify = commandArray[count.current].keyToVerify;
    const sequenceNo = commandArray[count.current].sequenceNo;

    const waitingTime =
      commandArray[count.current].waitingTime - currentDelay.current;
    expectedDelay.current = waitingTime;
    // alert(serialData);
    console.log(serialData, keyToVerify);
    if (port.current && port.current.writable) {
      // const command = commandInput.value.trim();
      try {
        const writer = port.current.writable.getWriter();
        // setIsLoading(true);
        debugger;
        accumulateString.current = "";
        if ("GET SINFO2:" == serialData && currentDelay.current == 0) {
          alert("Please bring the magnet close to device!");
        }
        if (
          "GET SINFO1:" == serialData &&
          commandType == "client" &&
          currentDelay.current == 0
        ) {
          alert("Please plugin the emergency device!");
        }
        //new TextEncoder().encode(serialData) this actually converts a string into Unit8Array/arrayBuffer/typedArray
        await writer.write(new TextEncoder().encode(serialData));
        writer.releaseLock();

        console.log(port.current, "serialport");

        let decoder = new TextDecoder();
        // setIsLoading(true);
        // setIsLoading(false);
        const reader = port.current.readable.getReader();
        // if (waitingTime > 1000) {
        //   let remainingTime = 1000;
        //   while (remainingTime > 0) {
        //     debugger;
        //     sleepFunction(remainingTime);
        //     remainingTime = waitingTime - remainingTime;
        //   }
        // } else {
        //   sleepFunction(waitingTime);
        // }
        // if (waitingTime != null) {
        //   sleepFunction(waitingTime);
        // }
        if (waitingTime > 0) {
          await sleepFunction();
        }

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
                  commandType
                );
                console.log(valid, key, resultObj);
                if (valid) {
                  // setIsLoading(false);

                  // alert("command successfull!");
                  const commandResponse = await saveCommand(
                    accumulateString.current,
                    serialData,
                    valid
                  );
                  debugger;
                  if (commandResponse != 200) {
                    count.current = 0;
                    accumulateString.current = "";
                    setIsLoading(false);

                    const finalArray = commandArrayForStepper.map((ele) => {
                      return ele.sequenceNo < sequenceNo
                        ? { ...ele, isCompleted: true }
                        : ele.sequenceNo == sequenceNo
                        ? { ...ele, isCompleted: false, resultObj }
                        : ele;
                    });
                    if (commandType == "master") {
                      setMasterCommandsOld(finalArray);
                    } else {
                      setClientModalCommandsOld(finalArray);
                    }
                    return;
                  }
                  expectedDelay.current = 0;
                  currentDelay.current = 0;
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
                    if (commandType == "master") {
                      setMasterCommandsOld(finalArray);
                    } else {
                      setClientModalCommandsOld(finalArray);
                    }
                    setIsMasterDOne(true);
                  }
                  // if (commandType == "client" && count.current == commandArray.length) {
                  //   setShowTestedDeviceSaveBtn(true);
                  // }
                  if (
                    commandType == "client" &&
                    count.current == commandArray.length &&
                    commandResponse == 200
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
                    if (commandType == "master") {
                      setMasterCommandsOld(finalArray);
                    } else {
                      setClientModalCommandsOld(finalArray);
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
                  if (waitingTime > 0 && expectedDelay.current > 0) {
                    accumulateString.current = "";

                    bufferTransactionHandler(
                      commandArray,
                      commandArrayForStepper,
                      // finalArray,
                      commandType
                    );
                    // setIsLoading(false);
                  } else {
                    expectedDelay.current = 0;
                    currentDelay.current = 0;
                    alert("command failed!");
                    // setIsLoading(false);
                    saveCommand(
                      accumulateString.current,
                      serialData,
                      valid,
                      key
                    );

                    const finalArray = commandArrayForStepper.map((ele) => {
                      return ele.sequenceNo < sequenceNo
                        ? { ...ele, isCompleted: true }
                        : ele.sequenceNo == sequenceNo
                        ? { ...ele, isCompleted: false, resultObj }
                        : { ele };
                    });
                    if (commandType == "master") {
                      setMasterCommandsOld(finalArray);
                    } else {
                      setClientModalCommandsOld(finalArray);
                    }
                    accumulateString.current = "";
                  }
                }
              } else {
                alert("Unexpected Response Found From Device!!");
                accumulateString.current = "";
                // setIsLoading(false);

                break;
              }
              //=====================================================
              // return accumulateString.current;
            }
            setIsLoading(false);
          }
          if (
            value &&
            (keyToVerify == null || Object.keys(keyToVerify).length == 0)
          ) {
            console.log(decoder.decode(value));
            accumulateString.current += decoder.decode(value);
            console.log(accumulateString.current);
            if (accumulateString.current.includes("DBG#")) {
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
                //debugger;
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
                if (commandType == "master") {
                  setMasterCommandsOld(finalArray);
                } else {
                  setClientModalCommandsOld(finalArray);
                }

                debugger;
                accumulateString.current = "";
                count.current++;
                if (commandArray.length == count.current) {
                  setIsMasterDOne(true);
                  setShowTestedDeviceSaveBtn(true);
                }

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
                  if (commandResponse != 200) {
                    count.current = 0;
                    accumulateString.current = 0;
                    setIsLoading(false);

                    const finalArray = commandArrayForStepper.map((ele) => {
                      return ele.sequenceNo < sequenceNo
                        ? { ...ele, isCompleted: true }
                        : ele.sequenceNo == sequenceNo
                        ? { ...ele, isCompleted: false }
                        : ele;
                    });
                    if (commandType == "master") {
                      setMasterCommandsOld(finalArray);
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
                  if (commandType == "master") {
                    setMasterCommandsOld(finalArray);
                  } else {
                    setClientModalCommandsOld(finalArray);
                  }
                  saveCommand(accumulateString.current, serialData, valid);

                  accumulateString.current = "";
                }
              }
              //=====================================================
              // return accumulateString.current;
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
            if (commandType == "master") {
              setMasterCommandsOld(finalArray);
            } else {
              setClientModalCommandsOld(finalArray);
            }
            accumulateString.current = "";

            break;
          }
        }
      } catch (err) {
        console.error("Error sending/receiving data:", err);
        // setIsLoading(false);
      }
    } else {
      console.error("COM Port not connected or not writable.");
      // setIsLoading(false);
    }
  }

  function sendCommandHandler(commandType) {
    // masterCommands.map((ele,index)=>{
    // console.log(count.current);
    count.current = 0;
    if (commandType == "master") {
      bufferTransactionHandler(masterCommands, masterCommandsOld, commandType);
    } else {
      setIsLoading(true);

      bufferTransactionHandler(
        clientModalCommands,
        clientModalCommandsOld,
        commandType
      );
    }
  }
  let masterInfo = {};

  function areKeysPresent(object, string, commandType) {
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
          debugger;
          // pattern = new RegExp(`${key.toUpperCase()}(.*?)(,|$)`);

          // match = string.match(pattern);
          const isPresent = string.includes(key.toUpperCase());
          if (!isPresent) {
            resultObj[key.toUpperCase()] = "Not Present";
            return { valid: false, key: key, resultObj };
          } else {
            debugger;
            pattern = new RegExp(`${key.toUpperCase()}`);
            match = string.match(pattern);

            resultObj[key.toUpperCase()] = "Present";
          }

          // match[0]=`${key.toUpperCase()}:Present`
          // match[1]=`Present`
        }

        debugger;
        console.log(match);
        if (match && commandType == "master" && count.current == 0) {
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
        debugger;
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
          if (
            Number(lotDetails?.externalVoltage) - bufferVoltage.current >
              Number(match[1]) ||
            Number(match[1]) >
              Number(lotDetails?.externalVoltage) + bufferVoltage.current
          ) {
            resultObj[key.toUpperCase()] = match[1];
            return { valid: false, key, resultObj };
          }
        } else if (commandType != "master" && key == "IntV") {
          console.log(match[1]);
          if (3.6 > Number(match[1]) || Number(match[1]) > 4.2) {
            resultObj[key.toUpperCase()] = match[1];

            return { valid: false, key, resultObj };
          }
        } else if (
          commandType != "master" &&
          object[key] != "CHECKONLYKEY" &&
          !object[key].toUpperCase().includes(match[1].toUpperCase())
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

  function rejectModalHandler() {
    setOpenRejectModal(true);
    // rejectDevice();
  }

  async function rejectDevice(remark) {
    setIsLoading(true);
    debugger;
    const {
      IMEI: imeiNo,
      UID: uuidNo,
      CCID: ccidNo,
    } = JSON.parse(localStorage.getItem("masterInfo"));
    let data = {
      remark: remark || "",
      imeiNo: imeiNo,
      userId: JSON.parse(localStorage.getItem("data")).id,
    };

    const res = await LotAction.rejectDevice(data);
    if (res) {
      setIsLoading(false);

      alert(res.message);
      alert("Plugin new Device!");
      window.location.reload();
      // console.log(res);

      // return res.responseCode;
    }
  }
  return (
    <div className="main_container">
      <Box className="main">
        <ThemeProvider theme={theme}>
          <BarCodePrint
            duplicate={isDuplicate ? "DPL" : " "}
            uid={
              localStorage.getItem("masterInfo") &&
              JSON.parse(localStorage.getItem("masterInfo")).UID
            }
            imei={
              localStorage.getItem("masterInfo") &&
              JSON.parse(localStorage.getItem("masterInfo")).IMEI
            }
            ccid={
              localStorage.getItem("masterInfo") &&
              JSON.parse(localStorage.getItem("masterInfo")).CCID
            }
            tacNo={lotDetails?.modelId?.tacNo ?? ""}
            componentRef={componentRef}
            handlePrint={handlePrint}
          />
          <LoadingComponent isLoading={isLoading} />
          <RejectModal
            open={openRejectModal}
            setOpen={setOpenRejectModal}
            rejectHandler={rejectDevice}
            rejectRemark={rejectRemark}
            setRejectRemark={setRejectRemark}
          ></RejectModal>

          <Grid container justifyContent={"space-between"} className="mb-1">
            <Grid item xs={8}>
              <TopView topViewData={topViewData}></TopView>
            </Grid>
            <Grid item xs={4} container justifyContent={"flex-end"}>
              <Grid item xs={6} textAlign={"right"}>
                {false && (
                  <Button
                    id="check-command-btn"
                    variant="contained"
                    sx={{ color: "white" }}
                    // onClick={connectDeviceWithUsbPort}
                    color="success"
                    onClick={sendCommandHandler}
                  >
                    start test
                  </Button>
                )}
              </Grid>
              <Grid item xs={6} textAlign={"right"}>
                <Button
                  variant="contained"
                  sx={{ color: "white" }}
                  onClick={connectDeviceWithUsbPort}
                >
                  Connect Device
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid container sx={{ marginTop: "0rem", background: "" }} rowGap={1}>
            <Paper
              sx={{ width: "100%", margin: "10px 0px", padding: "10px" }}
              elevation={1}
            >
              <Grid item xs={12} container spacing={2} flexWrap="nowrap">
                <Grid item container spacing={1}>
                  <Grid item>
                    <Typography sx={{ color: "rgb(14 57 115)" }}>
                      LOT ID:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography sx={{ color: "rgb(88 86 86)" }}>
                      {lotDetails?.systemLotId ?? "NA"}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item container spacing={1}>
                  <Grid item>
                    <Typography sx={{ color: "rgb(14 57 115)" }}>
                      ESM Master:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography sx={{ color: "rgb(88 86 86)" }}>
                      {lotDetails?.emsMaster?.name ?? "NA"}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item container spacing={1}>
                  <Grid item>
                    <Typography sx={{ color: "rgb(14 57 115)" }}>
                      Client Name:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography sx={{ color: "rgb(88 86 86)" }}>
                      {lotDetails?.client?.companyName ?? "NA"}{" "}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item container spacing={1}>
                  <Grid item>
                    <Typography sx={{ color: "rgb(14 57 115)" }}>
                      Device Modal:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography sx={{ color: "rgb(88 86 86)" }}>
                      {lotDetails?.modelId?.model ?? "NA"}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item container spacing={1}>
                  <Grid item>
                    <Typography sx={{ color: "rgb(14 57 115)" }}>
                      Sim Provider:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography sx={{ color: "rgb(88 86 86)" }}>
                      {lotDetails?.provider?.name ?? "NA"}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item container spacing={1}>
                  <Grid item>
                    <Typography sx={{ color: "rgb(14 57 115)" }}>
                      Primary Operator:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography sx={{ color: "rgb(88 86 86)" }}>
                      {lotDetails?.operators?.name ?? "NA"}{" "}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item container spacing={1} flexWrap={"nowrap"}>
                  <Grid item>
                    <Typography sx={{ color: "rgb(14 57 115)" }}>
                      State:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography sx={{ color: "rgb(88 86 86)" }}>
                      {lotDetails?.state?.name ?? "NA"}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item container spacing={1}>
                  <Grid item>
                    <Typography sx={{ color: "rgb(14 57 115)" }}>
                      Device count.current:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography sx={{ color: "rgb(88 86 86)" }}>
                      {`${lotDetails?.testedQuantity ?? 0}/${
                        lotDetails?.orderQuantity
                      }`}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
            <Grid item xs={12}>
              <Paper sx={{ width: "100%", mb: 2 }} elevation={1}>
                {/* <Box component={Paper} elevation={1}> */}
                <Grid container rowGap={1} style={{ padding: 10 }}>
                  <Grid
                    item
                    xs={12}
                    container
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    sx={{
                      backgroundColor: "rgb(14 57 115 / 86%)",
                      color: "#fff",
                      padding: "5px 8px",
                      fontSize: "1.1rem",
                      borderRadius: 1,
                    }}
                  >
                    <Grid item>
                      {" "}
                      <Typography>Master Configuration</Typography>
                    </Grid>
                    <Grid item>
                      {" "}
                      {isGyroFound.current && (
                        <Button
                          id="check-command-btn"
                          variant="contained"
                          sx={{
                            background: "rgb(100 150 200)",
                            color: "white",
                          }}
                          color="success"
                          onClick={() => sendCommandHandler("master")}
                        >
                          start test
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                  <Grid item xs={12} className="p-2">
                    <CustomizedSteppers
                      steps={masterCommandsOld}
                    ></CustomizedSteppers>
                  </Grid>
                </Grid>
                {/* </Box> */}
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ width: "100%", mb: 2 }} elevation={1}>
                {/* <Box component={Paper} elevation={1}> */}
                <Grid container rowGap={1} style={{ padding: 10 }}>
                  <Grid
                    item
                    xs={12}
                    container
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    sx={{
                      backgroundColor: "rgb(14 57 115 / 86%)",
                      color: "#fff",
                      padding: "5px 8px",
                      fontSize: "1.1rem",
                      borderRadius: 1,
                    }}
                  >
                    <Grid item>
                      <Typography>Client Configuration</Typography>
                    </Grid>
                    <Grid item>
                      <Grid item>
                        {" "}
                        {isMasterDone && (
                          <Button
                            id="check-command-btn"
                            variant="contained"
                            sx={{
                              background: "rgb(100 150 200)",
                              color: "white",
                            }}
                            // onClick={connectDeviceWithUsbPort}
                            color="success"
                            onClick={() => sendCommandHandler("client")}
                          >
                            start test
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    // className="p-2"
                    container
                    columnGap={2}
                    minWidth={350}
                    maxWidth={350}
                    flexWrap={"wrap"}
                  >
                    {
                      <>
                        <CustomizedSteppers
                          steps={clientModalCommandsOld}
                        ></CustomizedSteppers>
                      </>
                    }
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            {showTestedDeviceSaveBtn && (
              <Grid
                item
                container
                justifyContent={"flex-end"}
                spacing={3}
                sx={{
                  padding: "5px",
                }}
              >
                <Grid item>
                  <Button
                    variant="outlined"
                    sx={{
                      background: "red",
                      color: "#fff",
                    }}
                    onClick={rejectModalHandler}
                  >
                    Reject
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    sx={{ color: "white" }}
                    variant="contained"
                    onClick={saveTestedDevice}
                  >
                    {" "}
                    Save
                  </Button>
                </Grid>
              </Grid>
            )}
          </Grid>
        </ThemeProvider>
      </Box>
    </div>
  );
}

export default ViewLot;
