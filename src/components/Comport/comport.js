import React, { useEffect, useState } from "react";
import TopView from "../CommonComponents/topView";
import { Button, Typography } from "@mui/material";
import { Start } from "@mui/icons-material";
let port;
let accumulateString = "";
const Comport = () => {
  //   useEffect(async () => {

  //   }, []);
  const [serialData, setSerialData] = useState("");
  const [serialDataResponse, setSerialDataResponse] = useState("");
  let topViewData = {
    pageTitle: "All Devices",
    /* ================= */
    addText: "Add Company",
    // hideAddButton: !webPermission.includes("ADD_COMPANY"),
    hideAddButton: true,
    addClick: "/",
    /* ====================== */
    editText: "",
    hideEditButton: true,
    editClick: null,
    /* =========================== */
    cancelText: null,
    hideCancelButton: true,
    cancelClick: null,
    /* ================== */
    updateText: null,
    hideUpdateButton: true,
    updateClick: null,
    /* ================== */
    hidePdfExport: true,
    exportPdfClick: "",
    onPdfDownload: null,
    /* ================= */
    hideExcelExport: true,
    exportExcelClick: "",
    onExcelDownload: null,
    /* ==================== */
    hideExcelImport: true,
    excelImportClick: null,
    /* ==================== */
    filter: true,
    filterHandler: null,
    /* ====================== */

    searchFieldHandler: null,
    searchInput: "",
    searchField: true,

    filteredValue: "",
  };

  async function serialReaderHandler() {
    if ("serial" in navigator) {
      try {
        port = await navigator.serial.requestPort();
        console.log(port.getInfo());
        await port.open({
          baudRate: 19200,
          dataBits: 8,
          stopBits: 1,
          flowControl: "none",
          // bufferSize: 1024 ,
          parity: "none",
        });
        console.log(port);

        console.log("Connected to GPS device.");
      } catch (err) {
        console.error("Error connecting to GPS device:", err);
      }
    } else {
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
  // async function readLoop(){
    
  //     let decoder = new TextDecoder();

  //     const reader = port.readable.getReader();
  //     while (true) {
  //       const { value, done } = await reader.read();
  //       debugger
  //       if (value) {
  //         accumulateString += decoder.decode(value);
  //         console.log(accumulateString);
  //       }
  //       if (done) {
  //         reader.releaseLock();
  //         break;
  //       }
      
  //   }

  // }
 async function bufferTransactionHandler() {
    if (port && port.writable) {
      // const command = commandInput.value.trim();
      try {
        const writer = port.writable.getWriter();
        //new TextEncoder().encode(serialData) this actually converts a string into Unit8Array/arrayBuffer/typedArray
        await writer.write(new TextEncoder().encode(serialData));
        writer.releaseLock();

        console.log(port, "serialport");

     
        let decoder = new TextDecoder();

        const reader = port.readable.getReader();
        while (true) {
          const { value, done } = await reader.read();
          debugger
          if (value) {
            console.log(decoder.decode(value))
            accumulateString += decoder.decode(value);
            console.log(accumulateString);
            if(accumulateString.includes("DBG#")){
              reader.releaseLock();
              port.readable.cancel();
            setSerialDataResponse(accumulateString)

            }
          }
          if (done) {
            reader.releaseLock();
      
            break;
          }
        
      }

        // while (port.readable) {
        //   const reader =port.readable.getReader();

        //   try {
        //     while (true) {
        //       const { value, done } = await reader.read();
        //       if (done) {
        //         // Allow the serial port to be closed later.
        //         console.log("rahul")
        //         reader.releaseLock();
        //         break;
        //       }
        //       if (value) {
        //        let string=await new TextDecoder().decode(value)
        //        accumulateString =accumulateString.concat(" ",string)
        //         console.log(accumulateString);
        //         setSerialDataResponse(accumulateString)

        //       }
        //     }
        //   } catch (error) {
        //     console.log(error,"error");
        //     // TODO: Handle non-fatal read error.
        //   }
        // }

        // console.log(`Received response: ${accumulatedResponse}`);
        // responseContainer.textContent = accumulatedResponse;
      } catch (err) {
        console.error("Error sending/receiving data:", err);
      }
    } else {
      console.error("COM Port not connected or not writable.");
    }
  }

  function handleSerialInput(data) {
    setSerialData(data.trim());
  }
  return (
    <div className="main_container">
      <TopView topViewData={topViewData} />

      <div className="main">
        <div className="serial-scale-div">
          <Button
            className="btn"
            id="connect-to-serial"
            onClick={serialReaderHandler}
          >
            Connect with Serial Device
          </Button>

          <Button
            className="btn"
            id="get-serial-messages"
            onClick={bufferTransactionHandler}
          >
            Get serial messages
          </Button>
          <input
            value={serialData}
            type="text"
            onChange={(e) => handleSerialInput(e.target.value)}
          ></input>
        </div>

        <div id="serial-messages-container">
          <div class="message">{serialDataResponse && serialDataResponse}</div>
        </div>
      </div>
    </div>
  );
};

export default Comport;
