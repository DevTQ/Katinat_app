import axios from "axios";
import queryString from "query-string";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tạo instance axios
const axiosClient = axios.create({
    paramsSerializer: (params) => queryString.stringify(params),
});

// Interceptor cho request (thêm token vào header)
axiosClient.interceptors.request.use(
    async (config: any) => {
        console.log("📤 Request:", config.method, config.url, config.data);

        try {
            const token = await AsyncStorage.getItem("token"); // Lấy token từ AsyncStorage
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("❌ Lỗi lấy token từ AsyncStorage:", error);
        }

        config.headers = {
            Accept: "application/json",
            ...config.headers,
        };

        return config;
    },
    (error) => {
        console.error("❌ Request Error:", error);
        return Promise.reject(error);
    }
);

// Interceptor cho response (Xử lý lỗi API)
axiosClient.interceptors.response.use(
    (res) => {
        if (res.data && res.status === 200) {
            return res.data;
        }
        throw new Error("Error");
    },
    (error) => {
        console.log(`❌ API Error: ${JSON.stringify(error)}`);
        throw new Error(error.response);
    }
);

export default axiosClient;
