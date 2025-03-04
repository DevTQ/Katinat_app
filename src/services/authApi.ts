import axiosClient from "./axiosClient";
import appInfor from "../utils/appInfor";


class AuthAPI {
  HandleAuthentication = async (
    url: string,
    data?: any,
    method: "get" | "post" | "put" | "delete" = "get"
  ) => {
    return await axiosClient({
      url: `${appInfor.BASE_URL}/users${url}`,
      method,
      params: method === "get" ? data : undefined,
      data: method !== "get" ? data : undefined,
    });
  };
  
}

const authenticationAPI = new AuthAPI();
export default authenticationAPI;
