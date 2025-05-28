package com.project.Kat.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.project.Kat.models.Store;
import com.project.Kat.models.Voucher;
import lombok.*;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VoucherResponse {
    private Long voucherId;
    private String voucherName;
    private String image;
    private String type;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm", timezone = "UTC")
    private OffsetDateTime endDate;
    private List<String> conditions;
    private Float discount;

    public static VoucherResponse fromVoucher(Voucher voucher) {
        VoucherResponse voucherResponse = VoucherResponse.builder()
                .voucherId(voucher.getVoucherId())
                .voucherName(voucher.getVoucherName())
                .image(voucher.getImage())
                .type(voucher.getType())
                .endDate(voucher.getEndDate())
                .discount(voucher.getDiscountValue())
                .conditions(voucher.getConditions())
                .build();
        return voucherResponse;
    }

}
