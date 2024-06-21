import React from "react";
import { Table, Typography, Divider, Dialog, DialogContent, DialogTitle, TableContainer, TableHead, TableRow, TableCell, TableBody, IconButton } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import moment from "moment";
import { Editedtext } from ".";



const TrialModal = ({ open, closeTrailBox, trailData }) => {

    return (
        <Dialog
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="lg"
            style={{ margin: "auto" }}
        >
            <DialogTitle id="alert-dialog-title" style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Configuration Trail</Typography>

                <IconButton onClick={() => closeTrailBox()}>
                    <ClearIcon sx={{ cursor: "pointer" }} />
                </IconButton>

            </DialogTitle>
            <Divider />
            <DialogContent>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow style={{ background: "#1d608b", color: "white" }}>
                                <TableCell >
                                    <Typography color="white" variant="body1" >S.No</Typography>
                                </TableCell>
                                <TableCell style={{minWidth:200}}>
                                    <Typography color="white" variant="body1" >Operation Type</Typography>
                                </TableCell>
                                <TableCell style={{minWidth:200}}>

                                    <Typography color="white" variant="body1" >Modified At</Typography>

                                </TableCell>
                                <TableCell style={{minWidth:200}}>
                                    <Typography color="white" variant="body1" >Modified By</Typography>
                                </TableCell>

                                <TableCell>
                                    <Typography color="white" variant="body1" >After Update</Typography>
                                </TableCell>

                                <TableCell>
                                    <Typography color="white" variant="body1" >Before Update</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                trailData && trailData.map((val, index) =>
                                    <>
                                        <TableRow>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell
                                                style={{
                                                    color: val?.operationType === "CREATED" ? "#0707ed" :
                                                        val?.operationType === "UPDATED" ? "green" :
                                                            val?.operationType === "DELETED" ? "#ff0000" :
                                                                ""
                                                }}
                                            >{val?.operationType}</TableCell>
                                            <TableCell>{val?.modifiedAt ? moment(val?.modifiedAt).format("MMMM Do YYYY") : "-"}</TableCell>
                                            <TableCell>{val?.user || "NA"}</TableCell>
                                           <TableCell>
                                           <Editedtext text={val?.updatedCommand} num={20} />
                                           </TableCell>
                                          <TableCell>
                                          <Editedtext text={val?.lastCommand} num={20} />
                                          </TableCell>
                                      
                                        </TableRow>
                                        <div style={{ height: "5px" }}>

                                        </div>
                                    </>
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
        </Dialog >
    )
}

export default TrialModal