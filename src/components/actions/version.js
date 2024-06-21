import { userService } from "../services";
import config from "../../config/config";

export const VersionAction = {
  getAllVersion,
  updateVersion,
  getAllVersionRequest,
  getRequestById,
  revertCommandRequest,
};

async function getAllVersion(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.getVersionList;
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
async function getAllVersionRequest(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.getAllVersionRequest}?pageNo=${payload.pageNo}&pageSize=${payload.pageSize}`;
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
async function updateVersion(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.updateVersion;
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

async function getRequestById(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.getRequestById;
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
async function revertCommandRequest(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.revertCommandRequest;
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
