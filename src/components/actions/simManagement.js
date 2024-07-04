import { userService } from "../services";
import config from "../../config/config";

export const SimManagementAction = {
  importExcel,
  getAllSimManagement,
  getSimManagementDetails,
};

async function importExcel(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.simImportExcel}`;
    const response = await userService.post(apiEndPoint, payload);
    if (
      (response &&
        response.data &&
        (response.data.responseCode === 200 ||
          response.data.responseCode === 206)) ||
      response.data.responseCode === 201
    ) {
      return {
        status: response.data.responseCode,
        message: response.data.message,
        requestCode: response.data.requestCode,
        data: response.data.data,
      };
    } else {
      return {
        status: 400,
        message: response?.data?.message,
        requestCode: null,
        data: response.data.data,
      };
    }
  } catch (error) {
    return {
      status: 400,
      message: error.message || "Something Went Wrong",
      requestCode: null,
      data: null,
    };
  }
}
async function getAllSimManagement(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.getAllSimManagement}`;
    const response = await userService.post(apiEndPoint, payload);
    if (response && response.data) {
      return response.data;
    } else {
      return {
        status: response.data?.responseCode || 400,
        message: response.data?.message || "Unknown error",
        requestCode: null,
        data: response.data?.data || null,
      };
    }
  } catch (error) {
    return {
      status: 400,
      message: error.message || "Something Went Wrong",
      requestCode: null,
      data: null,
    };
  }
}
async function getSimManagementDetails(requestId) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.getOneSimManagement}${requestId}`;
    const response = await userService.get(apiEndPoint);
    if (response && response.data) {
      return response.data;
    } else {
      return {
        status: 400,
        message: response?.data?.message,
        requestCode: null,
        data: response.data.data,
      };
    }
  } catch (error) {
    return {
      status: 400,
      message: error.message || "Something Went Wrong",
      requestCode: null,
      data: null,
    };
  }
}
