import axios from "axios";
import authenticationAPI from "./authApi";
import appInfor from "src/utils/appInfor";
import RegisterComponentDTO from "@dtos/registerDTO";
import RegisterScreenDTO from "@dtos/registerScreenDTO";
import LoginDTO from "@dtos/loginDTO";
import axiosClient from "./axiosClient";
import UpdateProfileDTO from "@dtos/UpdateProfileDTO";
import { ChangePassword } from "src/screens";
import changePassword from "@dtos/changePasswordDTO";
import changePasswordDTO from "@dtos/changePasswordDTO";

export const userService = {
  checkPhoneNumber: async (data: RegisterScreenDTO) => {
    return await axios.get(`${appInfor.BASE_URL}/check-phone`, {
      params: { phoneNumber: data.phoneNumber }
    });
  },
  registerUser: async (data: RegisterComponentDTO) => {
    return authenticationAPI.HandleAuthentication("/register", {
      phone_number: data.phoneNumber,
      fullname: data.name,
      gender: data.gender,
      referralCode: data.referralCode,
      password: data.password,
      retype_password: data.confirmPassword,
      role_id: 1
    }, "post");
  },
  loginUser: async (data: LoginDTO) => {
    return authenticationAPI.HandleAuthentication("/login", {
      phone_number: data.phone_number,
      password: data.password,
    }, "post");
  },

  // services/userService.ts
  updateProfile: async (data: UpdateProfileDTO) => {
    return authenticationAPI.HandleAuthentication(
      "/update-profile",
      {
        fullname: data.fullname,
        gender: data.gender,
      },
      "put"
    );
  },

  deleteUser: async (userId: number) => {
    return authenticationAPI.HandleAuthentication(`/delete/${userId}`, null, "delete");
  },

  changePassword: async (data: changePasswordDTO) => {
    return authenticationAPI.HandleAuthentication(
      "/change-password",
      {
        oldPassword: data.old_password,
        newPassword: data.new_password,
      },
      "put"
    );
  },

};
