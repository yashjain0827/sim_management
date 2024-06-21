// import React, { useState } from "react";
// import LoadingComponent from "../CommonComponents/LoadingComponts";
// import { Box, Button, ThemeProvider, createTheme } from "@mui/material";
// import ImportExcel from "./ImportExcel";
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "rgb(14 57 115 / 86%)",
//     },
//   },
// });
// export default function SimManagement() {
//   const [loading, setLoading] = useState(false);
//   const [openModal, setOpenModal] = useState(false);

//   const ExcelImportModal = () => {
//     setOpenModal(true);
//   };

//   const closeExcelImportModal = () => {
//     setOpenModal(false);
//   };

//   // const showData = async (type, exportType, email) => {
//   //   setLoading(true);
//   //   let payload = {
//   //     userId: JSON.parse(userId),
//   //     // token: JSON.parse(Token),
//   //     pageNo: type ? pageNo : 0,
//   //     pageSize: type ? pageSize : 0,
//   //     fromDate: !showOldFromDate ? Date.parse(fromDate) : 6268266000,
//   //     toDate: Date.parse(toDate),
//   //     stateId: state ? state.id : null,
//   //     search: search ? search : "",
//   //     statusMaster:
//   //       tabStatus == "onlineDevice" || tabStatus == null ? null : tabStatus,
//   //     showTabData: tabStatus ? false : true,
//   //     softwareVersion: softwareVersionId,
//   //     isConfigActive: activeId ? activeId.id : null,
//   //     isConfigDone: configurationId ? configurationId.id : null,
//   //     isConfigSent: sentConfigId ? sentConfigId.id : null,
//   //     clientIds: clientId ? [clientId] : null,
//   //     onlineDevice: onlineDevice ? onlineDevice : false,
//   //     lastOnline: lastOnline ? lastOnline.value : null,
//   //     simOperator: SIM ? SIM : null,
//   //     softwareVersionList: newSoftwareVersionList
//   //       ? newSoftwareVersionList
//   //       : null,
//   //   };

//   //   const res = await DashboardAction.getAllDashboardData(payload);

//   //   if (res) {
//   //     setAlldeviceList(res.data);
//   //     if (type) {
//   //       setData(res.data);
//   //       setTotalCount(res);
//   //       setLoading(false);
//   //     } else {
//   //       if (exportType == "excel") {
//   //         // setExportDataExcel(res.data);
//   //         exportDataList(res.data, exportType);
//   //         setLoading(false);

//   //         setTimeout(() => {
//   //           document.getElementById("exportDataList").click();
//   //           setLoading(false);
//   //         }, 500);
//   //       } else if (exportType == "pdf") {
//   //         // setExportDataPdf(res.data);
//   //         exportDataList(res.data);

//   //         setTimeout(() => {
//   //           document.getElementById("exportPdfButton").click();
//   //           setLoading(false);
//   //         }, 500);
//   //       }
//   //       setLoading(false);
//   //     }

//   //     if (exportType == "excel") {
//   //       // setExportDataExcel(res.data);
//   //       exportDataList(res.data, exportType);
//   //       setLoading(false);

//   //       setTimeout(() => {
//   //         document.getElementById("exportDataList").click();
//   //         setLoading(false);
//   //       }, 500);
//   //     } else if (exportType == "pdf") {
//   //       // setExportDataPdf(res.data);
//   //       exportDataList(res.data);

//   //       setTimeout(() => {
//   //         document.getElementById("exportPdfButton").click();
//   //         setLoading(false);
//   //       }, 500);
//   //     }
//   //   } else {
//   //     if (!exportType) {
//   //       setData([]);
//   //       setTotalCount(0);
//   //     }
//   //   }
//   // };

//   return (
//     <div className="main_container">
//       <LoadingComponent isLoading={loading} />
//       <Box className="main">
//         <ThemeProvider theme={theme}>
//           <Button>import excel</Button>
//           <ImportExcel
//             openModal={openModal}
//             setOpenModal={setOpenModal}
//             // showData={showData}
//             closeExcelImportModal={closeExcelImportModal}
//           />
//         </ThemeProvider>
//       </Box>
//     </div>
//   );
// }

import React, { useState } from "react";
import LoadingComponent from "../CommonComponents/LoadingComponts";
import { Box, Button, ThemeProvider, createTheme } from "@mui/material";
import ImportExcel from "./ImportExcel";

const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(14 57 115 / 86%)",
    },
  },
});

export default function SimManagement() {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const ExcelImportModal = () => {
    setOpenModal(true);
  };

  const closeExcelImportModal = () => {
    setOpenModal(false);
  };

  return (
    <div className="main_container">
      <LoadingComponent isLoading={loading} />
      <Box className="main">
        <ThemeProvider theme={theme}>
          <Button onClick={ExcelImportModal}>import excel</Button>
          <ImportExcel
            openModal={openModal}
            setOpenModal={setOpenModal}
            closeExcelImportModal={closeExcelImportModal}
          />
        </ThemeProvider>
      </Box>
    </div>
  );
}
