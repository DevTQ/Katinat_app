package com.project.Kat.dtos;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderHistoryDTO {
    private String id;
    private String storeName;
    private String amount;
    private String paymentMethod;
    private int itemCount;
    private String time;
    private String status;
    private String orderType;
}
