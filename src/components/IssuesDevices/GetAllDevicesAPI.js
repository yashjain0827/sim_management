import config from "../../config/config";
import { userService } from "../services";

export const DevicesAction = {
  getIssuesDeviceList,
  getAllDevices
};

async function getIssuesDeviceList(payload, keys) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.getIssueDevices}pageNo=${keys.pageNo}&pageSize=${keys.pageSize}`;
    const response = await userService.post(apiEndPoint, payload);
    console.log(response.data.data);
    if (response) {
      return response.data;
    } else {
      return { status: 400, message: "Something Went Wrong", data: null };
    }
  } catch (error) {
    return { status: 400, message: "Something Went Wrong", data: null };
  }
}

async function getAllDevices(keys) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.issueDeviceById + keys;
    const response = await userService.get(apiEndPoint);
    if (
      (response && response.data && response.data.responseCode === 200) ||
      response.data.responseCode === 201
    ) {
      return {
        status: response.data.responseCode,
        message: response.data.message,
        data: response.data.data
      };
    } else {
      return { status: 400, message: "Something Went Wrong", data: null };
    }
  } catch (error) {
    return { status: 400, message: "Something Went Wrong", data: null };
  }
}


