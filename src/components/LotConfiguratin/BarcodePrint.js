import React, { useRef, useState } from "react";
// import { useBarcode } from "@createnextapp/react-barcode";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
// import Barcode from "react-barcode";

import Barcode from "react-jsbarcode";

export default function BarCodePrint({
  uid,
  imei,
  ccid,
  handlePrint,
  componentRef,
  tacNo,
  duplicate,
}) {
  const rotatedDiv = {
    // padding: " 0px 0px",
    // margin: "0px",
    // marginTop: "20px",
  };

  const labelStyle = {
    marginTop: "10px",
    fontWeight: "bold",
    fontSize: "16px", // Adjust label font size
    width: "50px",
    // margileft: "10px",
  };

  const divStyle = {
    display: "flex",
    justifyContent: "start",
    margin: "6px 10px",
    paddingLeft: "0px",
  };

  const tagNo = {
    transform: "rotate(90deg)",
    marginTop: "70px",
    fontWeight: "bold",
    fontSize: "17px", // Adjust label font size
  };
  return (
    <div style={{ display: "none" }}>
      {/* <ReactToPrint
        trigger={() => <button  >Print</button>}
        content={() => componentRef.current}
        pageStyle={pageStyle}
      /> */}

      <div>
        <Card
          ref={componentRef}
          style={{
            maxWidth: 400,
            // height:"100%",
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
          }}
          className="componentRef"
        >
          <CardActionArea style={rotatedDiv} className="mainBox">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: "bold",
                  textAlign: "left",
                }}
              >
                <span>{duplicate}</span>
              </div>
              <div
                style={{
                  // display:"inline-block",

                  fontSize: "15px",
                  fontWeight: "bold",
                  textAlign: "right",
                }}
              >
                <span>TACNO:{tacNo}</span>
              </div>
            </div>

            <div style={divStyle}>
              {/* {/ <span style={labelStyle}>UID</span> /} */}

              <Barcode
                value={uid}
                options={{
                  format: "code128",
                  height: 20,
                  margin: 1,
                  fontSize: 25,
                  font:"Verdana",

                  displayValue: true,
                  textMargin: 1.2,
                  width: 3.1,
                  textAlign: "left",
                  textPosition: "bottom",
                  text: `UID:  ${uid}`,
                  // fontOptions: "bold",
                }}
                renderer="canvas"
                // format={"CODE128"}
                // fontSize={14}
                // margin={1}
                // padding={1}
                // width={1.5}
                // height={40}
                // // fontWeight={"bold"}
                // textAlign={"center"}
                style={{ maxWidth: "70%" }}
              />
            </div>

            <div style={divStyle}>
              {/* {/ <span style={labelStyle}>IMEI</span> /} */}

              <Barcode
                value={imei}
                // format={"CODE128"}
                // fontSize={14}
                // margin={1}
                // padding={7}
                // width={1.5}
                // height={40}
                // textAlign={"center"}
                style={{ maxWidth: "95%" }}
                options={{
                  format: "code128",
                  height: 27,
                  margin: 1,
                  fontSize: 25,
                  font:"Verdana",

                  displayValue: true,
                  textMargin: 1.2,
                  width: 3.1,
                  textAlign: "left",
                  textPosition: "bottom",
                  text: `IMEI:  ${imei}`,
                  // fontOptions: "bold",
                }}
                renderer="canvas"
              />
            </div>

            <div style={divStyle}>
              {/* {/ <span style={labelStyle}>CCID</span> /} */}

              <Barcode
                value={ccid}
                // format={"CODE128"}
                // fontSize={14}
                // margin={4}
                // padding={1}
                // width={1.5}
                // height={40}
                // // fontWeight={"bold"}
                // textAlign={"center"}
                style={{ maxWidth: "100%", marginLeft: 4 }}
                options={{
                  format: "code128",
                  height: 30,
                  margin: 1.1,
                  fontSize: 28,
                  font:"Verdana",
                  displayValue: true,
                  textMargin: 1.5,
                  width: 3.2,
                  textAlign: "left",
                  textPosition: "bottom",
                  text: `CCID:${ccid}`,
                  // fontOptions: "bold",
                }}
                renderer="canvas"
              />
            </div>
          </CardActionArea>
        </Card>
      </div>
    </div>
  );
}
