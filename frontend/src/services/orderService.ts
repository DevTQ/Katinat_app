import axiosClient from "./axiosClient";

const OrderService = {
  createOrder: async (orderData: any) => {
    try {
      const res = await axiosClient.post("/orders", orderData);
      return res;
    }catch(error) {
      console.log(error)
    }
  },

  getOrderByOrderCode: async (orderCode: string) => {
    try {
      const res = await axiosClient.get(`/orders/code/${orderCode}`);
      return res.data;
    } catch (error: any) {
      console.error('Failed to get order by orderCode:', error.response?.data || error.message);
      throw error;
    }
  },
  getOrderByOrderId: async (orderId: number) => {
    try {
      const res = await axiosClient.get(`/orders/${orderId}`);
      return res.data;
    } catch (error: any) {
      console.error('Failed to get order by orderId:', error.response?.data || error.message);
      throw error;
    }
  },
  updateOrderStatus: async (orderCode: string, status: string) => {
    console.log(orderCode);
    console.log(status);
    try {
      const res = await axiosClient.put(`/orders/code/${orderCode}/status`, { status });
      return res.data;
    } catch (error: any) {
      console.error('Failed to update order status:', error.response?.data || error.message);
      throw error;
    }
  },


  
}


export default OrderService;


