package com.project.Kat.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import jakarta.validation.constraints.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Data//toString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDTO {
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Name must be between 3 and 200 characters")
    private String name;

    @Min(value = 0, message = "Price must be greater than or equal to 0")
    @Max(value = 10000000, message = "Price must be less than or equal to 10,000,000")
    private BigDecimal price;

    private String image;

    private String description;

    @JsonProperty("category_id")
    private Long categoryId;

    @JsonProperty("is_best_seller")
    private Boolean isBestSeller = false;

    @JsonProperty("is_try_food")
    private Boolean isTryFood = false;
}
