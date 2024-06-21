import * as React from "react";
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
import ImortImeiCommand from "./ImportCommand";
import { CommandAction } from "../actions/command";
import { useEffect } from "react";
import moment from "moment";
import LoadingComponent from "../CommonComponents/LoadingComponts";
import ExportAllDataModal from "../Dashboard/exportAllDataModal";
import { DeviceAction } from "../actions/device";
import ExportToEmailIcon from "../../img/Export Email.svg";
import "./style.css";
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
  fontWeight: "bold",
  background: "rgb(48 85 135)",
};
const innerTableCellStyle = {
  color: "#fff",
  fontSize: "15px",
  fontWeight: "bold",
  background: "rgb(48 85 135)",
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
    fontWeight: "bold",
    fontSize: "15px",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    // border: 0,
    // fontWeight:"bold",
    // fontSize:"15px"
  },
}));

function Row(props) {
  const {
    row,
    index,
    setOpenRowIndex,
    openRowIndex,
    fetchData,
    allExportModalOpen,
    setAllExportModalOpen,
    selectedRow,
    setSelectedRow,
  } = props;
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [oldImeiCommandList, setoOldImeiCommandList] = useState([]);
  const [imeiCommandList, setImeiCommandList] = useState([]);
  const [page, setPage] = useState(imeiCommandList?.length);

  const isRowOpen = index === openRowIndex;
  let batchSize = 50;
  let currentIndex = imeiCommandList?.length;

  const expandrowOpenHandler = (index, id) => {
    if (isRowOpen) {
      setOpenRowIndex(null); // Close the currently open row
      setoOldImeiCommandList([]);
      setImeiCommandList([]);
      setHasMore(true);
      currentIndex = 0;
    } else {
      setOpenRowIndex(null); // Close the currently open row
      setoOldImeiCommandList([]);
      setImeiCommandList([]);
      setHasMore(true);
      currentIndex = 0;
      setOpenRowIndex(index); // Open the clicked row
      fetchCommandListByid(id);
    }
  };
  console.log(currentIndex, "currentIndexhhhhh");
  const fetchCommandListByid = (id) => {
    const data = {
      pageNo: 0,
      pageSize: 0,
      masterId: id,
    };
    CommandAction.fetchCommandById(data).then((response) => {
      if (response?.data !== null) {
        setoOldImeiCommandList(response?.data);
        setImeiCommandList(response?.data?.slice(0, 50));
      } else {
      }
    });
  };

  const handleScroll = async (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;
    if (
      scrollTop + clientHeight >= scrollHeight - 20 &&
      !isLoading &&
      hasMore
    ) {
      // const totalPages = Math.ceil(oldImeiCommandList?.length / batchSize);

      if (currentIndex < oldImeiCommandList.length) {
        // Slice data from oldImeiCommandList in reverse order to get batches of 50 items
        const newData =
          oldImeiCommandList &&
          oldImeiCommandList?.slice(currentIndex, currentIndex + batchSize);
        setImeiCommandList((prevData) => [...prevData, ...newData]);
        currentIndex += batchSize;
        setPage((prevPage) => prevPage + batchSize); // Increment page for the next batch
      } else {
        // No more data to fetch
        setHasMore(false);
      }
    }
  };

  console.log(oldImeiCommandList, "oldImeiCommandListhhhhh");

  return (
    <React.Fragment>
      <StyledTableRow
        sx={{
          "& > *": {
            borderBottom: "unset",
            background: row?.status === "COMPLETTED" ? "#caf0ca" : "",
          },
        }}
      >
        <StyledTableCell component="th" scope="row">
          {index + 1}
        </StyledTableCell>
        <StyledTableCell>
          {row?.requestCode ? row?.requestCode : "NA"}
        </StyledTableCell>
        <StyledTableCell>
          {row?.createdAt
            ? moment(row?.createdAt).format("DD-MM-YY HH:mm")
            : "NA"}
        </StyledTableCell>
        <StyledTableCell>
          {row?.user?.name ?? "NA"}
        </StyledTableCell>
        <StyledTableCell>
          {row?.totalCount ? row?.totalCount : "NA"}
        </StyledTableCell>
        <StyledTableCell>{row?.status ? row?.status : "NA"}</StyledTableCell>
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => expandrowOpenHandler(index, row?.id)}
          >
            {isRowOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell>
          {/* <Button
            onClick={() => {
              setSelectedRow(row);
              setAllExportModalOpen(true);
            }}
          >
            Export to Email
          </Button> */}

          <IconButton
            aria-label="delete"
            onClick={() => {
              setSelectedRow(row);
              setAllExportModalOpen(true);
            }}
          >
            <img src={ExportToEmailIcon} width={"30px"} heigth={"20px"}></img>
          
          </IconButton>
        </StyledTableCell>
      </StyledTableRow>
      <StyledTableRow>
        <StyledTableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
        >
          <Collapse in={isRowOpen} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {/* <Typography variant="h6" gutterBottom component="div">
                History
              </Typography> */}
              <div
                style={{ maxHeight: "400px", overflowY: "auto" }}
                onScroll={handleScroll}
              >
                <Paper>
                  <Table size="small" stickyHeader aria-label="sticky table">
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell sx={innerTableCellStyle}>
                          S.No
                        </StyledTableCell>
                        <StyledTableCell sx={innerTableCellStyle}>
                          Imei Number
                        </StyledTableCell>
                        <StyledTableCell sx={innerTableCellStyle}>
                          Command
                        </StyledTableCell>
                        <StyledTableCell sx={innerTableCellStyle}>
                          Response
                        </StyledTableCell>
                        <StyledTableCell sx={innerTableCellStyle}>
                          TimeStamp
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {imeiCommandList &&
                        imeiCommandList?.map((historyRow, ind) => (
                          <TableRow key={historyRow.date}>
                            <TableCell component="th" scope="row">
                              {ind + 1}
                            </TableCell>
                            <TableCell>
                              {historyRow?.imei ? historyRow?.imei : "NA"}
                            </TableCell>
                            <TableCell>
                              {historyRow?.command ? historyRow?.command : "NA"}
                            </TableCell>
                            <TableCell>
                              {historyRow?.lastShootResponse
                                ? historyRow?.lastShootResponse
                                : "NA"}
                            </TableCell>
                            <TableCell>
                              {historyRow?.lastShootTime
                                ? moment(historyRow?.lastShootTime).format(
                                    "YYYY-MM-DD HH:mm"
                                  )
                                : "NA"}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Paper>
              </div>
            </Box>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </React.Fragment>
  );
}

function ImeiRequestsList() {
  const [openRowIndex, setOpenRowIndex] = React.useState(null);
  const [commandModalOpen, setCommandModalOpen] = useState(false);
  const [allCommandList, setAllCommandList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [IdBool, setIdBool] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [allExportModalOpen, setAllExportModalOpen] = useState("");
  const [exportEmail, setExportEmail] = useState("");
  const [selectedRow, setSelectedRow] = useState();
  const openModalHandler = () => {
    setCommandModalOpen(true);
  };

  const printHandler = () => {
    window.print();
  };

  const fetchAllCommandList = () => {
    const data = {
      pageNo: pageNo,
      pageSize: pageSize,
    };
    CommandAction.fetchAllcommandList(data).then((response) => {
      try {
        if (response.data !== null) {
          setAllCommandList(response?.data?.data);
          setTotalCount(response?.data?.totalElements);
        } else {
        }
      } catch (error) {}
    });
  };
  const handleChangePage = (event, newPage) => {
    //console.log(newPage);
    setPageNo(newPage);
    setIdBool(true);
  };

  const handleChangeRowsPerPage = (event) => {
    //console.log(event.target.value)
    setPageSize(parseInt(event.target.value));
    setPageNo(0);
    setIdBool(true);
  };

  useEffect(() => {
    fetchAllCommandList();
  }, []);

  useEffect(() => {
    if (IdBool) {
      fetchAllCommandList();
    }
    setIdBool(false);
  }, [IdBool]);

  async function fetchData(email) {
    const isValidEmail=email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    if (
      !isValidEmail
    ) {
      alert("Please Enter Valid Email address!");
      return;
    }
    let data = {
      id: selectedRow.id,
      notifyEmailId: email,
    };

    const response = await  DeviceAction.exportAllDevicConfigDataToEmail(data);
    if(response){
      console.log(response);
      alert(response.message);
    }
 
  }
  return (
    <div className="main_container">
      <LoadingComponent isLoading={isLoading} />
      <ExportAllDataModal
        open={allExportModalOpen}
        setAllExportModalOpen={setAllExportModalOpen}
        fetchData={(email) => fetchData(email)}
      />
      <Box className="main">
        <Grid item xs={12} container alignItems="center"></Grid>
        <ThemeProvider theme={theme}>
          <Grid
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
              marginBottom: "15px",
              padding: "10px",
            }}
          >
            <Grid>
              <Typography variant="h5">Command Configurator List</Typography>
            </Grid>

            <Grid>
              <Button
                sx={{ color: "#fff" }}
                variant="contained"
                onClick={openModalHandler}
              >
                Import Excel
              </Button>
            </Grid>
          </Grid>
          <Grid>
            <TableContainer
              component={Paper}
              sx={{ maxHeight: "75vh", overflow: "auto" }}
            >
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={tableCellStyle}>S.No</TableCell>
                    <TableCell sx={tableCellStyle}>Request ID</TableCell>
                    <TableCell sx={tableCellStyle}>Created Time</TableCell>
                    <TableCell sx={tableCellStyle}>Created By</TableCell>


                    <TableCell sx={tableCellStyle}>Total Count</TableCell>
                    <TableCell sx={tableCellStyle}>Status</TableCell>
                    <TableCell sx={tableCellStyle}>Action</TableCell>
                    <TableCell sx={tableCellStyle}>Export Data</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allCommandList &&
                    allCommandList?.map((row, ind) => (
                      <Row
                        key={row.id}
                        row={row}
                        index={ind}
                        openRowIndex={openRowIndex}
                        setOpenRowIndex={setOpenRowIndex}
                        fetchData={fetchData}
                        allExportModalOpen={allExportModalOpen}
                        setAllExportModalOpen={setAllExportModalOpen}
                        selectedRow={selectedRow}
                        setSelectedRow={setSelectedRow}
                      />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              rowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
              count={totalCount ? totalCount : 0}
              rowsPerPage={pageSize}
              page={pageNo}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>

          {commandModalOpen && (
            <ImortImeiCommand
              title="Import Command Configurator"
              open={commandModalOpen}
              setOpen={setCommandModalOpen}
              fetchAllCommandList={fetchAllCommandList}
            />
          )}
        </ThemeProvider>
      </Box>
    </div>
  );
}

export default ImeiRequestsList;
