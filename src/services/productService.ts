import axiosClient from "../services/axiosClient";

const productService = {
  getProductById: async (productId: string) => {
    try {
      const response = await axiosClient.get(`/products/${productId}`);
      return response.data; 
    } catch (error) {
      console.error("Lỗi lấy sản phẩm:", error);
      throw error;
    }
  },
};

export default productService;
