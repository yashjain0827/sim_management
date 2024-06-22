import { userService } from "../services";
import config from "../../config/config";

export const SubscriptionAction = {
  fetchClientSubscription,
  getSubscriptionList,
  addSubscription,
  getPlatformType,
  importExcel,
};
async function getPlatformType() {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.getPlatformType;
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
async function addSubscription(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.addSubscription;
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
async function getSubscriptionList(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.getSubscriptionList;
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
async function fetchClientSubscription(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.subscriptionMaster;
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

async function importExcel(payload) {
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
