import AsyncStorage from "@react-native-async-storage/async-storage";

class TokenService {
  static async setToken(token: string) {
    try {
        console.log("Lưu token vào AsyncStorage:", token);
        await AsyncStorage.setItem("token", token);
        console.log("Lưu token thành công!");
      } catch (error) {
        console.error("Lỗi khi lưu token:", error);
      }
  }

  static async getToken() {
    try {
        const token = await AsyncStorage.getItem("token");
        return token;
      } catch (error) {
        console.error("Lỗi khi lấy token:", error);
        return null;
      }
  }

  static async removeToken() {
    await AsyncStorage.removeItem("token");
  }
}

export default TokenService;
