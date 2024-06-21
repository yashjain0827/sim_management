import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import {
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import TemplateExcel from "../../ImportImeiCommand.xlsx";
import readXlsxFile from "read-excel-file";
import { isArray } from "lodash";
import { CommandAction } from "../actions/command";
import { useState } from "react";
import DownloadTemplate from "../../img/Import Excel.svg";
import UploadExcel from "../../img/Export Excel.svg";
import { upload } from "@testing-library/user-event/dist/upload";
import LoadingComponent from "../CommonComponents/LoadingComponts";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
};

export default function ImortImeiCommand({
  open,
  setOpen,
  title,
  fetchAllCommandList,
}) {
  const [commandList, setCommandList] = React.useState([]);
  const [showBtn, setShowBtn] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [oldImeiCommandList, setoOldImeiCommandList] = useState([]);
  const [imeiCommandList, setImeiCommandList] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleClose = () => {
    setShowBtn(false);
    setCommandList([]);
    setImeiCommandList([]);
    document.getElementById("inputFile").value = "";
    setOpen(false);
  };

  const uploadExcelHandler = () => {
    document.getElementById("inputFile").click();
  };

  let updatedList = [];
  const onChangeHandler = async (e) => {
    setCommandList([]);
    setImeiCommandList([]);
    const input = document.getElementById("inputFile");
    const data = input?.files[0];
    setFileName(input?.files[0]?.name);
    setIsLoading(true);

    try {
      const response = await readXlsxFile(data);

      if (response && isArray(response)) {
        // const newEntries = response
        //   .slice(1)
        //   .map((val) => ({ imei: val[0], command: val[1] }));

        setCommandList((prev) => {
          // Check for duplicates and add new entries
          updatedList = [...prev];

          response?.slice(1)?.forEach((newEntry) => {
            const newEntries = { imei: newEntry[0], command: newEntry[1] };
            // const isDuplicate = updatedList.some(
            //   (entry) => entry.imei === newEntry.imei
            // );

            updatedList.push(newEntries);
            // if (!isDuplicate) {

            // }
          });

          return updatedList;
        });
        setShowBtn(true);
        setIsLoading(false);
        // Now set the imeiCommandList after updating commandList
        setImeiCommandList((prev) => updatedList?.slice(0, 50));
      }
    } catch (error) {
      alert("Please Select Excel File");
      console.error("Error reading file:", error);
    }
  };

  // const onChangeHandler =async (e) => {
  //   const input = document.getElementById("inputFile");
  //   const data = input?.files[0];

  //  await readXlsxFile(data).then((response) => {
  //     // console.log(response, "responsesxdcfvgbhjnmk");
  //     if (response !== null) {

  //       response &&
  //         isArray(response) &&
  //         response?.slice(1)?.map((val, ind) => {
  //           setCommandList((prev) => {
  //             const newEntry = {
  //               imei: val[0],
  //               command: val[1],
  //             };

  //             // Check if imei already exists in prev
  //             const isDuplicate =
  //               prev && prev.some((entry) => entry.imei === newEntry?.imei);

  //             if (isDuplicate) {
  //               // Handle duplicate imei case
  //               console.log("Duplicate imei found: ", newEntry?.imei);
  //               // You can choose to handle duplicate entries here, like showing a warning message or ignoring the duplicate entry
  //               return prev; // Return previous state unchanged
  //             } else {
  //               // Add new entry if not a duplicate
  //               return prev ? [...prev, newEntry] : [newEntry]; // If prev is defined, spread prev and add new entry, otherwise, return new entry as an array
  //             }
  //           });

  //         });

  //     }
  //     setImeiCommandList(commandList?.slice(0,50))
  //     // console.log(commandList,'dcfvgbhnjmk')
  //     // setImeiCommandList(commandList?.slice(0,50))
  //   });
  // };

  let batchSize = 50;
  let currentIndex = imeiCommandList?.length;
  const handleScroll = async (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 20 && hasMore) {
      // const totalPages = Math.ceil(oldImeiCommandList?.length / batchSize);

      if (currentIndex < commandList.length) {
        // Slice data from commandList in reverse order to get batches of 50 items
        const newData =
          commandList &&
          commandList?.slice(currentIndex, currentIndex + batchSize);
        setImeiCommandList((prevData) => [...prevData, ...newData]);
        currentIndex += batchSize;
      } else {
        // No more data to fetch
        setHasMore(false);
      }
    }
  };

  const importImeiCommand = () => {
    const hasEmptyValue = commandList.some(
      (val) => val.imei === null || val.command === null
    );
    console.log(hasEmptyValue, "checkEmptyvaluehhh");

    if (hasEmptyValue) {
      alert("Please check your Excel and fill in all values.");
      return false;
    }

    const data = {
      userId: JSON.parse(localStorage.getItem("data"))?.id,
      list: commandList,
    };
    setIsLoading(true);
    CommandAction.fetchCommand(data).then((response) => {
      try {
        if (response !== null) {
          if (response?.data && response.data !== null) {
            fetchAllCommandList();
            setCommandList(response?.data?.list);
            alert(response?.message);
            setShowBtn(false);
            setIsLoading(false);
            document.getElementById("inputFile").value = "";
            setOpen(false);
          } else {
            alert(response?.message);
            setIsLoading(false);
          }
        } else {
          alert(response?.message);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    });
  };

  return (
    <div>
      <LoadingComponent isLoading={isLoading} />
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid grey",
              padding: "4px 15px",
            }}
          >
            <Typography id="modal-title" variant="h6" component="h3">
              {title}
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon sx={{ color: "red" }} />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "10px",
              padding: "4px 15px",
            }}
          >
            <Grid>
              {/* <Button variant="contained"> */}
              <Tooltip title="Download Template">
                <a
                  className="float-right"
                  href={TemplateExcel}
                  download
                  style={{ color: "#FFF" }}
                >
                  {/* Download Template */}
                  <img src={DownloadTemplate} alt="img" />
                </a>
              </Tooltip>
              {/* </Button> */}
            </Grid>
            <Grid>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Tooltip title="Upload Excel">
                  <img
                    src={UploadExcel}
                    alt="img"
                    style={{ cursor: "pointer" }}
                    onClick={uploadExcelHandler}
                  />{" "}
                </Tooltip>
                <span>{fileName}</span>
              </div>
              <div style={{ display: "none" }}>
                <TextField
                  size="small"
                  type="file"
                  id="inputFile"
                  inputProps={{
                    accept:
                      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
                  }}
                  // accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={onChangeHandler}
                />
              </div>
            </Grid>
          </Box>

          <Grid id="modal-description" sx={{ mt: 2, padding: "0px 15px" }}>
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignContent: "flex-start",
                  alignItems: "flex-start",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <Paper
                  style={{
                    minWidth: "500px",
                    maxWidth: "500px",
                    maxHeight: "400px",
                    overflowY: "auto",
                  }}
                >
                  <TableContainer
                    sx={{ maxHeight: 400 }}
                    onScroll={handleScroll}
                  >
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow
                          sx={{
                            backgroundColor: "rgb(14 57 115 / 86%)",
                            color: "#fff",
                          }}
                        >
                          <TableCell
                            sx={{
                              color: "#fff",
                              backgroundColor: "rgb(48 85 135)",
                            }}
                          >
                            S.No
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#fff",
                              backgroundColor: "rgb(48 85 135)",
                            }}
                          >
                            IMEI Number
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "#fff",
                              backgroundColor: "rgb(48 85 135)",
                            }}
                          >
                            Command
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {imeiCommandList &&
                          isArray(imeiCommandList) &&
                          imeiCommandList?.map((val, ind) => {
                            return (
                              <>
                                <TableRow>
                                  <TableCell>{ind + 1}</TableCell>
                                  <TableCell>
                                    {val?.imei ? val?.imei : "NA"}
                                  </TableCell>
                                  <TableCell>
                                    {val?.command ? val?.command : "NA"}
                                  </TableCell>
                                </TableRow>
                              </>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </div>
            </div>
          </Grid>
          <Box
            sx={{
              mt: 2,
              p: 2,
              display: "flex",
              justifyContent: "flex-end",
              alignContent: "flex-end",
              alignItems: "flex-end",
              gap: "10px",
            }}
          >
            <Button color="error" variant="contained" onClick={handleClose}>
              Close
            </Button>
            {showBtn && (
              <Button
                color="primary"
                variant="contained"
                sx={{ color: "white" }}
                onClick={importImeiCommand}
              >
                Save
              </Button>
            )}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
