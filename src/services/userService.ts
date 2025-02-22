import axios from "axios";
import authenticationAPI from "./authApi";
import appInfor from "src/utils/appInfor";

export const userService = {
  checkPhoneNumber: async (phoneNumber: string) => {
    return await axios.get(`${appInfor.BASE_URL}/check-phone`, { params: { phoneNumber } });
  },
  registerUser: async (data: {
    phoneNumber: string;
    name: string;
    gender: string;
    referralCode?: string;
    password: string;
    confirmPassword: string;
}) => {
    return authenticationAPI.HandleAuthentication("/register", {
        phone_number: data.phoneNumber,
        fullname: data.name,
        gender: data.gender,
        referralCode: data.referralCode,
        password: data.password,
        retype_password: data.confirmPassword,
        role_id: 1
    }, "post");
}
};