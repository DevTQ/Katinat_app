package com.project.Kat.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class VoucherDTO {
    @JsonProperty("voucher_name")
    @NotBlank(message = "Voucher name không được để trống")
    private String VoucherName;

    private String image;

    @NotBlank(message = "Type không được để trống")
    private String type;

    @JsonProperty("discount_value")
    @NotNull(message = "Discount value không được để trống")
    @Min(value = 0, message = "Discount value phải lớn hơn hoặc bằng 0")
    private Float discountValue;

    @JsonProperty("conditions")
    private List<String> conditions;

    @JsonProperty("end_date")
    @NotNull(message = "End date không được để trống")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ssXXX")
    private OffsetDateTime endDate;
}
