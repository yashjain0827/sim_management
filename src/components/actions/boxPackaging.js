import config from "../../config/config";
import { userService } from "../services";

export const BoxPackaging = {
  fetchBoxList,
  fetchDeviceByStateId,
  saveBox,
  saveReconfigurationResponse,
  getDevicesByBoxId,
  getAllStatesList,
  UnBoxingDriveces,
  fetchreconfigurecommand,
  fetchExitCommand,
  fetchreconfigureBoxDevicesList,
  fetchBoxDeviceList,
  findDevice,
  saveReconfigureDevice,
  unboxing,
  finishReconfiguration,
  fetchReconfigCommands,
  createBox1,
  addDeviceToBox,
  getDeviceInfoByImeiNo,
};
async function getDeviceInfoByImeiNo(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.getDeviceInfoByImeiNo}`;
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

async function addDeviceToBox(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.addDeviceToBox}`;
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
async function createBox1(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.createBox1}`;
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
async function fetchReconfigCommands(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.reconfigCommands}`;
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
async function findDevice(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.findDevice}`;
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

async function finishReconfiguration(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.finishReconfiguration}`;
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

async function unboxing(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.unboxing}`;
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

async function saveReconfigureDevice(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.saveReconfigureDevice}`;
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
async function saveReconfigurationResponse(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.saveReconfigurationResponse}`;
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
async function fetchBoxList(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.boxListdata}?pageNo=${payload.pageNo}&pageSize=${payload.pageSize}`;
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

async function saveBox(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.createBox}`;
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

async function fetchDeviceByStateId(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.getDeviceById}`;
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

async function getDevicesByBoxId(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.getDeviceByBoxId}?id=${payload.id}`;
    const response = await userService.get(apiEndPoint, payload);
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

async function getAllStatesList(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.stateList}`;
    const response = await userService.get(apiEndPoint, payload);
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

async function UnBoxingDriveces(key) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.unboxingById}?boxId=${key}`;
    const response = await userService.post(apiEndPoint);
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

async function fetchreconfigurecommand(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.reconfigurecommand}`;
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

async function fetchExitCommand(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.reconfigureCommandExist}`;
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

async function fetchreconfigureBoxDevicesList(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.reconfigureboxDeviceList}`;
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

async function fetchBoxDeviceList(payload) {
  try {
    const apiEndPoint = `${config.baseUrl}${config.apiName.boxDeviceList}`;
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
