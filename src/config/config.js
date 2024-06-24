const config = Object.freeze({
  // baseUrl: "https://productionstaging.nyggs.com/backend/",

  // Udit
  baseUrl: "http://192.168.12.48:8080/",

  // Surya
  // baseUrl: "http://192.168.12.55:8080/",

  // Subham
  // baseUrl: "http://192.168.12.57:8080/",

  // baseUrl: "http://staging.watsoo.com:8085/watsoo-device-management/",

  baseUrlOfConfigurationUpdate: "http://staging.watsoo.com:8085/client_config/",

  frontEndUrl: "https://production.nyggs.com/",

  fileCreateUrl: "https://storage.nyggs.com/setmedia/api/save/file",
  baseUrlforCompany: "http://staging.watsoo.com:8085/watsoo-device-management/",
  // devicesforCompany: "http://staging.watsoo.com:8080/",
  fileUrlGenerate: "https://storage.nyggs.com/setmedia/api/save/file",

  apiName: {
    login: "api/v3/login",

    dashboardGetAll: "api/get/All",
    exportDataToEmail: "api/device/excel/generate",
    boxListdata: "api/v1/get/all/box",
    stateList: "api/v1/getAll/states",
    getDeviceById: "api/get/All",
    createBox: "api/save/box",
    createBox1: "api/create/box",
    getDeviceByBoxId: "api/get/box/byId",
    updateDeviceStatus: "api/update/status",
    addCompany: "api/add/company",
    getCompanyList: "api/get/company",
    clientList: "api/client",
    updateProfileById: "api/add/company",
    getCompanyById: "api/get/company?id=",
    getIssueDevices: "api/all/issued_device?",
    checkAvailabilityUrl: "api/availability",
    saveBoxDeviceUrl: "api/save/issue",
    issueDeviceById: "api/devices?issuedId=",
    updateUserAllState: "api/update/state",
    importExcel: "api/update/device/sim/details",
    softwareVirsionList: "api/get/all/unique/software/version",
    overRideUpdateImport: "api/override/device/sim/details",
    getAllConfigCommand: "api/all/state-command",
    configSaveUpdateDelete: "api/add-update-delete/state-command",
    saveReconfigurationResponse: "api/save/command_response",
    saveReconfigureDevice: "api/device/reconfigure",
    commandPermission: "shootCommand/device",
    // http://localhost:8080/api/update/device/sim/details

    getSoftwareVersion: "api/getCurrentVersion",
    updateSoftwareVersion: "api/updateSoftwareVersion",
    unboxingById: "api/unbox/device",

    simOperator: "api/get/all/simoperator",

    getCustomersDetails: "api/get/company/config",
    customerUpdate: "api/update/support",

    getAllMaintenanceDevice: "api/v1/all/return_replace_repair",
    addDeviceToMaintenance: "api/v1/add/return_replace_repair",
    getDevicesByStatus: "api/get/by/imei",
    updateRepairStatus: "api/v1/repair",

    /* ======update version================= */

    getVersionList: "api/v1/all/version-command",
    updateVersion: "api/command/request",
    getAllVersionRequest: "api/all/request",
    getRequestById: "api/get/request/by/id",
    revertCommandRequest: "api/revert/command/request",

    /*============ ICCID =============================*/

    getIccidList: "api/v1/get/all/iccid",
    saveBulkIccid: "api/v1/add/iccid/from/excel",
    getAllProvider: "api/v1/all/provider",
    getAllOperator: "api/v1/all/operators",
    /* ============LOT======================= */
    getLotList: "api/device-lot/all",
    getAllDeviceModal: "api/device-model/all",
    addLot: "api/device-lot/add",
    getCommandCheckList: "api/all/commands",
    saveCommand: "api/save/command/response",
    saveTestedDevice: "api/save/tested/device",
    rejectDevice: "api/tested/device/reject",
    upfateClierntCoommand: "api/model-config/add",
    lotDevicesList: "api/device/lot_id",
    commandTrail: "api/tested/device/command/trail",

    /*============ ImeiCommand =============================*/
    imeiCommand: "api/device/config/request",
    commandAll: "command/All",
    commandlistById: "commandDetails/All",
    emsMaster: "api/ems/all",
    generateReturnReceipt: "api/v1/add/return/request",
    getReturnRequest: "api/v1/return/device/request/all",
    addDeviceToReturn: "api/v1/add/device/return",
    generateRepairReceipt: "api/v1/add/repair/request",
    getRepairRequestList: "api/v1/repair/device/request/all",
    addDeviceToRepair: "api/v1/add/device/repair",
    repairDevice: "api/v1/device/repair",
    issueChargeList: "api/v1/all/charges",
    getAllPackedDevice: "api/get/All/device_packed",
    getDeviceChargesById: "api/v1/device/repair/charges",
    exportAllDevicConfigDataToEmail: "device/configure/notify",

    /*============ reconfigure_command =============================*/
    reconfigurecommand: "api/save/reconfigure_command",
    reconfigureCommandExist: "api/reconfigure_command/exist",
    reconfigureboxDeviceList: "api/get/box_device",
    boxDeviceList: "api/get/reconfigure_box",
    findDevice: "api/v1/get/device",
    unboxing: "api/device/unbox",
    finishReconfiguration: "api/reconfigure/finish",
    reconfigCommands: "api/get/reconfig_commands",
    getCoreUrl: "api/all/server",
    getDevices: "api/all/imei",
    addDeviceToBox: "api/add/device/in/box",
    subscriptionMaster: "subscription/check/client/subscription",
    getSubscriptionList: "subscription/all",
    addSubscription: "subscription/add/client/subscription",
    getPlatformType: "api/all/platform",
    reconfigureDevices: "api/v2/device/reconfigure",
    getAllReconfiguredDevices: "api/all/reconfigure/device",
    getDeviceInfo: "api/device/info",
    getCommand: "api/client-state/command",
    getDeviceInfoByImeiNo: "api/v2/device/info",

    /*============ sim_management ===============*/
    simImportExcel: "api/save/device_renewal_request",
    getAllSimManagement: "api/get/All/device_renewal_request",
  },
});

export default config;
