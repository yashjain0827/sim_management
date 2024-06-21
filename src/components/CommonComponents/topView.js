import React from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  Autocomplete,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import addIcon from "../../img/Add.svg";
// import editIcon from "../../img/Edit.svg";
import cancelIcon from "../../img/Cancel.svg";
import importExcelIcon from "../../img/Export Excel.svg";
import exportPdfIcon from "../../img/Import PDF.svg";
import exportExcelIcon from "../../img/Import Excel.svg";
import importExcel from "../../img/Iconstoc-Ms-Office-2013-Excel.512.png";

import { useNavigate } from "react-router-dom";
// import { CustomSearchField } from "./SearchField";
import SearchIcon from "@mui/icons-material/Search";
import { CustomButtonSecondery } from "./CustomButton";
import { styled } from "@mui/material/styles";

// import { CustomAutoComplete } from "./reusableComponents";
export const CustomAutoComplete = styled(Autocomplete)(
  ({ theme, ...props }) => ({
    width: "100%",
    "& input": {
      background: props.background ? props.background : "#fff",
      borderRadius: "5px",
      padding: "11px 15px !important",
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

const TopView = (props) => {
  const {
    pageTitle,
    addText,
    hideAddButton,
    addClick,
    addCommand,
    addCommandHandler,
    editText,
    hideEditButton,
    editClick,
    cancelText,
    hideCancelButton,
    cancelClick,
    updateText,
    hideUpdateButton,
    updateClick,
    hidePdfExport,
    hideExcelExport,
    onExcelDownload,
    onPdfDownload,
    hideExcelImport,
    filterHandler,
    filter,
    searchField,
    searchFieldHandler,
    searchInput,
    excelImportClick,
    filteredValue,
  } = props.topViewData;
  // console.log(
  //   searchFieldHandler,
  //   searchInput,
  //   searchField,
  //   "searchFieldHandler"
  // );
  const navigate = useNavigate();
  // const filterCloseHandle = () => {
  //   setFilterhide(false);
  // };
  const routePath = (path) => {
    navigate(path);
  };

  return (
    <Grid
      container
      // alignItems={"center"}
      sx={{
        position: "sticky",
        top: "64px",
        // top: "-12px",
        width: "100%",
        background: "white",
        zIndex: "99",
        height: "43px",
        margin: "2px 0px",
      }}
    >
      <Grid
        item
        xs={filteredValue ? 1 : 2}
        md={filteredValue ? 1 : 4}
        textAlign="left"
      >
        <Typography
          sx={{
            fontSize: "1.4rem",
            fontWeight: 500,
          }}
        >
          {pageTitle}
        </Typography>
      </Grid>
      <Grid
        item
        xs={filteredValue ? 10 : 11}
        md={filteredValue ? 11 : 8}
        columnSpacing={1}
        container
        justifyContent={"flex-end"}
        alignItems={"center"}
      >
        {filteredValue &&
          Array.isArray(filteredValue) &&
          filteredValue.length > 0 &&
          filteredValue.map((ele, index) => (
            <Grid item sx={{ margin: "0px 2px" }}>
              {ele.typeId === 1 ? (
                <TextField
                  id="outlined-basic"
                  label={ele.label}
                  variant="outlined"
                  value={ele.value || "NA"}
                  size={ele.size}
                  sx={{ width: "160px" }}
                  xl={{ width: "100px" }}
                  md={{ width: "120px" }}
                  disabled={ele.isDisabled}
                />
              ) : ele.typeId === 2 ? (
                <div>
                  <CustomAutoComplete
                    disablePortal
                    id="combo-box-demo"
                    options={ele.option}
                    value={ele.value || {}}
                    fullWidth
                    getOptionLabel={({ name }) => (name ? name : "")}
                    onChange={(event, newValue) => {
                      ele.function(event, newValue);
                    }}
                    sx={{ width: "220px" }}
                    xl={{ width: "180px" }}
                    md={{ width: "120px" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        InputLabelProps={{ shrink: true }}
                        label={ele.label}
                      />
                    )}
                  />
                </div>
              ) : ele.typeId === 3 ? (
                <CustomAutoComplete
                  disablePortal
                  id="combo-box-demo"
                  options={ele.option}
                  value={ele.value}
                  fullWidth
                  itemType="array"
                  getOptionLabel={(option) => (option ? option : "")}
                  onChange={(event, newValue) => {
                    ele.function(event, newValue);
                  }}
                  sx={{ width: "220px" }}
                  xl={{ width: "180px" }}
                  md={{ width: "120px" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputLabelProps={{ shrink: true }}
                      label={ele.label}
                    />
                  )}
                />
              ) : (
                <></>
              )}
            </Grid>
          ))}
        {!searchField && (
          <Grid item>
            <div className="search_field">
              <TextField
                type="search"
                placeholder="Search"
                ref={(input) => input && input.focus()}
                // value={searchInput}
                onChange={searchFieldHandler}
                width={"80%"}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </Grid>
        )}
        {!hideExcelExport && (
          <Grid item>
            <div onClick={() => onExcelDownload("excel")}>
              <img src={exportExcelIcon} alt="export excel button"></img>
            </div>
          </Grid>
        )}{" "}
        {!hidePdfExport && (
          <Grid item>
            <div onClick={() => onPdfDownload("pdf")}>
              <img src={exportPdfIcon} alt="export pdf button"></img>
            </div>
          </Grid>
        )}{" "}
        {!hideExcelImport && (
          <Grid item>
            <Tooltip title="Import Excel">
              <div onClick={() => excelImportClick(addClick)}>
                {/* <Button variant="contained" style={{color:"#fff"}}>Import Excel</Button> */}
                <img src={importExcelIcon} alt="" />
              </div>
            </Tooltip>
          </Grid>
        )}
        {!hideAddButton && (
          <Grid item>
            <div onClick={() => routePath(addClick)}>
              <img src={addIcon} alt="add button"></img>
            </div>
          </Grid>
        )}
        {/* {!addCommand && (
          <Grid item>
            <div onClick={() => addCommandHandler()}>
              <img src={addIcon} alt="add button"></img>
            </div>
          </Grid>
        )} */}
        {!hideEditButton && (
          <Grid item>
            <div onClick={() => editClick()}>
              <img src={""} alt="edit button"></img>
            </div>
          </Grid>
        )}
        {!hideUpdateButton && (
          <Grid item>
            <div onClick={updateClick}>
              <CustomButtonSecondery variant="contained">
                Save
              </CustomButtonSecondery>
              <Button>Save</Button>
            </div>
          </Grid>
        )}
        {!hideCancelButton && (
          <Grid item>
            <div onClick={() => routePath(cancelClick)}>
              <img src={cancelIcon} alt="cancel button"></img>
            </div>
          </Grid>
        )}
        {!filter && (
          <Grid item>
            <div className="filter_icon" onClick={filterHandler}>
              <TuneIcon />
            </div>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default TopView;
