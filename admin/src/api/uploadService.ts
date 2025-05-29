import axiosClient from './axiosClient';

const uploadService = {
  uploadImage: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosClient.post('/uploads/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Nếu response là string (URL), trả về luôn
      if (typeof response === 'string') {
        return response;
      }
      // Nếu response.data là string (URL), trả về luôn
      if (response && typeof response.data === 'string') {
        return response.data;
      }

      throw new Error('Không nhận được URL ảnh từ server. Response: ' + JSON.stringify(response));
    } catch (error) {
      console.error('Chi tiết lỗi khi tải ảnh lên:', error);
      throw error;
    }
  }
};

export default uploadService;