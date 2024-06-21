import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import { blue } from "@mui/material/colors";
import QRCode from "react-qr-code";

function SimpleDialog(props) {
  const { onClose, data, open, showPrint, setShowPrint } = props;
  console.log(data);

  function printHandler() {
    setShowPrint(false);
    setTimeout(() => {
      onClose();
      window.print();
    }, 500);
  }

  const qrValue = (
    <div>
      <p>data.state.name</p>
      <p>data.quantity</p>
    </div>
  );
  return (
    <div style={{}}>
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>{`Update device`}</DialogTitle>
        <div style={{ padding: "5px 15px" }}>{` State:- ${
          data.state && data.state.name ? data.state.name : "NA"
        }`}</div>
        <div style={{ padding: "5px 15px" }}>{`Box Quantity :- ${
          data && data.quantity ? data.quantity : "NA"
        }`}</div>
        {/* <div>{data.state && data.state.name ? data.state.name:"NA"}</div> */}

        <div
          style={{
            padding: "40px",
            width: "500px",
            height: "550px",
            textAlign: "center",
          }}
        >
          <QRCode
            delay={10}
            title="Box Details"
            // value={`http://192.168.30.83:3003${url}`}
            value={`
            Quantity:- ${data.quantity ? data.quantity : "NA"}
            `}
            bgColor={"white"}
            fgColor={"black"}
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            viewBox={`0 0 256 256`}
          />{" "}
        </div>
        {showPrint && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
              padding: "15px 15px",
            }}
          >
            <Button onClick={printHandler} variant="contained">
              print
            </Button>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
          </div>
        )}
      </Dialog>
    </div>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
};

// export default function SimpleDialogDemo() {
//   const [open, setOpen] = React.useState(false);
//   const [selectedValue, setSelectedValue] = React.useState(emails[1]);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = (value) => {
//     setOpen(false);
//     setSelectedValue(value);
//   };

//   return (
//     <div>
//       <SimpleDialog
//         selectedValue={selectedValue}
//         open={open}
//         onClose={handleClose}
//       />
//     </div>
//   );
// }
export default SimpleDialog;
