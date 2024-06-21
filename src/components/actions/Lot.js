import { userService } from "../services";
import config from "../../config/config";
import axios from "axios";
export const LotAction = {
  getLotList,
  getAllDeviceModal,
  getDeviceModalCongif,
  getCommandCheckList,
  addLot,
  saveCommand,
  saveTestedDevice,
  rejectDevice,
  updateClientCommand,
  fetchLotDevicesList,
  commandTrail,
  emsMaster
};
async function emsMaster(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.emsMaster;
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

async function rejectDevice(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.rejectDevice;
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
async function saveTestedDevice(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.saveTestedDevice;
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
async function saveCommand(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.saveCommand;
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

async function addLot(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.addLot;
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
async function getCommandCheckList(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.getCommandCheckList;
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

async function getDeviceModalCongif(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.getDeviceModalCongif;
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
async function getLotList(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.getLotList;
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

async function getAllDeviceModal(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.getAllDeviceModal;
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


async function updateClientCommand(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.upfateClierntCoommand;
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


async function fetchLotDevicesList(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.lotDevicesList;
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
async function commandTrail(payload) {
  try {
    const apiEndPoint = config.baseUrl + config.apiName.commandTrail;
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