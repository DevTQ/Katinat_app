package com.project.Kat.models;

public enum OrderStatus {
    PENDING,           // Chờ thanh toán
    FAILED,            // Thanh toán thất bại
    PAID,              // Đã thanh toán
    ORDER_CONFIRMED,    // Xác nhận đơn hàng
    READY,
    REJECTED,           // Đã xác nhận đơn
    SHIPPING,           // Đang giao hàng
    COMPLETED,          // Đã hoàn tất
    CANCELLED           // Đã hủy đơn hàng
}
