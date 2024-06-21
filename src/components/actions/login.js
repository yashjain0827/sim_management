import {userService} from "../services";
import config from "../../config/config";
import axios from "axios";

export const LoginAction = {
    fetchLoginData,
}


async function fetchLoginData(payload){
    try{
        const apiEndPoint = config.baseUrl + config.apiName.login;
        const response = await userService.loginService(apiEndPoint,payload);
        if(response){
            return response.data
        }
        else{
            return null;
        }
    }
    catch(err){
        console.log(err);
        return null;
    }
}