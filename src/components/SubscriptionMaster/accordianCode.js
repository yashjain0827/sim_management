import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Paper,
} from "@mui/material";
export default function ControlledAccordions({
  clientSubscriptionList,
  stateName,
  handleSubscription,
}) {
  const [expanded, setExpanded] = React.useState(false);

  // const obj =
  //   Object?.keys(clientSubscriptionList)?.length > 0 &&
  //   Object?.entries(clientSubscriptionList);
  console.log(Object.entries(clientSubscriptionList), stateName);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      <Accordion expended={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel0bh-content"
          id="panel1bh-header"
        >
          {stateName}
        </AccordionSummary>
        <AccordionDetails>
          {Object.entries(clientSubscriptionList).map(
            ([subscriptionType, value], index) => {
              console.log(subscriptionType, value);
              return (
                <Accordion
                  expanded={expanded === subscriptionType}
                  onChange={handleChange(subscriptionType)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                  >
                    <Typography sx={{ width: "33%", flexShrink: 0 }}>
                      {subscriptionType}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer component={Paper} elevation={1}>
                      <Table
                        size="small"
                        aria-label="a dense table"
                        justifyContent={"center"}
                        alignItems="center"
                      >
                        <TableHead>
                          <TableRow
                            sx={{ backgroundColor: "rgb(14 57 115 / 86%)" }}
                          >
                            <TableCell
                              key={index}
                              sx={{
                                color: "white",
                                textAlign: "center",
                              }}
                            >
                              S.no
                            </TableCell>
                            <TableCell
                              key={index}
                              sx={{
                                color: "white",
                                textAlign: "center",
                              }}
                            >
                              Subscription Period(days)
                            </TableCell>{" "}
                            <TableCell
                              key={index}
                              sx={{
                                color: "white",
                                textAlign: "center",
                              }}
                            >
                              Amount
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {value.map((ele, i) => {
                            return (
                              <TableRow key={i}>
                                <TableCell sx={{ textAlign: "center" }}>
                                  {i + 1}
                                </TableCell>

                                <TableCell sx={{ textAlign: "center" }}>
                                  <input
                                    name="totalDays"
                                    style={{
                                      width: "100px",
                                      height: "30px",
                                      border: ".3px solid grey",
                                      padding: 1,
                                      textAlign: "center",
                                      borderRadius: "4px",
                                    }}
                                    disabled
                                    type="text"
                                    value={
                                      ele?.subscriptionMaster?.totalDays ?? "NA"
                                    }
                                    onChange={(e) =>
                                      handleSubscription(e, subscriptionType, i)
                                    }
                                  />{" "}
                                  days
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  <input
                                    name="amount"
                                    style={{
                                      width: "100px",
                                      height: "30px",
                                      border: ".3px solid grey",
                                      padding: 1,
                                      textAlign: "center",
                                      borderRadius: "4px",
                                    }}
                                    disabled={
                                      subscriptionType ==
                                      "State Platform Charges"
                                    }
                                    type="text"
                                    value={ele?.amount || "NA"}
                                    onChange={(event) =>
                                      handleSubscription(
                                        event,
                                        subscriptionType,
                                        i
                                      )
                                    }
                                  />{" "}
                                  Rs.
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              );
            }
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
