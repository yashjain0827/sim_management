import React, { lazy } from "react";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoutes } from "./route/ProtectedRoutes";
import BoxList from "./components/BoxPackaging/BoxList";
import CreateBox from "./components/BoxPackaging/createBox1";
import BoxDevices from "./components/BoxPackaging/viewBox";
import DeviceStatusUpdate from "./components/Dashboard/CreateBox";
import CompanyList from "./components/company/CompanyList";
import CompanyProfile from "./components/company/CompanyProfile";
import CheckAvailability from "./components/Devices/CheckAvailability";
import BoxSelectionQuantity from "./components/Devices/BoxSelectionQuantity";
import ViewCompanyProfile from "./components/company/ViewCompanyProfile";
import AllIssuesDevices from "./components/IssuesDevices/AllIssuesDevice";
import SingleCompanyDevicesList from "./components/IssuesDevices/SingleCompanyDevicesList";
import ViewBoxWithQrCode from "./components/BoxPackaging/ViewBoxWithQrCode";
import QRCodeViewclientDetails from "./components/IssuesDevices/QRCodeViewclientDetails";
import Configuration from "./components/configuration";
import ViewSingleDetails from "./components/Dashboard/ViewSingleDetails";
import CustomerDetails from "./components/Customers/CustomerDetails";
import MaintenanceList from "./components/Replace_repair/replace_repair_requests";
import AddMaintenance from "./components/Replace_repair/addReplace_repair";
import UpdateVersion from "./components/version_control/update_version";
import VersionDashboard from "./components/version_control/versionDashboard";
import VersionRequest from "./components/version_control/versionRequestList";
import ViewRequest from "./components/version_control/ViewRequest";
import IccidList from "./components/IccidComponent/iccidList";
import Comport from "./components/Comport/comport";
import DeviceLotList from "./components/LotConfiguratin/LotList";
import AddNewLot from "./components/LotConfiguratin/addNewLot";
import ViewLot from "./components/LotConfiguratin/viewLot";
import DevicesList from "./components/LotConfiguratin/DevicesList";
import AddDeviceToReturn from "./components/returnManagement/addReturn";
import ImeiRequestsList from "./components/ImortImeiCommand/ImeiRequestsList";
import ReturnRequests from "./components/returnManagement/returnRequest";
import RepairTicket from "./components/Replace_repair/repairTicket";
import ReplaceTicket from "./components/Replace_repair/replaceTicket";
import ReconfigurationList from "./components/BoxPackaging/ReconfigurationList";
import Invoice from "./components/IssuesDevices/invoiceGenerator";
import SubscriptionMasterList from "./components/SubscriptionMaster/subscriptionMasterList";
import AddSubscription from "./components/SubscriptionMaster/addSubscription";
import DeviceRowData from "./components/rowDataMaster/rowData";
import BulkReconfigure from "./components/dataPacket/reconfigureDevices";
import ReconfigureDeviceList from "./components/dataPacket/dataPacketList";
import SimManagement from "./components/SimManagement/SimManagement";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/viewBoxDetails/:id" element={<ViewBoxWithQrCode />} />
        <Route
          path="/QRCodeViewclientDetails/:id"
          element={<QRCodeViewclientDetails />}
        />
        <Route element={<ProtectedRoutes />}>
          <Route path="/createBox/:createdBoxId" element={<CreateBox />} />
          <Route path="/simManagement" element={<SimManagement />} />
          <Route path="/deviceStatusUpdate" element={<DeviceStatusUpdate />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/viewDeviceDetails" element={<ViewSingleDetails />} />
          <Route path="/boxList" element={<BoxList />} />
          <Route path="/invoice" element={<Invoice />} />

          {/* <Route path="/boxList/:createdBoxId" element={<BoxDevices />} /> */}
          <Route path="/CompanyList" element={<CompanyList />} />
          <Route path="/deviceConfig" element={<Configuration />} />
          <Route path="/CompanyProfile" element={<CompanyProfile />} />
          <Route path="/CompanyViewProfile" element={<CompanyProfile />} />
          <Route path="/companyUpdate" element={<CompanyProfile />} />
          <Route path="/CheckAvailability" element={<CheckAvailability />} />
          <Route
            path="/BoxSelectionQuantity"
            element={<BoxSelectionQuantity />}
          />
          <Route path="/ViewCompanyProfile" element={<ViewCompanyProfile />} />
          <Route path="/AllIssuesDevices" element={<AllIssuesDevices />} />
          <Route
            path="/SingleCompanyDevicesList"
            element={<SingleCompanyDevicesList />}
          />
          <Route path="/customerInfomation/" element={<CustomerDetails />} />
          <Route path="/maintenanceList" element={<MaintenanceList />} />
          <Route
            path="/addDeviceToMaintenance/:repairRequestId"
            element={<AddMaintenance />}
          />
          <Route path="/version_update" element={<UpdateVersion />} />
          <Route path="/versionRequest" element={<VersionRequest />} />
          <Route path="/versionRequest/:id" element={<ViewRequest />} />
          <Route path="/iccidMaster" element={<IccidList />} />
          {/* ===========LOT CONGIGURATION================= */}

          <Route path="/deviceLot" element={<DeviceLotList />} />
          <Route path="/addNewLot" element={<AddNewLot />} />
          <Route path="/viewLot/:id" element={<ViewLot />} />

          <Route path="/comport" element={<Comport />} />
          <Route path="/DevicesList/:id" element={<DevicesList />} />
          <Route path="/imeiRequestsList" element={<ImeiRequestsList />} />
          <Route
            path="/addDeviceToReturn/:returnRequestId"
            element={<AddDeviceToReturn />}
          />
          <Route path="/repairticket" element={<RepairTicket />} />
          <Route path="/replaceticket" element={<ReplaceTicket />} />
          <Route
            path="/subscriptionMaster"
            element={<SubscriptionMasterList />}
          />
          <Route path="/addSubscription" element={<AddSubscription />} />

          <Route path="/return" element={<ReturnRequests />} />
          <Route path="/rawData" element={<DeviceRowData />} />
          <Route path="/reconfigure" element={<BulkReconfigure />} />
          <Route
            path="/reconfigureCommandList"
            element={<ReconfigureDeviceList />}
          />

          <Route
            path="/VersionDashboard"
            element={<VersionDashboard />}
          ></Route>

          <Route
            path="/ReconfigurationList"
            element={<ReconfigurationList />}
          ></Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
