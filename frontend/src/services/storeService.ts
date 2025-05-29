import axiosClient from "src/services/axiosClient";

const storeService = {
    getStores: async (page = 0, limit = 8) => {
        try {
            const response = await axiosClient.get("/stores", {
                params: { page, limit },
            });
            return response.data.stores;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách cửa hàng:", error);
            throw error;
        }
    },
    getStoreById: async (storeId: number) => {
        try {
            const response = await axiosClient.get(`/stores/${storeId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching store data:", error);
            throw error;
        }
    },
};

export default storeService;