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
import "../BoxPackaging/BoxList.css";
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
import { DashboardAction } from "../actions/dashboard";
import { BoxPackaging } from "../actions/boxPackaging";

import { useNavigate } from "react-router-dom";

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
  pageTitle: "Update device Box",
  /* ================= */
  addText: "Add Company",
  // hideAddButton: !webPermission.includes("ADD_COMPANY"),
  hideAddButton: true,
  addClick: "/deviceStatusUpdate",
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
};
export const CustomAccordion = styled(Accordion)(({ theme, ...props }) => ({
  backgroundColor: "rgb(14 57 115 / 86%)",
  color: "white",
  marginBottom: "20px",

  "& .MuiCollapse-root": {
    backgroundColor: "#fff",
    color: "black",
    padding: "20px 50px",
  },
  "& .MuiAccordionSummary-root": {
    backgroundColor: props.summarybg && props.summarybg,
    //pointerEvents: "none",
    borderRadius: "8px",
    minHeight: "auto !important",
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

function DeviceStatusUpdate() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState(true);
  const [qrScanned, setQrScanned] = React.useState(false);
  const [state, setState] = React.useState();
  const [boxQuantity, setBoxQuantity] = React.useState(50);
  const [deviceId, setDeviceId] = React.useState();
  const [packedDeviceList, setPackedDeviceList] = React.useState([]);
  const [scannedDeviceList, setScannedDeviceList] = React.useState([]);
  const [imeiArr, setImeiNoArr] = React.useState([]);
  const [uniqueNumber, setUniqueNumber] = React.useState();
  const [totalDevice, setTotalDevice] = React.useState();
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
  // let imeiArr=[]
  const getDeviceByStateID = (data) => {
    BoxPackaging.fetchDeviceByStateId(data)
      .then((response) => {
        //
        if (response != null) {
          console.log(response.data);
          const imeiNoArr = response.data.map((ele) => {
            const findSequence = ele.imeiNo + ele.iccidNo + ele.uuidNo;
            console.log(findSequence);
            //  return ele.imeiNo
            return findSequence;
          });
          setImeiNoArr(imeiNoArr);
          console.log(imeiArr);
          setTotalDevice(response.data.length);
          setPackedDeviceList(response.data);
        } else {
          setImeiNoArr([]);
          setTotalDevice();
          setPackedDeviceList([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    // getStateList();
    getDeviceByStateID({
      statusMaster: "TESTED",
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      document.getElementById("outlined-basic-1").value = "";
    }, 999);
  }, [scannedDeviceList]);
  // const getStateHandler = (data) => {
  //   if (data != null) {
  //     setState(data);
  //     getDeviceByStateID({ stateId: data.id });
  //   } else {
  //     setState();
  //   }
  // };
  const boxQuantityHandler = (data) => {
    if (data != null) {
      console.log(data);
      if (packedDeviceList.length < data) {
        alert("Box size Can not be greater than available devices");
        return;
      } else {
        setBoxQuantity(data);
      }
    } else {
      setBoxQuantity();
    }
  };

  // const getScannedDeviceId = (data) => {
  //   if (data != null) {
  //     setDeviceId(data);
  //   } else {
  //     setDeviceId();
  //   }
  // };

  const handleChange = (panel) => {
    setExpanded((pre) => {
      return !pre;
    });
  };
  // function qrHandler(event) {
  //   // setQrScanned(true)

  //   setDeviceId(event.target.value);
  //   setUniqueNumber(event.target.value)
  //   setDeviceId();

  // }
  // let delay
  // function removeItemFromBoxHandler(item, removeIndex) {
  //   setPackedDeviceList((arr) => {
  //     arr.push(item);
  //     setImeiNoArr(
  //       arr.map((e) => {
  //         return e.imeiNo;
  //       })
  //     );
  //     return arr;
  //   });
  //   setScannedDeviceList((arr) => {
  //     return arr.filter((ele, i) => {
  //       return removeIndex != i;
  //     });
  //   });
  // }

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
      console.log([...arr, item]);

      return [...arr, item];
    });

    setScannedDeviceList((arr) => {
      console.log(arr.slice(0, removeIndex).concat(arr.slice(removeIndex + 1)));
      document.getElementById("outlined-basic-1").focus();
      return arr.slice(0, removeIndex).concat(arr.slice(removeIndex + 1));
    });

    // setPackedDeviceList(arr=>{
    //       arr.push(item);
    //       setImeiNoArr(arr.map(e=>{
    //         return e.imeiNo
    //       }))
    //       return arr
    // })
    // setScannedDeviceList(arr=>{
    //   return arr.filter((ele,i)=>{
    //      return removeIndex!=i
    //   })
    // })
  }

  async function findDevice(data) {
    try {
      const res = await BoxPackaging.findDevice({ imeiNo: data });

      if (res && res.responseCode == 200) {
        console.log(res);
        return res;
      } else {
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const qrHandler = debounce(
    (e, value) => {
      // value=value.length>19? value.slice(0,19) : value;
      debugger;
      // const value1 = value.slice(value.length - 15);
      // console.log(value.slice(value.length - 15));
      const value1 = value;
      console.log(value, packedDeviceList, imeiArr);
      let idx;
      imeiArr.forEach((ele, index) => {
        if (ele.includes(value)) {
          idx = index;
          return;
        }
      });

      console.log(idx);
      // setDeviceId(value);
      if (value1 !== "") {
        // delay=1500
        // const idx = imeiArr.indexOf(value1);

        if (idx != -1 && idx != undefined) {
          /* if the scanned device exist in the packed device list */
          // if (scannedDeviceList.length == 0) {
          //   /* get the state name from the first scanned device */
          //   setState(packedDeviceList[idx].state);
          // }
          const updatedImeiNoPackedArray = imeiArr.filter((ele, i) => {
            return i != idx;
          });
          console.log(updatedImeiNoPackedArray);

          /* remaining devices list */
          setImeiNoArr(updatedImeiNoPackedArray);
          setScannedDeviceList((arr) => {
            if (arr.length == 0) {
              const addedToBox = [packedDeviceList[idx],...arr];
              const updatedPackedListArray = packedDeviceList.slice();

              const updatedPackedListArray2 = updatedPackedListArray.filter(
                (ele, i) => {
                  return i != idx;
                }
              );

              setPackedDeviceList(updatedPackedListArray2);
              return addedToBox;
            } else if (arr.length > 0) {
              // if (arr[0].state.id == packedDeviceList[idx].state.id) {
              const addedToBox = [ packedDeviceList[idx],...arr];
              const updatedPackedListArray = packedDeviceList.slice();

              const updatedPackedListArray2 = updatedPackedListArray.filter(
                (ele, i) => {
                  return i != idx;
                }
              );

              setPackedDeviceList(updatedPackedListArray2);

              return addedToBox;
            }
          });
        } else {
          debugger;
          const elementId = document.getElementById("outlined-basic-1");
          elementId.innerText = "";
          elementId.value = "";
          if (value.length <= 12 || value.length > 15) {
            alert("Imei number is not scanned properly please scan again!");
          } else {
            findDevice(value)
              .then((response) => {
                console.log(response);
                if (
                  response?.responseCode == 200 ||
                  response?.responseCode == 201
                ) {
                  if (response?.data?.status == "TESTED") {
                    alert("Device is already Packed!");
                  } else {
                    alert(`Device Status is ${response?.data?.status}`);
                  }
                } else {
                  alert(response.message);
                }
              })
              .catch((err) => {
                console.log(err);
              });

            // alert("there is no as such device");
          }
        }
      } else {
        // alert("Scan device properly")
        document.getElementById("outlined-basic-1").focus();
        return;
      }
      // document.getElementById("outlined-basic-1").reset();
    },
    [1000]
  );
  // console.log(deviceId);
  // const qrHandler = debounce(
  //   (e, value) => {
  //     //;
  //     const value1 = value.slice(value.length - 15);
  //     console.log(value.slice(value.length - 15));
  //     console.log(e.keyCode);

  //     if (value1 !== "") {
  //       // delay=1500
  //       const idx = imeiArr.indexOf(value1);

  //       if (idx != -1) {
  //         if (scannedDeviceList.length == 0) {
  //           setState(packedDeviceList[idx].state);
  //         }
  //         const updatedImeiNoPackedArray = imeiArr.filter((ele, i) => {
  //           return i != idx;
  //         });
  //         console.log(updatedImeiNoPackedArray);

  //         /* remaining devices list */
  //         setImeiNoArr(updatedImeiNoPackedArray);
  //         setScannedDeviceList((arr) => {
  //           if (arr.length == 0) {
  //             const addedToBox = [...arr, packedDeviceList[idx]];
  //             const updatedPackedListArray = packedDeviceList.slice();

  //             const updatedPackedListArray2 = updatedPackedListArray.filter(
  //               (ele, i) => {
  //                 return i != idx;
  //               }
  //             );

  //             setPackedDeviceList(updatedPackedListArray2);
  //             // setDeviceId("")
  //             return addedToBox;
  //           } else if (arr.length > 0) {
  //             if (arr[0].state.id == packedDeviceList[idx].state.id) {
  //               const addedToBox = [...arr, packedDeviceList[idx]];
  //               const updatedPackedListArray = packedDeviceList.slice();

  //               const updatedPackedListArray2 = updatedPackedListArray.filter(
  //                 (ele, i) => {
  //                   return i != idx;
  //                 }
  //               );

  //               if (boxQuantity >= updatedPackedListArray2.length) {
  //                 setPackedDeviceList(updatedPackedListArray2);
  //                 // setDeviceId("")
  //                 return addedToBox;
  //               } else {
  //               }
  //             } else {
  //               alert("This device belongs to other state");
  //               return;
  //             }
  //           }
  //           // arr.push(packedDeviceList[idx]);
  //           // console.log(arr);
  //         });
  //       } else {
  //         alert("there is no as such device");
  //       }
  //       // setPackedDeviceList((array) => {});

  //       // setDeviceId("");
  //       // let arr = [...digiLockList];
  //       // const a = allLocks?.find((val) => val.serialNumber === value);

  //       // if (a !== undefined && !arr.includes(a)) {
  //       //   arr.push(a);
  //       //   setDigiLockList(arr);
  //       //   setMessage("");
  //       //   setBarValue("");
  //       // } else if (a === undefined) {
  //       //   setMessage("Wrong BarCode");
  //       // } else {
  //       //   setMessage("Already Added");
  //       //   // alert("Already Added")
  //       // }
  //     } else {
  //       // alert("Scan device properly")
  //       return;
  //     }
  //   },
  //   [1000]
  // );
  console.log(scannedDeviceList);
  // React.useEffect(() => {
  //   const getData = setTimeout(() => qrHandler, 1000);

  //   return () => clearTimeout(getData);
  // }, [deviceId]);

  const saveBox = () => {
    // alert("inside")

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
      // stateId: state ? state.id : null,
      ids: deviceIds ? deviceIds : [],
      statusMaster: "DEVICE_PACKED",
    };

    DashboardAction.updateDeviceStatus(data)
      .then((response) => {
        if (response != null) {
          console.log(response);
          navigate("/dashboard");
        } else {
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setQrScanned(false);
  };
  return (
    <div className="main_container">
      <Box className="main">
        <Grid>
          <TopView topViewData={topViewData} />
          <Box className="detail_space">
            <Grid style={{ height: 0 }} item xs={12}>
              {imeiArr.length >= 0 && (
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

                  // value={deviceId}
                  defaultValue=""
                  id="outlined-basic-1"
                  autoComplete="off"
                  name="deviceId"
                  // label="Device Unique Number"
                  variant="outlined"
                  size="small"
                ></CustomInputField>
              )}
            </Grid>
            <Grid className="detail_space" item container xs={12}>
              <Grid
                item
                container
                alignItems={"center"}
                justifyContent="space-between"
              >
                <div>
                  <span>
                    Total Tested Device :{"  "}
                    <span className="boxHeaderValue">{totalDevice}</span>
                  </span>
                </div>
                {/* <div>
                  <span>Box Size:- </span>{" "}
                  <span className="boxHeaderValue">{boxQuantity}</span>
                </div> */}
                <div>
                  <span>Packed Device: </span>
                  {"  "}
                  <span className="boxHeaderValue">
                    {scannedDeviceList.length}
                  </span>
                </div>
                {/* <div>
                  <span>More device to be added to box:- </span>{" "}
                  <span className="boxHeaderValue">
                    {boxQuantity - scannedDeviceList.length}
                  </span>
                </div> */}
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
                          Device Model
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
                      {scannedDeviceList.length > 0 &&
                        scannedDeviceList.map((ele, index, a) => {
                          console.log(a);
                          return (
                            <StyledTableRow key={ele.id}>
                              <StyledTableCell>{index + 1}</StyledTableCell>
                              <StyledTableCell>{ele.detail}</StyledTableCell>
                              <StyledTableCell>{ele.imeiNo}</StyledTableCell>
                              <StyledTableCell>{ele.iccidNo}</StyledTableCell>
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
              <CustomButtonSecondery onClick={() => navigate("/dashboard")}>
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

export default DeviceStatusUpdate;
