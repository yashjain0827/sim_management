import config from "../../config/config";
import { userService } from "../services";

export const CustomerCareAction = {
  getCustomersDetails,
  updateCustomerDetails,
};

async function getCustomersDetails(token) {
  try {
    const apiEndPoint = `${config.baseUrlOfConfigurationUpdate}${config.apiName.getCustomersDetails}?companyToken=${token}`;
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

async function updateCustomerDetails(token, payload) {
  try {
    const apiEndPoint = `${config.baseUrlOfConfigurationUpdate}${config.apiName.customerUpdate}?companyToken=${token}`;
    const response = await userService.post(apiEndPoint, payload);
    if (response) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}
