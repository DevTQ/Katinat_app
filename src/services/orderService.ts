import axiosClient from "../services/axiosClient";

export const createOrder = async (orderData: any) => {
  return await axiosClient.post("/orders", orderData);
};


