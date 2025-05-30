package com.project.Kat.dtos;
import lombok.*;
@Data//toString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryStatsDTO {
    private String category;
    private Integer value;
}
