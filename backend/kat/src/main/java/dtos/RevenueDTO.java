package com.project.Kat.dtos;
import lombok.*;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RevenueDTO {
    private String date;
    private Double value;
}
