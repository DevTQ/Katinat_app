import axiosClient from './axiosClient';
import { Product } from '../models/Product';

const productService = {
  // Lấy danh sách sản phẩm
  getAll: async (): Promise<Product[]> => {
    return await axiosClient.get('/products');
  },

  // Lấy chi tiết sản phẩm
  getById: async (id: string): Promise<Product> => {
    return await axiosClient.get(`/products/${id}`);
  },

  // Tạo sản phẩm mới
  create: async (product: any): Promise<Product> => {
    return await axiosClient.post('/products', product);
  },

  // Cập nhật sản phẩm
  update: async (id: string, product: any): Promise<Product> => {
    return await axiosClient.put(`/products/${id}`, product);
  },

  // Xóa sản phẩm
  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(`/products/${id}`);
  },

  updateOrderStatus: async (orderId: number, status: string): Promise<void> => {
    try {
      await axiosClient.put(`/orders/${orderId}/status`, { status });
      console.log(`Đã cập nhật trạng thái đơn hàng ${orderId} thành ${status}`);
    } catch (error) {
      console.error(`Lỗi khi cập nhật trạng thái đơn hàng ${orderId}:`, error);
      throw error;
    }
  },
};

export default productService;