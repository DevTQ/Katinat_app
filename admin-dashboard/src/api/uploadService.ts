import axiosClient from './axiosClient';

interface UploadResponse {
  data: string;
  status: number;
}

const uploadService = {
  uploadImage: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosClient.post<UploadResponse>('/uploads/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response);

      if (response && typeof response === 'object' && typeof response.data === 'string') {
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