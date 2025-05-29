export interface Order {
    orderId: number;
    orderCode: string | null;
    fullName: string;
    phoneNumber: string;
    storeAddress: string;
    address: string;
    note: string;
    noteShip: string;
    orderDate: Date; 
    shippingDate: number[]; 
    paymentMethod: string;
    totalMoney: number;
    active: boolean;
    voucher: {
        id: number;
        voucherName: string;
        discount: number;
    },
    orderDetails: {
        orderDetailId: number;
        order_id: number;
        product: {
            name: string;
            image: string;
        };
        price: number;
        numberOfProducts: number;
        totalMoney: number;
    }[];
    status: string;
}