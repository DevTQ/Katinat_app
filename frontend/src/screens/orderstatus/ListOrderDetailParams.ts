type ListOrderDetailParams =
    | { orderId: number; orderCode?: never }
    | { orderCode: string; orderId?: never };