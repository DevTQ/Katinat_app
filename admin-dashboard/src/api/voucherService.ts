import axiosClient from './axiosClient';
import { Voucher } from "../models/vouchers";

const VoucherService = {  getAll: async (page: number = 0, limit: number = 10): Promise<any> => {
    return await axiosClient.get(`/vouchers?page=${page}&limit=${limit}`);
  },

  // Lấy chi tiết sản phẩm
  getById: async (id: number): Promise<Voucher> => {
    return await axiosClient.get(`/vouchers/${id}`);
  },

  // Tạo sản phẩm mới
  create: async (voucher: any): Promise<Voucher> => {
    return await axiosClient.post('/vouchers', voucher);
  },

  // Cập nhật sản phẩm
  update: async (id: number, product: any): Promise<Voucher> => {
    return await axiosClient.put(`/vouchers/${id}`, product);
  },

  // Xóa sản phẩm
  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/vouchers/${id}`);
  },
}

export default VoucherService;
