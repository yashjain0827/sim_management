import React from "react";
import ReactExport from "react-export-excel";
import excelIcon from "../../img/whiteexcel.png";
import moment from "moment";

import { ThemeProvider, createTheme, Button } from "@mui/material";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const ExportReport = ({ exportData, labelHeader, exportHeading }) => {
  if (!exportHeading) {
    exportHeading = [];
  }

  let names = `${exportHeading[0]}(${moment(new Date()).format(
    "DD-MM-YYYYThh:mm:ss"
  )})`;

  return exportHeading.length > 0 ? (
    <ExcelFile
      filename={names}
      id="exportDataList"
      element={
        <ThemeProvider
          theme={createTheme({
            palette: {
              primary: {
                main: "#0d5257",
              },
            },
          })}
        >
          <Button
            variant="contained"
            //size="small"
            id="exportDataList"
          >
            Export EXCEL
          </Button>
        </ThemeProvider>
      }
    >
      <ExcelSheet data={exportData} name={exportHeading[0]}>
        <ExcelColumn label={exportHeading[0]} value="col1" />
        <ExcelColumn label={exportHeading[1]} value="col2" />
        <ExcelColumn label={exportHeading[2]} value="col3" />
        <ExcelColumn label={exportHeading[3]} value="col4" />
        <ExcelColumn label={exportHeading[4]} value="col5" />
        <ExcelColumn label={exportHeading[5]} value="col6" />
        <ExcelColumn label={exportHeading[6]} value="col7" />
        <ExcelColumn label={exportHeading[7]} value="col8" />
        <ExcelColumn label={exportHeading[8]} value="col9" />
        <ExcelColumn label={exportHeading[9]} value="col10" />
        <ExcelColumn label={exportHeading[10]} value="col11" />
        <ExcelColumn label={exportHeading[11]} value="col12" />
        <ExcelColumn label={exportHeading[12]} value="col13" />
        <ExcelColumn label={exportHeading[13]} value="col14" />
        <ExcelColumn label={exportHeading[14]} value="col15" />
        <ExcelColumn label={exportHeading[15]} value="col16" />
        <ExcelColumn label={exportHeading[16]} value="col17" />
        <ExcelColumn label={exportHeading[17]} value="col18" />
        <ExcelColumn label={exportHeading[18]} value="col19" />
        <ExcelColumn label={exportHeading[19]} value="col20" />
        <ExcelColumn label={exportHeading[20]} value="col21" />
      </ExcelSheet>
    </ExcelFile>
  ) : (
    <ExcelFile
      element={
        <div className="pl-2  cousor_pointer" id="exportDataList">
          <img src={excelIcon} />
        </div>
      }
    >
      <ExcelSheet data={exportData}>
        <ExcelColumn label={labelHeader[0]} value="col1" />
        <ExcelColumn label={labelHeader[1]} value="col2" />
        <ExcelColumn label={labelHeader[2]} value="col3" />
        <ExcelColumn label={labelHeader[3]} value="col4" />
        <ExcelColumn label={labelHeader[4]} value="col5" />
        <ExcelColumn label={labelHeader[5]} value="col6" />
        <ExcelColumn label={labelHeader[6]} value="col7" />
        <ExcelColumn label={labelHeader[7]} value="col8" />
        <ExcelColumn label={labelHeader[8]} value="col9" />
        <ExcelColumn label={labelHeader[9]} value="col10" />
        <ExcelColumn label={labelHeader[10]} value="col11" />
        <ExcelColumn label={labelHeader[11]} value="col12" />
        <ExcelColumn label={labelHeader[12]} value="col13" />
        <ExcelColumn label={labelHeader[13]} value="col14" />
        <ExcelColumn label={labelHeader[14]} value="col15" />
        <ExcelColumn label={labelHeader[15]} value="col16" />
        <ExcelColumn label={labelHeader[16]} value="col17" />
        <ExcelColumn label={labelHeader[17]} value="col18" />
        <ExcelColumn label={labelHeader[18]} value="col19" />
        <ExcelColumn label={labelHeader[19]} value="col20" />
        <ExcelColumn label={labelHeader[20]} value="col21" />
        <ExcelColumn label={labelHeader[21]} value="col22" />
      </ExcelSheet>
    </ExcelFile>
  );
};

export default ExportReport;
