import axios from "axios";
import queryString from "query-string";
import TokenService from "../services/tokenService";
import appInfor from "../utils/appInfor";


const axiosClient = axios.create({
    baseURL: appInfor.BASE_URL, 
    paramsSerializer: (params) => queryString.stringify(params),
  });


  axiosClient.interceptors.request.use(
    async (config: any) => {
  
      console.log(`Request: ${config.method?.toUpperCase()} ${config.url}}`);
      
      try {
        const token = await TokenService.getToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Lỗi lấy token từ AsyncStorage:", error);
      }
  
      config.headers.Accept = "application/json";
      return config;
    },
    (error) => {
      console.error("Request Error:", error);
      return Promise.reject(error);
    }
  );  
  
  axiosClient.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response) {
            console.error(`API Error:`, error.response.status, error.response.data);
            if (error.response.status === 400 && error.response.data?.token) {
                return Promise.reject({ response: { data: { message: "Tài khoản hoặc mật khẩu không chính xác!" } } });
            }
        }
        return Promise.reject(error);
    }
);
export default axiosClient;
