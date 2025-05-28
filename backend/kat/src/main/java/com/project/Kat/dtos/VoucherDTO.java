package com.project.Kat.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
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
    private String VoucherName;
    private String image;
    private String type;
    @JsonProperty("discount_value")
    private Float discountValue;
    @JsonProperty("conditions")
    private List<String> conditions;
    @JsonProperty("end_date")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm", timezone = "UTC")
    private OffsetDateTime endDate;
}
