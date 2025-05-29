package com.project.Kat.controllers;
import com.project.Kat.dtos.*;
import com.project.Kat.models.Product;
import com.project.Kat.responses.ProductListResponse;
import com.project.Kat.responses.ProductResponse;
import com.project.Kat.services.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/products")
@RequiredArgsConstructor
public class ProductController {
    private final IProductService productService;
    @PostMapping("")
    //POST http://localhost:8088/v1/api/products
    public ResponseEntity<?> createProduct(
            @Valid @RequestBody ProductDTO productDTO,
            BindingResult result
    ) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest().body(errorMessages);
            }

            Product newProduct = productService.createProduct(productDTO); // Gọi phương thức mới
            return ResponseEntity.ok(newProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //http://localhost:8088/api/v1/products/6
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(
            @PathVariable("id") Long productId
    ) {
        try {
            Product existingProduct = productService.getProductById(productId);
            return ResponseEntity.ok(ProductResponse.fromProduct(existingProduct));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(String.format("Product with id = %d deleted successfully", id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }


    }
    //update a product
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable long id,
            @RequestBody ProductDTO productDTO) {
        try {
            Product updatedProduct = productService.updateProduct(id, productDTO);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @GetMapping("")
    public ResponseEntity<?> getProducts(
            @RequestParam(name="bestSeller", required=false) Boolean bestSeller,
            @RequestParam(name="tryFood",    required=false) Boolean tryFood,
            @RequestParam(name="page",       required=false) Integer page,
            @RequestParam(name="limit",      required=false) Integer limit
    ) {
        // 1. Filter ưu tiên bestseller / tryFood (không pagination)
        if (Boolean.TRUE.equals(bestSeller)) {
            List<Product> list = productService.getBestSellers();
            List<ProductResponse> dtoList = list.stream()
                    .map(ProductResponse::fromProduct)
                    .toList();
            return ResponseEntity.ok(dtoList);
        }
        if (Boolean.TRUE.equals(tryFood)) {
            List<Product> list = productService.getTryFoods();
            List<ProductResponse> dtoList = list.stream()
                    .map(ProductResponse::fromProduct)
                    .toList();
            return ResponseEntity.ok(dtoList);
        }

        // 2. Nếu có page & limit thì trả về phân trang
        if (page != null && limit != null) {
            PageRequest pageRequest = PageRequest.of(page, limit, Sort.by("productId").descending());
            Page<ProductResponse> productPage = productService.getAllProducts(pageRequest);
            ProductListResponse resp = ProductListResponse.builder()
                    .products(productPage.getContent())
                    .totalPages(productPage.getTotalPages())
                    .build();
            return ResponseEntity.ok(resp);
        }

        // 3. Mặc định: trả về tất cả products (có thể kèm phân trang, ở đây mình trả không phân trang)
        List<Product> all = productService.getAll();
        List<ProductResponse> dtoList = all.stream()
                .map(ProductResponse::fromProduct)
                .toList();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam("productName") String searchKey) {
        List<Product> results = productService.searchByName(searchKey);
        return ResponseEntity.ok(results);
    }
}
