package com.project.Kat.services;
import com.project.Kat.dtos.ProductDTO;
import com.project.Kat.dtos.ProductImageDTO;
import com.project.Kat.exceptions.DataNotFoundException;
import com.project.Kat.responses.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.project.Kat.models.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IProductService {
    Product createProduct(ProductDTO productDTO) throws Exception;
    Product getProductById(long id) throws Exception;
    Page<ProductResponse> getAllProducts(PageRequest pageRequest);
    Product updateProduct(long id, ProductDTO productDTO) throws Exception;
    void deleteProduct(long id);
    boolean existsByName(String name);
    ProductImage createProductImage(
            Long productId,
            ProductImageDTO productImageDTO) throws Exception;
    List<Product> getBestSellers();
    List<Product> getTryFoods();
    List<Product> getAll();
    List<Product> searchByName(String searchKey);
}
