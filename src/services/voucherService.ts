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
};

export default voucherService;