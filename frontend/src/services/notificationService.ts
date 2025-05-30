import axiosClient from "./axiosClient";

const NotificationService = {
    getAllNotificationByUser: async (userId: number, page = 0, limit = 10) => {
        try {
            const res = await axiosClient.get("/notification", {
                params: {userId, page, limit}
            });
            return res.data.notices;
        }catch(error) {
            console.log("Lỗi khi lấy danh sách thông báo: ", error);
            throw error;
        }
    },

    getNotiById: async (notiId: number) => {
        try {
            const res = await axiosClient.get(`/notification/${notiId}`)
            return res.data;
        } catch(error) {
            console.log("Lỗi khi lấy thông báo: ", error);
            throw error;
        }
    }
}

export default NotificationService;