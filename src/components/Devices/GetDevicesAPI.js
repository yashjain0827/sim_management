import config from "../../config/config";
import { userService } from "../services";

export const DeviceApiAction = {
    checkAvailabilityAPI,
    saveAllDevicesFromBox
}

async function checkAvailabilityAPI(payload, key){

    try{
        const apiEndPoint = `${config.baseUrl}${config.apiName.checkAvailabilityUrl}`;
        const response = await userService.post(apiEndPoint, payload);
        if((response && response.data &&  response.data.responseCode === 200) || response.data.responseCode  === 201) {
            return {
                status: response.data.responseCode,
                message: response.data.message,
                data: response.data.data,
                requestedURI:response?.data?.requestedURI
            };
        } else {
            return { status: 400, message: response?.data?.message, data: null };
        }
    } catch (error) {
        return { status: 400, message: error.message ||"Something Went Wrong", data: null };
    }
}


async function saveAllDevicesFromBox(payload){
    try{
        const apiEndPoint = `${config.baseUrl}${config.apiName.saveBoxDeviceUrl}`;
        const response = await userService.post(apiEndPoint, payload);
        if((response && response.data &&  response.data.responseCode === 200) || response.data.responseCode  === 201) {
            return {
                status: response.data.responseCode,
                message: response.data.message,
                data: response.data.data,
            };
        } else {
            return { status: 400, message: response?.data?.message, data: null };
        }
    } catch (error) {
        return { status: 400, message: error.message ||"Something Went Wrong", data: null };
    }
}