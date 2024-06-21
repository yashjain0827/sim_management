import { styled } from "@mui/material/styles";
import { Accordion,TextField,Autocomplete,Button } from "@mui/material";


export const CustomButtonSecondery = styled(Button)(({ children, ...props }) => {
    return {
      fontSize: "1rem",
      backgroundColor:"#fff",
      borderRadius: "4px",
      padding: "6px 15px",
      color: props.colors ? props.colors : "#4C79B0",
      height: "90%",
      display: props.hide?"none":"inline-flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "0rem",
      cursor: "pointer",
      border: `1px solid ${props.colors ? props.colors : "#4C79B0"} `,
    };
  });
export const CustomAccordion = styled(Accordion)(({ theme, ...props }) => ({
    
 
  boxShadow: "none",
  margin: "7px 0",
  "::before": {
    backgroundColor: "transparent",
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
    color: "#fff",
  },
  "& .MuiAccordionDetails-root": {
    padding: "15px",
  },
}));

export const CustomInputField = styled(TextField)(({ theme, ...props }) => ({
    "& input": {
      background: props.background ? props.background : "#EFF0F2",
      borderRadius: "5px",
      padding: "10px 15px",
      borderLeft: props.required ? "2px solid #EF3434" : "0",
      marginBottom: "0px",
      color: "rgb(0 0 0 / 60%)",
      fontSize: "13px",
    },
    "& .MuiFormLabel-asterisk": {
      display: "none",
    },
    "& fieldset": {
      border: "0",
    },
    "& label": {
      lineHeight: "initial",
      fontSize: "13px",
    },
    "& .MuiInputLabel-shrink": {
      transform: " translate(14px, -7px) scale(0.8) !important",
    },
    "& .MuiInputLabel-root": {
      transform: "translate(14px, 9px) scale(1)",
    },
  }));


  export const CustomAutoComplete = styled(Autocomplete)(
    ({ theme, ...props }) => ({
      width: "100%",
      "& input": {
        background: props.background ? props.background : "#EFF0F2",
        borderRadius: "5px",
        padding: "010px 15px !important",
        borderLeft: props.required ? "2px solid #EF3434" : "0",
        fontSize: "13px",
      },
      "& .MuiOutlinedInput-root": {
        background: props.background ? props.background : "#EFF0F2",
        borderRadius: "5px",
        marginBottom: "0px",
      },
      "& .MuiTextField-root": {
        margin: 0,
      },
      "& fieldset": {
        border: "0",
      },
      "& label": {
        lineHeight: "initial",
        fontSize: "13px",
      },
      "& .MuiInputLabel-shrink": {
        // background: "#ffffff",
        transform: " translate(14px, -7px) scale(0.8) !important",
      },
      "& .MuiInputLabel-root": {
        transform: "translate(14px, 9px) scale(1)",
      },
      " & .MuiOutlinedInput-root": {
        padding: "0",
      },
    })
  );

  export const CustomButtonPrimary = styled(Button)(({children, ...props})=>{
    return {
      fontSize: "1rem",
      backgroundColor: props.colors ? props.colors : "#4C79B0",
      borderRadius: "4px",
      padding: "6px 20px",
      color: "#fff",    
      height: "90%",
      display: props.hide ?"none":"inline-flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "0rem",
      cursor: "pointer",
      border: `1px solid ${props.colors ? props.colors : "#4C79B0"}`,
    };
  });