import config from "../../config/config";
import { userService } from "../services";

export const companyAction = {
  postCompanyProfile,
  getCompanyList,
  postCompanyLogoUrl,
  updateCompanyProfile,
  getCompanyById,
  getClientsList,
};
async function postCompanyProfile(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.addCompany;
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

async function getCompanyList() {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.getCompanyList;
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
      return { status: 400, message: "Something Went Wrong", data: null };
    }
  } catch (error) {
    return { status: 400, message: "Something Went Wrong", data: null };
  }
}

async function getClientsList(payload) {
  try {
    const apiEndPoint = `${config.baseUrl + config.apiName.clientList}?pageNo=${
      payload.pageNo
    }&pageSize=${payload.pageSize}`;
    const response = await userService.post(apiEndPoint, payload);

    if (
      (response && response.data !==null)) {
      return {
        status: response.data.responseCode,
        message: response.data.message,
        data: response.data.data,
        totalElements:response?.data?.totalElements
      };
    } else {
      return { status: 400, message: "Something Went Wrong", data: null };
    }
  } catch (error) {
    return { status: 400, message: "Something Went Wrong", data: null };
  }
}

async function postCompanyLogoUrl(Payload) {
  try {
    alert("vhj");
    const apiEndPoint = config.fileUrlGenerate;
    const response = await userService.post(apiEndPoint, Payload);

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
      return { status: 400, message: "Something Went Wrong", data: null };
    }
  } catch (error) {
    return { status: 400, message: "Something Went Wrong", data: null };
  }
}

async function updateCompanyProfile(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.updateProfileById;
    const response = await userService.post(apiEndPoint, payload);
    if (response) {
      return response.data;
    } else {
      return { status: 400, message: "Something Went Wrong", data: null };
    }
  } catch (error) {
    return { status: 400, message: "Something Went Wrong", data: null };
  }
}

async function getCompanyById(userId) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.getCompanyById + userId;
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
      return { status: 400, message: "Something Went Wrong", data: null };
    }
  } catch (error) {
    return { status: 400, message: "Something Went Wrong", data: null };
  }
}
