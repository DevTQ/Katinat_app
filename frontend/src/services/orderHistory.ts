import authenticationAPI from "./authApi";
import { OrderHistoryDTOs } from '../dtos/orderHistoryDTO';
import appInfor from "src/utils/appInfor";

export const OrderHistoryService = {
  async getOrderHistoryByUser(userId: string): Promise<OrderHistoryDTOs> {
    const response = await authenticationAPI.HandleAuthentication(
      `/order-history/${userId}`,
      null,
      'get'
    );
    return response.data;  // Lấy data từ response trả về
  }
};
