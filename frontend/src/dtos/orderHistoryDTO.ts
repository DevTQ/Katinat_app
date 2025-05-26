export interface OrderHistoryDTO {
  id: string;
  storeName: string;
  amount: string;
  paymentMethod: string;
  itemCount: number;
  time: string;
  status: string;
  orderType: string;
}

export type OrderHistoryDTOs = OrderHistoryDTO[];
