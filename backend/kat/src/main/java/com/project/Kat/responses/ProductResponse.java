package com.project.Kat.responses;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.Kat.models.Product;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductResponse extends BaseResponse {
    private Long productId;
    private String name;
    private BigDecimal price;
    private String image;
    private String description;

    @JsonProperty("category_id")
    private Long categoryId;
    private String categoryName;

    public static ProductResponse fromProduct(Product product) {
        ProductResponse productResponse = ProductResponse.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .price(product.getPrice().setScale(3))
                .image(product.getImage())
                .description(product.getDescription())
                .categoryId(product.getCategory().getCategoryId())
                .categoryName(product.getCategory().getName())
                .build();
        productResponse.setCreatedAt(product.getCreatedAt());
        productResponse.setUpdatedAt(product.getUpdatedAt());
        return productResponse;
    }
}
