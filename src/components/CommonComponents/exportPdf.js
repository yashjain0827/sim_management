import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { ThemeProvider, createTheme, Button } from "@mui/material";

class ExportPdf extends React.Component {
  constructor() {
    super();
  }
  //console.log(this.props.labelHeader)
  exportPDF = () => {
    //;

    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape

    const marginLeft = 40;
    // const doc = new jsPDF(orientation, unit, size);
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    console.log(this.props.labelHeader);
    console.log(this.props.exportData);

    const title = this.props.title;
    let headers = [];
    if (this.props.type == "report") {
      let header = [];
      this.props.labelHeader.forEach((element) => {
        // console.log(element.name)
        header.push(element.name);
      });

      headers.push(header);

      // headers=this.props.labelHeader.map((val)=>val.name)
    } else {
      headers = [this.props.labelHeader];
    }
    //  console.log(headers)
    let data = [];
    if (this.props.type == "report") {
      this.props.exportData.forEach((el, index) => {
        let dataKey = [];
        this.props.labelHeader.forEach((element) => {
          // console.log(el[element.keyName])
          dataKey.push(el[element.keyName]);
        });
        // console.log(element)
        // console.log(Object.values(this.props.exportData[index]))
        data.push(dataKey);
      });
      // data=this.props.labelHeader.map((val)=>[this.props.exportData[val.keyName]])
    } else {
      data = this.props.exportData.map((elt, index) => [
        elt.col1,
        elt.col2,
        elt.col3,
        elt.col4,
        elt.col5,
        elt.col6,
        elt.col7,
        elt.col8,
        elt.col9,
        elt.col10,
        elt.col11,
        elt.col12,
        elt.col13,
        elt.col14,
        elt.col15,
        elt.col16,
        elt.col17,
        elt.col18,
        elt.col19,
        elt.col20,
        elt.col21,
      ]);
    }

    // console.log(data)

    let content = {
      startY: 30,
      head: headers,
      body: data,
      styles: {
        fontSize: 8,
        cellPadding: 5, // Adjust padding as needed
        overflow: "linebreak", // Allow text to overflow into next line
        // columnWidth: "wrap", // Wrap text when column size grows greater than specified width
      },
      columnStyles: {
        // Specify column styles for each column
        // For example, if you want the first column to wrap at 300px width:
        0: { columnWidth: "auto" }, // Adjust the column index and width as needed
        4: { columnWidth: "auto", cellPadding: "5px" },
        // Similarly, you can specify styles for other columns
      },
    };
    doc.text(title, 40, 20);
    doc.setFontSize(8);

    doc.autoTable(content);
    doc.save(
      `${this.props.reportName}(${moment(new Date()).format(
        "DD-MM-YYYYThh:mm:ss"
      )}).pdf`
    );
  };

  render() {
    return (
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
          id={"exportPdfButton"}
          //size="small"
          onClick={() => this.exportPDF()}
        >
          Export PDF
        </Button>
      </ThemeProvider>
      //   <div>
      //     <div id='exportPdfButton' onClick={() => }><PictureAsPdfIcon/></div>
      //   </div>
    );
  }
}

export default ExportPdf;
// export default class exportPdf extends React.Component {}
