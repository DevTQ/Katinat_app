// src/services/productService.ts
import axiosClient from "./axiosClient";

export interface GetProductsParams {
  page?: number;
  limit?: number;
  bestSeller?: boolean;
  tryFood?: boolean;
}

const productService = {
  getProducts: async (params: GetProductsParams = { page: 0, limit: 8 }) => {
    const response = await axiosClient.get("/products", { params });
    return response;
  },

  getBestSellers: async () => {
    const response = axiosClient.get("/products", { params: { bestSeller: true } });
    return response;
  },

  getTryFood: async () => {
    const response = axiosClient.get("/products", { params: { tryFood: true } });
    return response;
  },

  getProductById: async (productId: number) => {
    const response = await axiosClient.get(`/products/${productId}`);
    return response;
  },

  searchProduct: async (productName: string) => {
    const response = await axiosClient.get("/products/search", {
      params: { productName },
    });
    return response;
  },
};

export default productService;
