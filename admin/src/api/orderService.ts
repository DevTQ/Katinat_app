import axiosClient from './axiosClient';
import { GetOrdersResponse } from './apiTypes';
import { Order } from '../models/order';

const orderService = {
    getOrders: async (page: number = 0, limit: number = 10): Promise<GetOrdersResponse> => {
      return await axiosClient.get('/orders', {
        params: { page, limit },
      });
    },
    getOrderById: async (id: number): Promise<Order> => {
      return await axiosClient.get(`/orders/${id}`);
    },
    createOrder: async (orderData: any) => {
      return await axiosClient.post('/orders', orderData);
    },
    updateOrder: async (id: string, orderData: any) => {
      return await axiosClient.put(`/orders/${id}`, orderData);
    },
    deleteOrder: async (id: string) => {
      return await axiosClient.delete(`/orders/${id}`);
    },
  };

export default orderService;

export const confirmOrder = async (orderId: number): Promise<void> => {
  try {
    await axiosClient.put(`/orders/${orderId}/status`, { status: 'ORDER_CONFIRMED' });
    console.log(`Đơn hàng ${orderId} đã được xác nhận.`);
  } catch (error) {
    console.error(`Lỗi khi xác nhận đơn hàng ${orderId}:`, error);
    throw error;
  }
};

export const rejectOrder = async (orderId: number): Promise<void> => {
  try {
    await axiosClient.put(`/orders/${orderId}/status`, { status: 'REJECTED' });
    console.log(`Đơn hàng ${orderId} đã bị từ chối.`);
  } catch (error) {
    console.error(`Lỗi khi từ chối đơn hàng ${orderId}:`, error);
    throw error;
  }
};

export const readyOrder = async (orderId: number): Promise<void> => {
  try {
    await axiosClient.put(`/orders/${orderId}/status`, { status: 'READY' });
    console.log(`Đơn hàng ${orderId} đã được chuẩn bị xong.`);
  } catch (error) {
    console.error(`Lỗi khi chuẩn bị đơn hàng ${orderId}:`, error);
    throw error;
  }
};