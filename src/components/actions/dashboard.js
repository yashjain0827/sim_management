import { userService } from "../services";
import config from "../../config/config";

export const DashboardAction = {
  getAllDashboardData,
  updateDeviceStatus,
  updateStates,
  ImportExcel,
  fetchSoftwareVirsionList,
  overRideUpdateImport,
  commandPermissionByUser,
  fetchSimOperator,
  exportDataToEmail,
};

async function getAllDashboardData(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.dashboardGetAll;
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
async function exportDataToEmail(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.exportDataToEmail;
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

async function updateDeviceStatus(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.updateDeviceStatus;
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

async function updateStates(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.updateUserAllState}`;
    const response = await userService.post(apiEndPoint, payload);
    if (
      (response && response.data && response.data.responseCode === 200) ||
      response.data.responseCode === 201
    ) {
      return {
        status: response.data.responseCode,
        message: response.data.message,
        data: response.data.data,
      };
    } else {
      return { status: 400, message: response?.data?.message, data: null };
    }
  } catch (error) {
    return {
      status: 400,
      message: error.message || "Something Went Wrong",
      data: null,
    };
  }
}
async function ImportExcel(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.importExcel}`;
    const response = await userService.post(apiEndPoint, payload);
    if (
      (response && response.data && response.data.responseCode === 200) ||
      response.data.responseCode === 201
    ) {
      return {
        status: response.data.responseCode,
        message: response.data.message,
        data: response.data.data,
      };
    } else {
      return { status: 400, message: response?.data?.message, data: null };
    }
  } catch (error) {
    return {
      status: 400,
      message: error.message || "Something Went Wrong",
      data: null,
    };
  }
}

async function fetchSoftwareVirsionList(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.softwareVirsionList}`;
    const response = await userService.get(apiEndPoint);
    if (
      (response && response.data && response.data.responseCode === 200) ||
      response.data.responseCode === 201
    ) {
      return {
        status: response.data.responseCode,
        message: response.data.message,
        data: response.data.data,
      };
    } else {
      return { status: 400, message: response?.data?.message, data: null };
    }
  } catch (error) {
    return {
      status: 400,
      message: error.message || "Something Went Wrong",
      data: null,
    };
  }
}

async function overRideUpdateImport(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.overRideUpdateImport}`;
    const response = await userService.post(apiEndPoint, payload);
    if (
      (response && response.data && response.data.responseCode === 200) ||
      response.data.responseCode === 201
    ) {
      return {
        status: response.data.responseCode,
        message: response.data.message,
        data: response.data.data,
      };
    } else {
      return { status: 400, message: response?.data?.message, data: null };
    }
  } catch (error) {
    return {
      status: 400,
      message: error.message || "Something Went Wrong",
      data: null,
    };
  }
}

async function commandPermissionByUser(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.commandPermission}`;
    const response = await userService.post(apiEndPoint, payload);
    if (
      (response && response.data && response.data.responseCode === 200) ||
      response.data.responseCode === 201
    ) {
      return {
        status: response.data.responseCode,
        message: response.data.message,
        data: response.data.data,
      };
    } else {
      return { status: 400, message: response?.data?.message, data: null };
    }
  } catch (error) {
    return {
      status: 400,
      message: error.message || "Something Went Wrong",
      data: null,
    };
  }
}

async function fetchSimOperator() {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.simOperator}`;
    const response = await userService.get(apiEndPoint);
    if (response && response.data !== null && response.status === 200) {
      // console.log(response)
      return response.data;
    } else {
      // alert('hii')
      return { status: 400, message: response?.data?.message, data: null };
    }
  } catch (error) {
    return {
      status: 400,
      message: error.message || "Something Went Wrong",
      data: null,
    };
  }
}
