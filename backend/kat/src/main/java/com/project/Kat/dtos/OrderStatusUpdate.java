package com.project.Kat.dtos;

import com.project.Kat.models.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderStatusUpdate {
    private String orderCode;
    private OrderStatus status;
}
