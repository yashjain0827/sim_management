import React from "react";
import { Autocomplete, Box, TextField } from "@mui/material";
// import {TextField} from "@material-ui";
// import Autocomplete from "@material-ui/lab/Autocomplete";
import { List } from "react-virtualized";
import { styled } from "@mui/material/styles";

// import { StyledAutocomplete } from "../CommonComponents/CustomCompontes";
export const CustomAutoComplete = styled(Autocomplete)(
  ({ theme, ...props }) => ({
    width: "100%",
    "& input": {
      background: props.background ? props.background : "#fff",
      borderRadius: "5px",
      padding: "5px 15px !important",
      borderLeft: props.required ? "2px solid #EF3434" : "0",
      fontSize: "13px",
    },

    "& .MuiOutlinedInput-root": {
      background: props.background ? props.background : "#fff",
      borderRadius: "5px",
      marginBottom: "0px",
    },
    "& .MuiTextField-root": {
      margin: 0,
    },
    "& fieldset": {
      border: ".5",
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
const ListboxComponent = React.forwardRef(function ListboxComponent(
  props,
  ref
) {
  const { children, role, ...other } = props;
  const itemCount = Array.isArray(children) ? children.length : 0;
  const itemSize = 36;

  return (
    <div ref={ref}>
      <div {...other}>
        <List
          height={250}
          width={280}
          rowHeight={itemSize}
          overscanCount={5}
          rowCount={itemCount}
          rowRenderer={(props) => {
            return React.cloneElement(children[props.index], {
              style: props.style,
            });
          }}
          role={role}
        />
      </div>
    </div>
  );
});

export default function AutocompleteVirtualize({
  options,
  handleChange,
  placeholder,
  size,
  disabled,
  value,
  setSelectedDevice,
}) {
  return (
    <CustomAutoComplete
      size={size}
      id="virtualized"
      //   disabled={disabled}
      fullWidth
      value={value}
      disableListWrap
      ListboxComponent={ListboxComponent}
      onChange={(event, newValue) => {
        // setSelectedDevice(newValue);
        handleChange(event, newValue);
      }}
      options={options}
      getOptionLabel={(option) => option || ""}
      renderOption={(props, option) => {
        return (
          <Box {...props} key={option}>
            {`${option}`}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder={placeholder}
          fullWidth
        />
      )}
    />
  );
}
