import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TopView from "../CommonComponents/topView";
import moment from "moment";
import ExportPdf from "../CommonComponents/exportPdf";
import ExportReport from "../CommonComponents/Export";
import { BoxPackaging } from "../actions/boxPackaging";
import { companyAction } from "../company/companyFetchData";
import { SubscriptionAction } from "../actions/subscription";
import ControlledAccordions from "./accordianCode";
import {
  Button,
  Fade,
  Grid,
  IconButton,
  Paper,
  Popover,
  Popper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  InputAdornment,
  Box,
  Autocomplete,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LoadingComponent from "../CommonComponents/LoadingComponts";
const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(14 57 115 / 86%)",
    },
  },
});

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
const AddSubscription = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const timerForClient = useRef(null);
  const [state, setState] = useState();
  const [stateList, setStateList] = useState([]);
  const [client, setClient] = useState();
  const [clientList, setClientList] = useState([]);
  const [clientSubscriptionList, setclientSubscriptionList] = useState([]);
  const [stateName, setStateName] = useState("");
  const [platformTypeList, setPlatformTypeList] = useState([]);
  const [platformType, setPlatformType] = useState();

  async function getPlatformType() {
    const response = await SubscriptionAction.getPlatformType();
    if (response?.responseCode == 200 || response?.responseCode == 201) {
      setPlatformTypeList(response?.data);
      console.log(response);
    } else {
      setPlatformTypeList([]);
    }
  }

  let topViewData = {
    pageTitle: "Add Subscription",

    addText: "Add Return Device",

    hideAddButton: true,
    addClick: `/addSubscription`,

    editText: "",
    hideEditButton: true,
    editClick: null,

    cancelText: null,
    hideCancelButton: true,
    cancelClick: null,

    updateText: null,
    hideUpdateButton: true,
    updateClick: null,

    hidePdfExport: true,
    exportPdfClick: "",
    onPdfDownload: null,

    hideExcelExport: true,
    exportExcelClick: "",
    onExcelDownload: null,

    hideExcelImport: true,
    excelImportClick: "",

    filter: true,
    filterHandler: null,

    searchFieldHandler: null,
    searchInput: null,
    searchField: true,
  };

  useEffect(() => {
    fetchStateList();
    getPlatformType();
  }, []);

  async function fetchClientSubscription() {
    setIsLoading(true);
    if (!client.id) {
      alert("please select client");
      return;
    }
    if (!state.id) {
      alert("please select state");
      return;
    }
    let data = {
      clientId: client?.id ?? null,
      stateId: state?.id ?? null,
      platformId: platformType?.id ?? null,
    };
    const response = await SubscriptionAction.fetchClientSubscription(data);
    if (response.responseCode == 200 || response.responseCode == 201) {
      console.log(Object.entries(response?.data)[0]);
      const [stateName, subscriptionType] = Object.entries(response?.data)[0];
      console.log(stateName, subscriptionType);
      setStateName(stateName);

      setclientSubscriptionList(subscriptionType);
    }
    setIsLoading(false);
  }
  function handleSubscription(event, subscriptionType, i) {
    console.log(event.target.value, subscriptionType, i);
    const copyObj = { ...clientSubscriptionList };
    if (event.target.name == "totalDays") {
      copyObj[subscriptionType][i].subscriptionMaster.totalDays =
        +event.target.value;
    } else {
      copyObj[subscriptionType][i].amount = +event.target.value;
    }
    console.log(copyObj);
    setclientSubscriptionList(copyObj);
  }
  async function fetchStateList() {
    const response = await BoxPackaging.getAllStatesList();
    if (response) {
      setStateList(response);
    } else {
      setStateList([]);
    }
  }
  async function fetchCompanyData(searchTerm) {
    // setSearchKeyword(searchTerm);
    console.log(searchTerm);
    const data = {
      pageNo: 0,
      pageSize: 0,
      companyName: searchTerm,
    };
    // const data = { pageNo: 15, pageSize: 50 };

    const response = await companyAction.getClientsList(data);
    if (response != null) {
      console.log(response.data);
      setClientList(response?.data);
    } else {
      setClientList([]);
    }
  }
  function searchClient(getData, delay) {
    // console.log(searchTerm);
    const that = this;
    let latestArgs;

    // console.log(timer);
    return (...args) => {
      debugger;
      latestArgs = args;
      // setSearchKeyword(...args);
      console.log(timerForClient.current);
      if (timerForClient.current) {
        // alert("on");
        clearTimeout(timerForClient.current);
      }
      timerForClient.current = setTimeout(() => {
        debugger;
        getData.apply(that, latestArgs);
      }, delay);
    };
  }

  const debouncedFunctionForClient = searchClient(fetchCompanyData, 1000);
  async function saveSubscriptionHandler() {
    setIsLoading(true);

    console.log(clientSubscriptionList);
    const platformCharge =
      clientSubscriptionList["State Platform Charges"][0].amount;

    let array = [];
    Object.values(clientSubscriptionList).map((ele) => {
      console.log(ele);
      array = [...array, ...ele];
    });
    console.log(array);
    const array2 = array.filter((ele) => {
      return ele?.subscriptionMaster?.id;
    });
    const subscriptionAmount = array2.map((ele) => {
      return {
        amount: ele.amount,
        clientSubscriptionMasterId: ele?.subscriptionMaster?.id ?? null,
      };
    });
    console.log(subscriptionAmount);
    let data = {
      clientId: client?.id,
      stateId: state?.id,
      subscriptionAmount: subscriptionAmount,
      userId: JSON.parse(localStorage.getItem("data"))?.id,
      userName: JSON.parse(localStorage.getItem("data")).name,
      statePlatformCharges: platformCharge,
      platformId: platformType?.id ?? null,
    };
    console.log(data);
    const response = await SubscriptionAction.addSubscription(data);
    setIsLoading(false);
    if (response.responseCode == 200 || response.responseCode == 201) {
      alert("Subscription added!");
      navigate("/subscriptionMaster");
    }

    // alert(response.data.message);
  }
  return (
    <div className="main_container">
      <Box className="main">
        <ThemeProvider theme={theme}>
          <TopView topViewData={topViewData}></TopView>
          <LoadingComponent isLoading={isLoading} />

          <Grid container sx={{ marginTop: "0rem", background: "" }} rowGap={1}>
            <Grid item xs={12}>
              <Paper sx={{ width: "100%", mb: 2, padding: 1 }} elevation={1}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      Client Name
                    </Typography>
                    <CustomAutoComplete
                      disablePortal
                      required
                      id="combo-box-demo"
                      options={clientList || []}
                      getOptionLabel={({ companyName }) => {
                        return companyName || "";
                      }}
                      value={client || {}}
                      onChange={(e, newValue) => setClient(newValue)}
                      sx={{ width: 240 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          onChange={(e) => {
                            debouncedFunctionForClient(e.target.value);
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      State
                    </Typography>
                    <CustomAutoComplete
                      disablePortal
                      required
                      id="combo-box-demo"
                      options={stateList || []}
                      value={state}
                      getOptionLabel={({ name }) => {
                        return name || "";
                      }}
                      onChange={(e, newValue) => setState(newValue)}
                      sx={{ width: 220 }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                  <Grid item>
                    <Typography sx={{ color: "rgb(14 57 115 / 86%)" }}>
                      subscription Type
                    </Typography>
                    <CustomAutoComplete
                      disablePortal
                      required
                      id="combo-box-demo"
                      options={platformTypeList || []}
                      value={platformType}
                      getOptionLabel={({ name }) => {
                        return name || "";
                      }}
                      onChange={(e, newValue) => setPlatformType(newValue)}
                      sx={{ width: 220 }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      sx={{ marginTop: "20px", color: "white" }}
                      onClick={() => {
                        fetchClientSubscription();
                      }}
                    >
                      show
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ width: "100%", mb: 2 }} elevation={1}>
                {clientSubscriptionList &&
                  stateName &&
                  Object.keys(clientSubscriptionList)?.length > 0 && (
                    <ControlledAccordions
                      {...{
                        clientSubscriptionList,
                        stateName,
                        handleSubscription: (event, subscriptionType, i) =>
                          handleSubscription(event, subscriptionType, i),
                      }}
                    />
                  )}
              </Paper>
            </Grid>
            <Grid item container justifyContent={"flex-end"} spacing={2}>
              <Grid item>
                {" "}
                <Button onClick={() => navigate("/subscriptionMaster")}>
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                {" "}
                <Button variant="contained" onClick={saveSubscriptionHandler}>
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </ThemeProvider>
      </Box>
    </div>
  );
};

export default AddSubscription;
