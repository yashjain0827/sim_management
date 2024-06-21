import React, { useState, useEffect, useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { BoxPackaging } from "../actions/boxPackaging";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import {
  Box,
  Grid,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import TopView from "../CommonComponents/topView";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import ExportReport from "../CommonComponents/Export";
import ExportPdf from "../CommonComponents/exportPdf";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableContainer,
  TableRow,
  styled,
  TableHead,
  TableBody,
  boxList,
  Button,
} from "@mui/material";
import moment from "moment";
import debouce from "lodash.debounce";

import LoadingComponent from "../CommonComponents/LoadingComponts";
import ReconfigurationModal from "./ReconfigurationModal";
import ReconfigurationTable from "./ReconfigurationTable";
import addIcon from "../../img/Add.svg";
import { DeviceAction } from "../../components/actions/device";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgb(14 57 115 / 86%)",
    color: theme.palette.common.white,
    padding: "10px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "10px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(14 57 115 / 86%)",
    },
  },
});
function ReconfigurationList(props) {
  const { id, number } = useParams();
  const [loading, setLoading] = useState();
  const navigate = useNavigate();
  const [deviceList, setDeviceList] = useState([]);
  const [boxDetails, setBoxDetails] = useState({});
  const [alldeviceList, setAlldeviceList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [command, setCommand] = useState();
  const [open, setOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [IdBool, setIdBool] = useState(false);
  const [boxNumber, setBoxNumber] = useState();
  const [stateList, setStateList] = useState([]);
  const [state, setState] = useState();
  const [simProvider, setSimProvider] = useState({});
  const [simProviderList, setSimProviderList] = useState([]);

  async function fetchSimProviders() {
    const response = await DeviceAction.getProviders();
    if (response) {
      setSimProviderList(response);
    } else {
      setSimProviderList([]);
    }
  }
  async function reconfigurationList() {
    setLoading(true);
    const data = {
      pageNo: pageNo,
      pageSize: pageSize,
      search: searchValue,
    };
    await BoxPackaging.fetchBoxDeviceList(data)
      .then((res) => {
        if (res != null) {
          setLoading(false);
          setDeviceList(res?.data);
          setTotalCount(res?.totalElements);
          // setBoxDetails(res?.data?.boxDeviceDTO?.boxDTO);
        } else {
          setLoading(false);
          setDeviceList([]);
          setBoxDetails();
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }
  const emptyValue = () => {
    setCommand("");
    setBoxNumber("");
    setOpen(false);
  };

  const savereconfigurecommand = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to set  this command?"
    );
    if (!confirmed) {
      return; // User cancelled the operation
    }

    if (command === undefined || command === null || command === "") {
      alert("Please Enter Your Command");
      return false;
    }
    setLoading(true);
    const data = {
      // boxId: id,
      command: command,
      boxCode: boxNumber || "",
      userId: JSON.parse(localStorage.getItem("data"))?.id,
      stateId: state?.id ?? null,
      simProviderId: simProvider?.id ?? null,
    };

    await BoxPackaging.fetchreconfigurecommand(data).then((response) => {
      try {
        if (response !== null) {
          setLoading(false);
          if (response.responseCode === 201) {
            alert(response.message);
            emptyValue();
            reconfigurationList();
            // checkExitCoomand();
          } else {
            setLoading(false);
            emptyValue();
            alert(response.message);
          }
        } else {
          emptyValue();
          alert(response.message);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    });
  };

  const modalOpenHandler = () => {
    setOpen(true);
  };
  const closeModal = () => {
    setState();
    setCommand();
    setBoxNumber();
    setSimProvider();
    setOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    //console.log(newPage);
    setPageNo(newPage);
    setIdBool(true);
  };

  const handleChangeRowsPerPage = (event) => {
    //console.log(event.target.value)
    setPageSize(parseInt(event.target.value));
    setPageNo(0);
    setIdBool(true);
  };

  useEffect(() => {
    if (IdBool) {
      reconfigurationList();
    }
    setIdBool(false);
  }, [IdBool]);

  useEffect(() => {
    // checkExitCoomand();
    // fetchReconfigCommands()
    getAllStates();
    reconfigurationList();
    fetchSimProviders();
  }, []);
  const globalSearcValueHandler = (e) => {
    setSearchValue(e.target.value);

    setIdBool(true);
    if (e.target.value === "") {
      setIdBool(true);
      setPageNo(0);
    }
  };
  const debouncedResults = useMemo(() => {
    return debouce(globalSearcValueHandler, 1000);
  }, []);
  let topViewData = {
    pageTitle: `Reconfiguration Box `,
    // pageTitle: `Box Details`,

    /* ================= */
    addText: "",
    // hideAddButton: !webPermission.includes("ADD_COMPANY"),
    hideAddButton: true,
    addClick: "",
    /* ====================== */
    editText: "",
    hideEditButton: true,
    editClick: null,
    /* =========================== */
    cancelText: null,
    hideCancelButton: true,
    cancelClick: "/boxList",
    /* ================== */
    updateText: null,
    hideUpdateButton: true,
    updateClick: null,
    /* ================== */
    hidePdfExport: true,
    exportPdfClick: "/companyCreate",
    onPdfDownload: null,
    /* ================= */
    hideExcelExport: true,
    exportExcelClick: "",
    onExcelDownload: null,
    /* ==================== */
    hideExcelImport: true,
    excelImportClick: "",
    /* ==================== */
    filter: true,
    filterHandler: null,
    /* ====================== */

    searchFieldHandler: debouncedResults,
    searchInput: searchValue,
    searchField: false, // Show the search input field
    // onSearchIconHandler: reconfigurationList,

    addCommandHandler: modalOpenHandler,
    addCommand: false,
  };

  const TableHeadData = [
    { id: 1, name: "S no.", width: "50px" },
    { id: 2, name: "Created At", width: "150px" },
    { id: 4, name: "Box Number", width: "100px" },
    { id: 4, name: "Reconfigured Box", width: "100px" },
    { id: 4, name: "Unsettled Box", width: "100px" },

    { id: 4, name: "Config Command", width: "100px" },
    { id: 4, name: "State", width: "100px" },

    // { id: 5, name: "Total Device ", width: "100px" },
    { id: 6, name: "Total Reconfigured Device", width: "100px" },
    { id: 7, name: "Total Unbox Device", width: "200px" },
    { id: 10, name: "Status", width: "100px" },
    { id: 8, name: "Action", width: "10px" },
  ];

  const InnerTableHeader = [
    { id: 1, name: "S no.", width: "50px" },
    { id: 2, name: "Updated At", width: "150px" },
    { id: 4, name: "IMEI Number", width: "100px" },
    { id: 4, name: "State", width: "100px" },

    { id: 8, name: "Status", width: "100px" },
    { id: 8, name: "Action", width: "100px" },
  ];

  async function finishReconfiguration(selectedBox) {
    console.log(selectedBox);
    const confirmed = window.confirm(
      "Are you sure you want to unbox the remaining devices ?"
    );
    if (!confirmed) {
      return; // User cancelled the operation
    }
    if (!selectedBox.boxId) {
      return;
    }
    debugger;
    let data = {
      boxId: selectedBox.boxId,
      reConfigureBoxId: selectedBox.id,
      userId: JSON.parse(localStorage.getItem("data")).id,
    };
    console.log(data, selectedBox);

    const response = await BoxPackaging.finishReconfiguration(data);
    if (response) {
      console.log(response);

      alert(response.message);
      reconfigurationList();
    } else {
      console.log(response);
    }
  }
  const getAllStates = () => {
    BoxPackaging.getAllStatesList()
      .then((res) => {
        if (res != null) {
          setStateList((previous) => {
            return previous.concat(res);
          });
        } else {
          setStateList([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  function stateHandler(data) {
    if (data) {
      setState(data);
    } else {
      setState({ id: "", name: "" });
    }
  }
  return (
    <div className="main_container">
      <Box className="main">
        <ThemeProvider theme={theme}>
          <LoadingComponent isLoading={loading} />
          <ReconfigurationModal
            open={open}
            boxNumber={boxNumber}
            setBoxNumber={setBoxNumber}
            command={command}
            setCommand={setCommand}
            handleSubmit={savereconfigurecommand}
            closeDialogBox={closeModal}
            state={state}
            setState={setState}
            stateHandler={stateHandler}
            stateList={stateList}
            simProvider={simProvider}
            setSimProvider={setSimProvider}
            simProviderList={simProviderList}
          />
          <Grid container justifyContent={"space-between"}>
            <Grid item xs={11}>
              <TopView topViewData={topViewData} />
            </Grid>

            <Grid item>
              <div
                onClick={() => {
                  setState();
                  setBoxNumber();
                  setSimProvider();
                  setCommand("");
                  setOpen(true);
                }}
              >
                <img src={addIcon} alt="add button"></img>
              </div>
            </Grid>
          </Grid>
          <Grid container sx={{ backgroundColor: "" }}>
            <Grid item xs={12}>
              <ReconfigurationTable
                TableHeadData={TableHeadData}
                data={deviceList}
                setLoading={setLoading}
                InnerTableHeader={InnerTableHeader}
                reconfigurationList={reconfigurationList}
                finishReconfiguration={(data) => finishReconfiguration(data)}
              />
              <TablePagination
                component="div"
                rowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
                count={totalCount ? totalCount : 0}
                rowsPerPage={pageSize}
                page={pageNo}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Grid>
          </Grid>
        </ThemeProvider>
      </Box>
    </div>
  );
}

export default ReconfigurationList;
