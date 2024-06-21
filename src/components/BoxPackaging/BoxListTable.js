import React from "react";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import {
  Table,
  TableContainer,
  TableRow,
  styled,
  TableHead,
  TableBody,
  boxList,
  Button,
} from "@mui/material";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
// import "../Table.css";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgb(14 57 115 / 86%)",
    color: theme.palette.common.white,
    padding: "10px",
  },
  // [`& tableCellClasses.head:nth-child(2) th`]:{
  //   color:"red",
  //   backgroundColor:"blue"
  //   },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "10px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: "1 solid black",
  },
}));

const BoxListTable = (props) => {
  const {
    isLoading,
    tableData,
    tableHeader,
    tableBody,
    currentRowDataHandle,
    tableRef,
    boxList,
    generateQrHandler,
  } = props;
  const navigate = useNavigate();
  return (
    <div>
      <TableContainer sx={{ borderRadius: "10px" }}>
        <Table stickyHeader aria-label="sticky table" ref={tableRef}>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>S.No</StyledTableCell>
              <StyledTableCell sx={{ whiteSpace: "nowrap" }}>
                Box Number
              </StyledTableCell>
              <StyledTableCell sx={{ whiteSpace: "nowrap" }}>
                Created at
              </StyledTableCell>
              <StyledTableCell sx={{ whiteSpace: "nowrap" }}>
                Created By
              </StyledTableCell>

              <StyledTableCell sx={{ whiteSpace: "nowrap" }}>
                Box Quantity
              </StyledTableCell>

              {/* <StyledTableCell sx={{ whiteSpace: "nowrap" }}>
                Issued Quantity
              </StyledTableCell> */}

              <StyledTableCell sx={{ whiteSpace: "nowrap" }}>
                State
              </StyledTableCell>
              <StyledTableCell sx={{ whiteSpace: "nowrap" }}>
                Status
              </StyledTableCell>
              <StyledTableCell sx={{ whiteSpace: "nowrap" }}>
                Dispatch No.
              </StyledTableCell>
              <StyledTableCell sx={{ whiteSpace: "nowrap" }}>
                Details
              </StyledTableCell>
              {/* <StyledTableCell sx={{ whiteSpace: "nowrap" }}>
                Action
              </StyledTableCell> */}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {boxList &&
              boxList.map((val, ind) => {
                return (
                  <>
                    <StyledTableRow>
                      <StyledTableCell>{ind + 1}</StyledTableCell>

                      <StyledTableCell
                        onClick={() => navigate(`/createBox/${val.id}`)}
                        style={{ color: "#1976d2", cursor: "pointer" }}
                      >
                        {val ? val.boxNo : "NA"}
                      </StyledTableCell>
                      <StyledTableCell>
                        {val
                          ? moment(val.createdAt).format("DD-MM-YYYY hh:mm a")
                          : "NA"}
                      </StyledTableCell>
                      <StyledTableCell>
                        {val && val.createdBy && val.createdBy.name
                          ? val.createdBy.name
                          : "NA"}
                      </StyledTableCell>
                      <StyledTableCell>
                        {/* {val && val.quantity !== null ? val.quantity : "NA"} */}
                        {`${
                          val && val.currentQuantity && val.currentQuantity
                            ? val.currentQuantity
                            : 0
                        }/${
                          val && val.quantity && val.quantity
                            ? val.quantity
                            : "NA"
                        }`}
                      </StyledTableCell>
                      {/* <StyledTableCell>
                        {val && val.currentQuantity !== null
                          ? val.currentQuantity
                          : "NA"}
                      </StyledTableCell> */}
                      <StyledTableCell>
                        {val.state && val.state.name !== null
                          ? val.state.name
                          : "NA"}
                      </StyledTableCell>
                      <StyledTableCell>
                        {val && val.status ? val.status : "NA"}
                      </StyledTableCell>
                      <StyledTableCell>
                        {val && val.dispatchNo ? val.dispatchNo : "NA"}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Button onClick={() => generateQrHandler(val)}>
                          view
                        </Button>
                      </StyledTableCell>
                      {/* <StyledTableCell>
                        <Button onClick={()=>unBoxDevicesFromBox(val.id)}>UnBox</Button>
                        <Button onClick={() =>checkExitCoomand(val)}>Reconfiguration</Button>
                      </StyledTableCell> */}
                    </StyledTableRow>
                  </>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BoxListTable;
