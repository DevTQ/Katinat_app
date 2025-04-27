import axiosClient from "../services/axiosClient";

const productService = {
  getProducts: async (page = 0, limit = 8) => {
    try {
      const response = await axiosClient.get("/products", {
        params: { page, limit },
      });
      return response; 
    } catch (error) {
      console.error("Lỗi lấy danh sách sản phẩm:", error);
      throw error;
    }
  },
  getProductById: async (productId: number) => {
    try {
      const response = await axiosClient.get(`/products/${productId}`);
      return response; 
    } catch (error) {
      console.error("Lỗi lấy sản phẩm:", error);
      throw error;
    }
  },
};

export default productService;
