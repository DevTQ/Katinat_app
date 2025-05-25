import axiosClient from "src/services/axiosClient";

const voucherService = {
    getVouchers: async (page = 0, limit = 8) => {
        try {
            const response = await axiosClient.get("/vouchers", {
                params: { page, limit },
            });
            return response.data.vouchers;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách vouchers:", error);
            throw error;
        }
    },
    getVoucherById: async (voucherId: string | number) => {
        try {
            const response = await axiosClient.get(`/vouchers/${voucherId}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết voucher", error);
            throw error;
        }
    }
};

export default voucherService;