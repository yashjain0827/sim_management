import { userService } from "../services";
import config from "../../config/config";

export const SubscriptionAction = {
  fetchClientSubscription,
  getSubscriptionList,
  addSubscription,
  getPlatformType,
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
