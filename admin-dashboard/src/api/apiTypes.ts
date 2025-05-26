import { Order } from '../models/order';

export interface GetOrdersResponse {
    orders: Order[];
    totalPages: number;
};

export interface GetOrderByIdResponse {
    order: Order;
};