import { userService } from "../services";
import config from "../../config/config";
import axios from "axios";
export const DeviceAction = {
  getIccidList,
  saveBulkIccid,
  getProviders,
  getOperators,
  exportAllDevicConfigDataToEmail,
  getCoreUrl,
  getDevices,
  reconfigureDevices,
  getAllReconfiguredDevices,
  getDeviceInfo,
  getCommand,
};
async function getCommand(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.getCommand;
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
async function getDeviceInfo(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.getDeviceInfo;
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
async function getAllReconfiguredDevices(payload) {
  try {
    const apiEndPoint =
      config.baseUrl + config.apiName.getAllReconfiguredDevices;
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
async function reconfigureDevices(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.reconfigureDevices;
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
async function getDevices(baseUrl) {
  try {
    const apiEndPoint = `${baseUrl}`;
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

async function getCoreUrl() {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.getCoreUrl;
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
async function exportAllDevicConfigDataToEmail(payload) {
  try {
    const apiEndPoint =
      config.baseUrl + config.apiName.exportAllDevicConfigDataToEmail;
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

async function getIccidList(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.getIccidList;
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

async function saveBulkIccid(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.saveBulkIccid;
    // const response = await fetch.post(apiEndPoint, payload);

    const response = fetch(apiEndPoint, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (response) {
      console.log(response);
      return response.data;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}
async function getProviders() {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.getAllProvider;
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
async function getOperators() {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.getAllOperator;
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
