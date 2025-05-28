package com.project.Kat.responses;

import com.project.Kat.models.Order;
import lombok.*;

import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderStatusResponse {
    private String orderCode;
    private String status;

    public static OrderStatusResponse fromOrder(Order order) {
        return OrderStatusResponse.builder()
                .orderCode(order.getOrderCode())
                .status(String.valueOf(order.getStatus()))
                .build();
    }
}
