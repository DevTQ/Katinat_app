package com.project.Kat.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalTime;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import lombok.*;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class StoreDTO {
    @JsonProperty("store_name")
    @NotBlank(message = "store name is require")
    private String storeName;

    private String image;

    @JsonProperty("store_address")
    private String storeAddress;

    @JsonProperty("opening_hours")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime openingHours;

    @JsonProperty("closing_time")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime closingTime;
}
