package com.project.Kat.dtos.payment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDTO {

    @JsonProperty("orderId")
    private Long orderId; // ID đơn hàng (dùng để tìm orderCode)

    @JsonProperty("amount")
    private Long amount; // Số tiền cần thanh toán

    @JsonProperty("bankCode")
    private String bankCode; // Mã ngân hàng

    @JsonProperty("language")
    private String language; // Ngôn ngữ giao diện thanh toán (vd: "vn", "en")
}
