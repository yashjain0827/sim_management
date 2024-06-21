import { styled } from "@mui/material/styles";
import Button from "@mui/material/Typography";

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
export const CustomButtonSecondery = styled(Button)(({ children, ...props }) => {
  return {
    fontSize: "1rem",
    backgroundColor:"#fff",
    borderRadius: "4px",
    padding: "6px 20px",
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


export const CustomTextButton = styled(Button)(
  ({ children, ...props }) => {
    return {
      fontSize: "1rem",
      backgroundColor: "#fff",
      borderRadius: "4px",
      fontWeight: "500",
      padding: "6px 10px",
      color: props.colors ? props.colors : "#4C79B0",
      height: "90%",
      display: props.hide ? "none" : "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "0rem",
      cursor: "pointer",
      border: 0,
    };
  }
);

