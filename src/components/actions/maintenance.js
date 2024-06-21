import { userService } from "../services";
import config from "../../config/config";

export const MaintenanceAction = {
  getReturnRequest,
  generateReturnReceipt,
  addDeviceToReturn,
  getRepairRequestList,
  generateRepairReceipt,
  addDeviceToRepair,
  repairDevice,
  getDeviceChargesById,
  issueChargeList,
  getAllPackedDevice,
  getAllMaintenanceDevices,
  addDeviceToMaintenance,
  getAllDevicesAsPerUserSearch,
  getAllCompanyData,
  updateRepairStatus,
};

async function getDeviceChargesById(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.getDeviceChargesById}`;
    const response = await userService.post(apiEndPoint, payload);
    if (response) {
      return response.data;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}
async function getAllPackedDevice(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.getAllPackedDevice}`;
    const response = await userService.post(apiEndPoint, payload);
    if (response) {
      return response.data;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function issueChargeList(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.issueChargeList;
    const response = await userService.get(apiEndPoint);
    if (response) {
      return response.data;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function repairDevice(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.repairDevice;
    const response = await userService.post(apiEndPoint, payload);
    if (response) {
      return response.data;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function addDeviceToRepair(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.addDeviceToRepair;
    const response = await userService.post(apiEndPoint, payload);
    if (response) {
      return response.data;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}
async function generateRepairReceipt(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.generateRepairReceipt;
    const response = await userService.post(apiEndPoint, payload);
    if (response) {
      return response.data;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}
async function getRepairRequestList(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.getRepairRequestList}`;
    const response = await userService.post(apiEndPoint, payload);
    if (response) {
      return response.data;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}
async function addDeviceToReturn(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.addDeviceToReturn;
    const response = await userService.post(apiEndPoint, payload);
    if (response) {
      return response.data;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}
async function getReturnRequest(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.getReturnRequest;
    const response = await userService.post(apiEndPoint, payload);
    if (response) {
      return response.data;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}
async function generateReturnReceipt(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.generateReturnReceipt;
    const response = await userService.post(apiEndPoint, payload);
    if (response) {
      return response.data;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}
async function updateRepairStatus(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.updateRepairStatus;
    const response = await userService.post(apiEndPoint, payload);
    if (response) {
      return response.data;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function getAllMaintenanceDevices(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.getAllMaintenanceDevice}?pageNo=${payload.pageNo}&pageSize=${payload.pageSize}`;
    const response = await userService.post(apiEndPoint, payload);
    if (response) {
      return response.data;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}
async function getAllCompanyData(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.getCompanyList;
    const response = await userService.get(apiEndPoint);
    if (response) {
      return response.data;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function addDeviceToMaintenance(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.addDeviceToMaintenance;
    const response = await userService.post(apiEndPoint, payload);
    if (response) {
      return response.data;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function getAllDevicesAsPerUserSearch(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.getDevicesByStatus;
    const response = await userService.post(apiEndPoint, payload);
    if (response) {
      return response.data;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}
