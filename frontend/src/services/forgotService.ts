import axiosClient from "./axiosClient";

const forgotService = {
    forgotPassword: async (phone_number: string) => {
        const res = await axiosClient.post("/forgot/forgot-password", {
            phoneNumber: phone_number,
        });
        return res.data;
    },
    verifyOTP: async (phone_number: string, code: string) => {
        const res = await axiosClient.post("/forgot/verify-otp", {
            phoneNumber: phone_number,
            code: code,
        });
        return res.data;
    },
    resetPassword: async (phone_number: string, newPassword: string) => {
        const res = await axiosClient.post("/forgot/reset-password", {
            phoneNumber: phone_number,
            newPassword,
        });
        return res.data;
    },
};

export default forgotService;