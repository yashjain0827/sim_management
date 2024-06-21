import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import { Grid,Paper } from "@mui/material";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Check from "@mui/icons-material/Check";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import TestedIconComponent from "./testedIconComponent";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#784af4",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#784af4",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;
  // console.log(props);

  // const icons = {
  //   1: <TestedIconComponent active={active} completed={completed} />,
  //   2: <TestedIconComponent active={active} completed={completed} />,
  //   3: <TestedIconComponent active={active} completed={completed} />,
  // };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      <TestedIconComponent active={active} completed={completed} />
      {/* {icons[String(props.icon)]} */}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

// const steps = [
//   "Select campaign settings",
//   "Create an ad group",
//   "Create an ad",
// ];

export default function CustomizedSteppers({ steps }) {
  
  console.log(steps);
  const s = steps.map((ele) => ele.command);
  // console.log(s)
  return (
    <Stack sx={{  }}>
      {/* <Stepper alternativeLabel activeStep={0} connector={<QontoConnector />}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper> */}
      <Stepper
      sx={{display:"flex",flexWrap:"wrap"}}
        alternativeLabel
        // activeStep={0}
        connector={<ColorlibConnector />}
      >
        {s.map((ele, index) => (
       
          <Step key={ele}>
            <div>
            <StepLabel
              StepIconComponent={(props) => {
                return (
                  <ColorlibStepIcon
                    {...props}
                    active={steps[index].isActive}
                    completed={steps[index].isCompleted}
                  />
                );
              }}
            >
              {/* {ele && ele.slice(0, 20)} */}
              <Paper elevation={1} sx={{padding:"2px"}}>
                <Grid container justifyContent={"center"}>
                  <Grid item xs={12} textAlign={"center"}>{ele && ele.slice(0, 20)}</Grid>
                  <Grid item sx={{padding:1}}>
                    {steps &&
                      steps.length > 0 &&
                      steps[index].hasOwnProperty("resultObj") && steps[index].resultObj!=null && 
                      Object.entries(steps[index].resultObj).map(
                        ([key, value]) => {
                          return (
                            <Grid item container justifyContent={"flex-start"}spacing={1} flexWrap={"nowrap"} >
                              <Grid item sx={{color:"rgb(14 57 115)",fontWeight:600}}>
                                {key}:
                              </Grid>
                              <Grid item  sx={{ color: "rgb(15 15 15)",fontWeight:400 }}>
                                {value}
                              </Grid>
                            </Grid>
                          );
                        }
                      )}
                  </Grid>
                </Grid>
              </Paper>
            </StepLabel>
            </div>
          </Step>
         
        ))}
      </Stepper>
    </Stack>
  );
}

// {steps && steps.length>0 && steps[index].hasOwnProperty("resultObj") && Object.enteries(steps[index].resultObj).map(
//   ([key, value]) => {
//     return (
//       <Grid item container>
//         <Grid item xs={4}>
//           {key}:
//         </Grid>
//         <Grid item xs={4}>{value}</Grid>
//       </Grid>
//     );
//   }
// )}
