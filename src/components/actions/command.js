import config from "../../config/config";
import { userService } from "../services";

export const CommandAction = {
  fetchCommand,
  fetchAllcommandList,
  fetchCommandById,
};

async function fetchCommand(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.imeiCommand;
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

async function fetchAllcommandList(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.commandAll;
    const response = await userService.post(apiEndPoint, payload);
    if (response !== null) {
      return response.data;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function fetchCommandById(payload) {
  try {
    const apiEndPoint = `${config.baseUrl + config.apiName.commandlistById}`;
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
