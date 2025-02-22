import axiosClient from "./axiosClient";
import appInfor from "../utils/appInfor";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

    // Hàm lưu token vào AsyncStorage sau khi đăng nhập
    async saveToken(token: string) {
        try {
            await AsyncStorage.setItem("token", token);
            console.log("✅ Token lưu thành công:", token);
        } catch (error) {
            console.error("❌ Lỗi lưu token vào AsyncStorage:", error);
        }
    }

    // Hàm lấy token từ AsyncStorage (Kiểm tra trước khi gọi API)
    async getToken() {
        try {
            const token = await AsyncStorage.getItem("token");
            console.log("🔍 Token hiện tại:", token);
            return token;
        } catch (error) {
            console.error("❌ Lỗi lấy token từ AsyncStorage:", error);
            return null;
        }
    }
}

const authenticationAPI = new AuthAPI();
export default authenticationAPI;
