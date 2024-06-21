import axios from "axios";

export const userService = {
  loginService,
  get,
  post,
};

async function loginService(apiEndpoint, payload) {
  try {
    const response = await axios.post(apiEndpoint, payload);
    return response;
  } catch (err) {
    console.log(err);
    return null;
  }
}

function get(apiEndpoint) {
  try {
    return axios.get(apiEndpoint).then((response) => {
      return response;
    });
  } catch (err) {
    console.log(err);
    return err;
  }
}

function post(apiEndpoint, payload) {
  try {
    return axios.post(apiEndpoint, payload, getOptions).then((response) => {
      return response;
    });
  } catch (err) {
    console.log(err);
    return err;
  }
}

function getOptions() {
  // debugger;
  let options = {};
  if (JSON.parse(localStorage.getItem("data")).token) {
    options.headers = {
      ContentType: "multipart/form-data",
    };
  }

  return options;
}
