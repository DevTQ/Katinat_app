import axiosClient from "./axiosClient";

const paymentService = {
  createPayment: async ({
    amount,
    orderInfo,
    orderId,
    bankCode,
    language,
  }: {
    amount: number;
    orderInfo: string;
    orderId: string;
    bankCode: string;
    language: string;
  }): Promise<string> => {
    const res = await axiosClient.post("/payments/create_payment_url", {
        amount,
        orderInfo,
        orderId,
        bankCode,
        language,
      });      
    return res.data.data; 
  },
};

export default paymentService;
