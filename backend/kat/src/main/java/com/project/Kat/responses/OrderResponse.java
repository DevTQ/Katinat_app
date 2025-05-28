package com.project.Kat.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.Kat.models.Order;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderResponse extends BaseResponse {
    private Long orderId;
    private String orderCode;
    private String fullName;
    private String phoneNumber;
    private String storeAddress;
    private String address;
    private String note;
    private String noteShip;
    private LocalDateTime orderDate;
    private LocalDateTime paidAt;
    private LocalDateTime confirmAt;
    private LocalDate shippingDate;
    private String paymentMethod;
    private Float totalMoney;
    private String status;
    private List<OrderDetailResponse> orderDetails;
    private String orderType;
    private Float discountValue;

    public static OrderResponse fromOrder(Order order) {
        OrderResponse orderResponse = OrderResponse.builder()                
                .orderId(order.getOrderId())
                .discountValue(order.getVoucher() != null ? order.getVoucher().getDiscountValue() : null)
                .orderCode(order.getOrderCode())
                .fullName(order.getFullName())
                .phoneNumber(order.getPhoneNumber())
                .storeAddress(order.getStoreAddress())
                .address(order.getAddress())
                .note(order.getNote())
                .noteShip(order.getNoteShip())
                .orderDate(order.getOrderDate())
                .paidAt(order.getPaidAt())
                .confirmAt(order.getConfirmAt())
                .shippingDate(order.getShippingDate())
                .paymentMethod(order.getPaymentMethod())
                .totalMoney(order.getTotalMoney())
                .status(String.valueOf(order.getStatus()))
                .orderDetails(
                        order.getOrderDetails() != null
                                ? order.getOrderDetails().stream()
                                .map(OrderDetailResponse::fromOrderDetail)
                                .collect(Collectors.toList())
                                : null
                )
                .orderType(order.getOrderType())
                .build();

        orderResponse.setCreatedAt(order.getCreatedAt());
        orderResponse.setUpdatedAt(order.getUpdatedAt());
        return orderResponse;
    }
}