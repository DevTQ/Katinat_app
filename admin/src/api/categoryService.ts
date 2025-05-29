import axiosClient from './axiosClient';

const categoryService = {
  getCategories: async (page = 1, limit = 10) => {
    return await axiosClient.get(`/categories?page=${page}&limit=${limit}`);
  },
  getCategoryById: async (id: string) => {
    return await axiosClient.get(`/categories/${id}`); 
  },
  createCategory: async (categoryData: any) => {
    return await axiosClient.post('/categories', categoryData); 
  },
  updateCategory: async (id: string, categoryData: any) => {
    return await axiosClient.put(`/categories/${id}`, categoryData);
  },
  deleteCategory: async (id: string) => {
    return await axiosClient.delete(`/categories/${id}`);
  },
};

export default categoryService;