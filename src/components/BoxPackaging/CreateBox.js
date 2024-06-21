import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { debounce } from "lodash";
import {
  Box,
  Grid,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  // debounce,
} from "@mui/material";
import TopView from "../CommonComponents/topView";
import "./BoxList.css";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  CustomInputField,
  CustomAutoComplete,
  CustomButtonPrimary,
  CustomButtonSecondery,
} from "../CommonComponents/reusableComponents";
import {
  Table,
  TableContainer,
  TableRow,
  TableHead,
  TableBody,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { padding } from "@mui/system";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { BoxPackaging } from "../actions/boxPackaging";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../CommonComponents/LoadingComponts";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgb(14 57 115 / 86%)",
    color: theme.palette.common.white,
    padding: "5px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "10px",
  },
}));

const CustomButton = styled(Button)(({ theme }) => ({
  padding: "0px 8px",
  fontSize: ".95rem",
  backgroundColor: "#fff",
  height: "36px",
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

let topViewData = {
  pageTitle: "Create Box",
  /* ================= */
  addText: "Add Company",
  // hideAddButton: !webPermission.includes("ADD_COMPANY"),
  hideAddButton: true,
  addClick: "/createbox",
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
  exportPdfClick: "/companyCreate",
  /* ================= */
  hideExcelExport: true,
  exportExcelClick: "",
  onExcelDownload: null,
  /* ==================== */
  hideExcelImport: true,
  excelImportClick: "",
  /* ==================== */
  filter: true,
  filterHandler: null,
  /* ====================== */

  searchFieldHandler: null,
  searchInput: null,
  searchField: true,
};
export const CustomAccordion = styled(Accordion)(({ theme, ...props }) => ({
  backgroundColor: "rgb(14 57 115 / 86%)",
  color: "white",
  marginBottom: "20px",

  "& .MuiCollapse-root": {
    backgroundColor: "#fff",
    color: "black",
    padding: "0px 50px",
  },
  "& .MuiAccordionSummary-root": {
    backgroundColor: props.summarybg && props.summarybg,
    //pointerEvents: "none",
    borderRadius: "8px",
    minHeight: "auto !important",
    "& .MuiAccordionSummary-content.Mui-expanded": {
      margin: 0,
    },
    "& .MuiAccordionSummary-content": {
      margin: 0,
    },
  },
  "& .MuiAccordionSummary-content p": {
    color: "#fff",
    fontSize: "17px",
    fontWeight: "500",
  },
  "& .MuiAccordionSummary-expandIconWrapper svg": {
    fontSize: "40px",
    color: "#ccc",
  },
  "& .MuiAccordionDetails-root": {
    padding: "15px",
  },
}));

function CreateBox() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [focus, setFocus] = useState(true);
  const [expanded, setExpanded] = React.useState(true);
  const [qrScanned, setQrScanned] = React.useState(false);
  const [state, setState] = React.useState();
  const [boxQuantity, setBoxQuantity] = React.useState(5);
  const [deviceId, setDeviceId] = React.useState();
  const [packedDeviceList, setPackedDeviceList] = React.useState([]);
  const [scannedDeviceList, setScannedDeviceList] = React.useState([]);
  const [imeiArr, setImeiNoArr] = React.useState([]);
  const [uniqueNumber, setUniqueNumber] = React.useState();
  const [totalDevice, setTotalDevice] = React.useState();

  // const scanningDevices = [];

  function getStateList() {
    BoxPackaging.fetchStateList()
      .then((res) => {
        if (res != null) {
          console.log(res);
          setState(res);
        } else {
          setState([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  // console.log(imeiArr,"imeiArr")

  // let imeiArr=[]
  const getDeviceByStateID = (data) => {
    BoxPackaging.fetchDeviceByStateId(data)
      .then((response) => {
        if (response != null) {
          // console.log(response.data);
          const imeiNoArr = response.data.map((ele) => {
            const findSequence = ele.imeiNo + ele.iccidNo + ele.uuidNo;
            // console.log(findSequence);
            // return ele.imeiNo
            return findSequence;
          });
          // console.log(imeiNoArr,"imeiNoArr")
          setImeiNoArr(imeiNoArr);
          console.log(imeiArr);
          if (boxQuantity > response.data.length) {
            setBoxQuantity(response.data.length);
          }
          setTotalDevice(response.data.length);
          setPackedDeviceList(response.data);
        } else {
          setPackedDeviceList([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // useEffect(() => {
  // document.getElementById("outlined-basic").focus();
  // }, []);
  useEffect(() => {
    // getStateList();
    getDeviceByStateID({
      statusMaster: "DEVICE_PACKED",
    });
  }, []);
  useEffect(() => {
    if (document.getElementById("outlined-basic")) {
      const timer = setTimeout(() => {
        document.getElementById("outlined-basic").value = "";
      }, 999);
      clearTimeout(timer);
    }
  }, [scannedDeviceList]);
  // const getStateHandler = (data) => {
  // if (data != null) {
  // setState(data);
  // getDeviceByStateID({ stateId: data.id });
  // } else {
  // setState();
  // }
  // };
  const boxQuantityHandler = (data) => {
    console.log(data);
    if (data != null) {
      // console.log(data);
      if (packedDeviceList.length < data) {
        setBoxQuantity(packedDeviceList.length);

        alert("Box size Can not be greater than available devices");
        return;
      } else {
        setBoxQuantity(data);
        // document.getElementById("outlined-basic").focus();
      }
    } else {
      setBoxQuantity();
      // setFocus(true)
    }
    if (document.getElementById("outlined-basic"))
      document.getElementById("outlined-basic").focus();
  };
  // const getScannedDeviceId = (data) => {
  // if (data != null) {
  // setDeviceId(data);
  // } else {
  // setDeviceId();
  // }
  // };

  const handleChange = (panel) => {
    setExpanded((pre) => {
      return !pre;
    });
  };
  // function qrHandler(event) {
  // // setQrScanned(true)

  // setDeviceId(event.target.value);
  // setUniqueNumber(event.target.value)
  // setDeviceId();

  // }
  // let delay

  const a = [1, 2, 3, 4, 5, 6];
  console.log(a.slice(0, 2).concat(a.slice(3)));
  function removeItemFromBoxHandler(item, removeIndex) {
    console.log(
      scannedDeviceList,
      packedDeviceList,
      imeiArr,
      item,
      removeIndex
    );

    const findSequence = item.imeiNo + item.iccidNo + item.uuidNo;
    console.log(findSequence);
    const deletedImeiNo = findSequence;
    setImeiNoArr((arr) => {
      console.log([...arr, deletedImeiNo]);
      return [...arr, deletedImeiNo];
    });
    setPackedDeviceList((arr) => {
      console.log([item, ...arr]);

      return [item, ...arr];
    });

    setScannedDeviceList((arr) => {
      if (arr.length == 1) {
        arr = [];
        if (document.getElementById("outlined-basic"))
          document.getElementById("outlined-basic").focus();

        return arr;
      } else {
        console.log(
          arr.slice(0, removeIndex).concat(arr.slice(removeIndex + 1))
        );
        if (document.getElementById("outlined-basic"))
          document.getElementById("outlined-basic").focus();

        return arr.slice(0, removeIndex).concat(arr.slice(removeIndex + 1));
      }
    });

    // setPackedDeviceList(arr=>{
    // arr.push(item);
    // setImeiNoArr(arr.map(e=>{
    // return e.imeiNo
    // }))
    // return arr
    // })
    // setScannedDeviceList(arr=>{
    // return arr.filter((ele,i)=>{
    // return removeIndex!=i
    // })
    // })
    if (document.getElementById("outlined-basic"))
      document.getElementById("outlined-basic").focus();
  }
  const qrHandler = debounce(
    /* scannedlist size can not be greater then or equal to boxQuantity */
    (e, value) => {
      // const value1 = value.slice(value.length - 15);
      // console.log(value.slice(value.length - 15));
      if (document.getElementById("outlined-basic")) {
        document.getElementById("outlined-basic").value = "";
        document.getElementById("outlined-basic").text = "";
        document.getElementById("outlined-basic").innerText = "";
      }

      // console.log(scannedDeviceList, packedDeviceList, imeiArr, boxQuantity);

      const value1 = value;
      console.log(value);
      let idx;
      imeiArr &&
        imeiArr.forEach((ele, index) => {
          if (ele.includes(value)) {
            idx = index;
            return;
          }
        });
      console.log(boxQuantity, "idxfg-1");
      console.log(scannedDeviceList, "idxfg-2");
      if (scannedDeviceList?.length < boxQuantity) {
        if (value1 !== "") {
          // delay=1500

          // const idx = imeiArr.indexOf(value1);

          if (idx !== -1 && idx !== undefined) {
            /* if the scanned device exist in the packed device list */
            let untouchedArray = imeiArr.slice();
            let unTouchedPackedArray = packedDeviceList.slice();
            console.log("");
            const updatedImeiNoPackedArray = imeiArr.filter((ele, i) => {
              return i != idx;
            });
            console.log(updatedImeiNoPackedArray);

            /* remaining devices list */
            setScannedDeviceList((arr) => {
              if (arr.length == 0) {
                setImeiNoArr(updatedImeiNoPackedArray);
                const updatedPackedListArray = packedDeviceList.slice();

                const updatedPackedListArray2 = updatedPackedListArray.filter(
                  (ele, i) => {
                    return i != idx;
                  }
                );

                setPackedDeviceList(updatedPackedListArray2);
                const addedToBox = [packedDeviceList[idx], ...arr];

                // setDeviceId("")
                return addedToBox;
              } else {
                if (arr[0]?.state?.id) {
                  setImeiNoArr(updatedImeiNoPackedArray);
                  const addedToBox = [packedDeviceList[idx], ...arr];
                  const updatedPackedListArray = packedDeviceList.slice();

                  const updatedPackedListArray2 = updatedPackedListArray.filter(
                    (ele, i) => {
                      return i != idx;
                    }
                  );
                  setPackedDeviceList(updatedPackedListArray2);
                  return addedToBox;
                }
                // else {
                // debugger;
                // setImeiNoArr(updatedImeiNoPackedArray);
                // const addedToBox = [...arr, packedDeviceList[idx]];
                // const updatedPackedListArray = packedDeviceList.slice();

                // const updatedPackedListArray2 = updatedPackedListArray.filter(
                // (ele, i) => {
                // return i != idx;
                // }
                // );
                // setPackedDeviceList(updatedPackedListArray2);
                // return addedToBox;
                // }
              }
            });
          } else {
            alert("there is no as such device");
            const elementId =
              document.getElementById("outlined-basic") &&
              document.getElementById("outlined-basic");
            elementId.innerText = "";
            value = "";

            return;
            // elementId.innerText = "";
          }
          // setPackedDeviceList((array) => {});

          // setDeviceId("");
          // let arr = [...digiLockList];
          // const a = allLocks?.find((val) => val.serialNumber === value);

          // if (a !== undefined && !arr.includes(a)) {
          // arr.push(a);
          // setDigiLockList(arr);
          // setMessage("");
          // setBarValue("");
          // } else if (a === undefined) {
          // setMessage("Wrong BarCode");
          // } else {
          // setMessage("Already Added");
          // // alert("Already Added")
          // }
        }
        // else {
        //   // alert("Scan device properly")
        //   document.getElementById("outlined-basic").focus();
        //   return;
        // }
      } else {
        setScannedDeviceList((arr) => {
          return arr;
        });
        setPackedDeviceList((arr) => {
          return arr;
        });
        setImeiNoArr((arr) => {
          return arr;
        });
        alert("Box is Full now!!");
      }
    },
    [1000]
  );
  // const qrHandler = debounce(
  // /* scannedlist size can not be greater then or equal to boxQuantity */
  // (e, value) => {
  // console.log(scannedDeviceList, packedDeviceList, imeiArr, boxQuantity);
  // if (scannedDeviceList.length < boxQuantity) {
  // const value1 = value.slice(value.length - 15);
  // console.log(value.slice(value.length - 15));
  // if (scannedDeviceList.length == 0) {
  // /* get the state name from the first scanned device */
  // console.log(scannedDeviceList[0])
  // setState(scannedDeviceList[0].state);
  // }
  // if (value1 !== "") {
  // // delay=1500
  // const idx = imeiArr.indexOf(value1);

  // if (idx != -1) {
  // /* if the scanned device exist in the packed device list */

  // const updatedImeiNoPackedArray = imeiArr.filter((ele, i) => {
  // return i != idx;
  // });
  // console.log(updatedImeiNoPackedArray);

  // /* remaining devices list */
  // setImeiNoArr(updatedImeiNoPackedArray);
  // setScannedDeviceList((arr) => {
  // if (arr.length == 0) {
  // const addedToBox = [...arr, packedDeviceList[idx]];
  // const updatedPackedListArray = packedDeviceList.slice();

  // const updatedPackedListArray2 = updatedPackedListArray.filter(
  // (ele, i) => {
  // return i != idx;
  // }
  // );

  // setPackedDeviceList(updatedPackedListArray2);
  // // setDeviceId("")
  // return addedToBox;
  // } else if (arr.length > 0 && arr.length < boxQuantity) {
  // if (arr[0].state.id == packedDeviceList[idx].state.id) {
  // const addedToBox = [...arr, packedDeviceList[idx]];
  // const updatedPackedListArray = packedDeviceList.slice();

  // const updatedPackedListArray2 = updatedPackedListArray.filter(
  // (ele, i) => {
  // return i != idx;
  // }
  // );

  // if (boxQuantity >= updatedPackedListArray2.length) {
  // setPackedDeviceList(updatedPackedListArray2);
  // // setDeviceId("")
  // return addedToBox;
  // } else {
  // }
  // } else {
  // alert(
  // "This device belongs to other state please scan another device!!"
  // );
  // document.getElementById("outlined-basic").focus();
  // return arr;
  // }
  // }
  // alert(
  // `Box size is ${boxQuantity}, You can not exceed this limit!`
  // );
  // });
  // } else {
  // const elementId = document.getElementById("outlined-basic");
  // elementId.innerText = "";

  // alert("there is no as such device");
  // }
  // // setPackedDeviceList((array) => {});

  // // setDeviceId("");
  // // let arr = [...digiLockList];
  // // const a = allLocks?.find((val) => val.serialNumber === value);

  // // if (a !== undefined && !arr.includes(a)) {
  // // arr.push(a);
  // // setDigiLockList(arr);
  // // setMessage("");
  // // setBarValue("");
  // // } else if (a === undefined) {
  // // setMessage("Wrong BarCode");
  // // } else {
  // // setMessage("Already Added");
  // // // alert("Already Added")
  // // }
  // } else {
  // // alert("Scan device properly")
  // document.getElementById("outlined-basic").focus();
  // return;
  // }
  // } else {
  //
  // setScannedDeviceList(arr=>{
  // return arr;
  // })
  // setPackedDeviceList(arr=>{
  // return arr;
  // })
  // setImeiNoArr(arr=>{
  // return arr
  // })
  // alert("Box is Full now!!");

  // }
  // },
  // [1000]
  // );
  // console.log(scannedDeviceList);
  // React.useEffect(() => {
  // const getData = setTimeout(() => qrHandler, 1000);

  // return () => clearTimeout(getData);
  // }, [deviceId]);

  // useEffect(() => {
  //   qrHandler();
  // }, [scannedDeviceList]);
  const saveBox = () => {
    if (scannedDeviceList.length == 0) {
      alert("No device Scanned!!!");
      return;
    }
    const loginData = JSON.parse(localStorage.getItem("data"));
    const deviceIds = scannedDeviceList.map((ele) => {
      return ele.id;
    });
    let data = {
      createdById: loginData.id,
      quantity: scannedDeviceList.length,
      stateId: scannedDeviceList ? scannedDeviceList[0].state.id : null,
      deviceIds: deviceIds ? deviceIds : [],
    };
    setIsLoading(true);

    BoxPackaging.saveBox(data)
      .then((response) => {
        if (response != null) {
          // console.log(response);
          setIsLoading(false);

          navigate("/boxList");
        } else {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);

        console.log(err);
      });
    setQrScanned(false);
  };

  let options = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

  const boxSizeOption = options.map((ele, index) => {
    return <option key={index} value={ele}></option>;
  });
  // console.log(boxSizeOption);

  return (
    <div className="main_container">
      <Box className="main">
        <Grid>
          <LoadingComponent isLoading={isLoading}></LoadingComponent>
          <TopView topViewData={topViewData} />
          <Box className="detail_space">
            <CustomAccordion expanded={expanded} onChange={handleChange}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography sx={{ width: "43%", flexShrink: 0 }}>
                  Box Configuration
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  display: "flex",
                  alignItems: "center",

                  columnGap: "30px",
                }}
              >
                {/* <CustomAutoComplete
disablePortal
required
id="stateList"
options={state ? state : []}
// defaultValue={companyData.companyOwner}
getOptionLabel={({ name }) => {
return name;
}}
onChange={(event, newvalue) => {
getStateHandler(newvalue);
}}
name="state"
sx={{ width: "30%" }}
renderInput={(params) => (
<TextField {...params} label="State " name="state" />
)}
/> */}

                <CustomAutoComplete
                  disablePortal
                  freeSolo
                  // type="number"
                  // disabled={editField}
                  id="combo-box-demo"
                  options={[
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                    17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
                    32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
                    47, 48, 49, 50,
                  ]}
                  // options={[1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50]}
                  // defaultValue={50}
                  getOptionLabel={(name) => {
                    return name;
                  }}
                  onChange={(e, val) => boxQuantityHandler(val)}
                  value={boxQuantity}
                  sx={{ width: "20%" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Box Quantity"
                      name="boxQuantity"
                      id="scanHere"
                    />
                  )}
                />
                {/* <div style={{ fontSize: "1.2rem" }}>
<label htmlFor="box-size"> Box Size:- </label>
<input
type="text"
list="data"
id="box-size"
style={{
fontSize: "1.2rem",
borderRadius: "4px",
padding: "0px,10px",
width: "100px",
}}
value={boxQuantity}
onChange={(e) => boxQuantityHandler(e.target.value)}
/>

<datalist id="data" style={{ padding: "10px" }}>
{returnoptions.map((item, key) => (
<option key={key} value={item} />
))}
</datalist>
</div> */}
                {/* <CustomInputField
sx={{
width: "20%",
display: "none",
// zIndex: "-999",
}}
// autoFocus={qrScanned}
autoFocus={focus}
type="text"
onChange={(e) => qrHandler(e, e.target.value)}
// onKeyDown={(e) => qrHandler(e,e.target.value)}

// value={deviceId}
id="outlined-basic"
name="deviceId"
// label="Device Unique Number"
variant="outlined"
size="small"
></CustomInputField> */}
                {imeiArr && imeiArr.length >= 0 && (
                  <CustomInputField
                    sx={{
                      width: "20%",
                      // display: "none",
                      // zIndex: "-999",
                    }}
                    // autoFocus={qrScanned}
                    autoFocus
                    type="text"
                    onChange={(e) => qrHandler(e, e.target.value)}
                    // onKeyDown={(e) => qrHandler(e,e.target.value)}

                    // value={""}
                    autoComplete="off"
                    id="outlined-basic"
                    name="deviceId"
                    // label="Device Unique Number"
                    variant="outlined"
                    size="small"
                  ></CustomInputField>
                )}

                {/* <Typography sx={{ textAlign: "right" }} variant="outlined">
Start Scanning the item
</Typography> */}
              </AccordionDetails>
            </CustomAccordion>
            <Grid className="detail_space" item container xs={12}>
              <Grid
                item
                container
                alignItems={"center"}
                justifyContent="space-between"
              >
                <div>
                  <span>
                    Total Packed Device :{" "}
                    <span className="boxHeaderValue">{totalDevice}</span>
                  </span>
                </div>
                <div>
                  <span>Box Size: </span>{" "}
                  <span className="boxHeaderValue">{boxQuantity}</span>
                </div>
                <div>
                  <span>Device Added to Box: </span>{" "}
                  <span className="boxHeaderValue">
                    {scannedDeviceList && scannedDeviceList.length > 0
                      ? scannedDeviceList.length
                      : 0}
                  </span>
                </div>
                <div>
                  <span>More device to be added to box: </span>{" "}
                  <span className="boxHeaderValue">
                    {scannedDeviceList && boxQuantity
                      ? boxQuantity - scannedDeviceList.length
                      : 0}
                  </span>
                </div>
              </Grid>
              <Grid className="TableContainer" xs={12}>
                <TableContainer sx={{ borderRadius: "10px" }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell>S.No</StyledTableCell>
                        <StyledTableCell sx={{ whiteSpace: "nowrap" }}>
                          Device Name
                        </StyledTableCell>
                        <StyledTableCell sx={{ whiteSpace: "nowrap" }}>
                          IMEI Number
                        </StyledTableCell>
                        <StyledTableCell sx={{ whiteSpace: "nowrap" }}>
                          Device Modal
                        </StyledTableCell>

                        {/* <StyledTableCell sx={{ whiteSpace: "nowrap" }}>
                          State
                        </StyledTableCell> */}
                        <StyledTableCell sx={{ whiteSpace: "nowrap" }}>
                          Action
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {scannedDeviceList &&
                        scannedDeviceList.length > 0 &&
                        scannedDeviceList.map((ele, index, a) => {
                          console.log(a);
                          return (
                            <StyledTableRow key={ele.id}>
                              <StyledTableCell>{index + 1}</StyledTableCell>
                              <StyledTableCell>
                                {ele && ele.detail}
                              </StyledTableCell>
                              <StyledTableCell>
                                {ele && ele.imeiNo}
                              </StyledTableCell>
                              <StyledTableCell>
                                {ele && ele.iccidNo}
                              </StyledTableCell>
                              {/* <StyledTableCell>
                                {ele.state && ele.state.name
                                  ? ele.state.name
                                  : "NA"}
                              </StyledTableCell> */}
                              <StyledTableCell
                                onClick={() =>
                                  removeItemFromBoxHandler(ele, index)
                                }
                              >
                                {<DeleteOutlineIcon />}
                              </StyledTableCell>
                            </StyledTableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                columnGap: "20px",
              }}
            >
              <CustomButtonSecondery onClick={() => navigate("/boxList")}>
                Cancel
              </CustomButtonSecondery>

              <Button variant="contained" onClick={saveBox}>
                Save
              </Button>
            </Box>
          </Box>
        </Grid>
      </Box>
    </div>
  );
}

export default CreateBox;
