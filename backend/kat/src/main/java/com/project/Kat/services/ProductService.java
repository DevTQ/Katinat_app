package com.project.Kat.services;

import com.project.Kat.dtos.ProductDTO;
import com.project.Kat.dtos.ProductImageDTO;
import com.project.Kat.exceptions.DataNotFoundException;
import com.project.Kat.exceptions.InvalidParamException;
import com.project.Kat.models.Category;
import com.project.Kat.models.Product;
import com.project.Kat.models.ProductImage;
import com.project.Kat.repositories.CategoryRepository;
import com.project.Kat.repositories.ProductImageRepository;
import com.project.Kat.repositories.ProductRepository;
import com.project.Kat.responses.ProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService implements IProductService{
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;
    private final IUploadImageFile uploadImageFile;
    @Override
    public Product createProduct(ProductDTO productDTO)
            throws DataNotFoundException, IOException {
        Category existingCategory = categoryRepository
                .findById(productDTO.getCategoryId())
                .orElseThrow(() -> new DataNotFoundException(
                        "Cannot find category with id: " + productDTO.getCategoryId()));

        Product newProduct = Product.builder()
                .name(productDTO.getName())
                .price(productDTO.getPrice().setScale(3))
                .image(productDTO.getImage())
                .description(productDTO.getDescription())
                .category(existingCategory)
                .isBestSeller(productDTO.getIsBestSeller() != null ? productDTO.getIsBestSeller() : false)
                .isTryFood(productDTO.getIsTryFood() != null ? productDTO.getIsTryFood() : false)
                .build();

        return productRepository.save(newProduct);
    }

    @Override
    public Product getProductById(long productId) throws Exception {
        return productRepository.findById(productId).
                orElseThrow(()-> new DataNotFoundException(
                        "Cannot find product with id ="+productId));
    }

    @Override
    public Page<ProductResponse> getAllProducts(PageRequest pageRequest) {
        // Lấy danh sách sản phẩm theo trang(page) và giới hạn(limit)
        return productRepository
                .findAll(pageRequest)
                .map(ProductResponse::fromProduct);
    }

    @Override
    public Product updateProduct(
            long id,
            ProductDTO productDTO
    )
            throws Exception {
        Product existingProduct = getProductById(id);
        if(existingProduct != null) {
            //copy các thuộc tính từ DTO -> Product
            //Có thể sử dụng ModelMapper
            Category existingCategory = categoryRepository
                    .findById(productDTO.getCategoryId())
                    .orElseThrow(() ->
                            new DataNotFoundException(
                                    "Cannot find category with id: "+productDTO.getCategoryId()));
            existingProduct.setName(productDTO.getName());
            existingProduct.setCategory(existingCategory);
            existingProduct.setPrice(productDTO.getPrice());
            existingProduct.setDescription(productDTO.getDescription());
            existingProduct.setImage(productDTO.getImage());
            existingProduct.setIsBestSeller(productDTO.getIsBestSeller() != null ? 
                                           productDTO.getIsBestSeller() : false);
            existingProduct.setIsTryFood(productDTO.getIsTryFood() != null ? 
                                        productDTO.getIsTryFood() : false);
            return productRepository.save(existingProduct);
        }
        return null;

    }

    @Override
    public void deleteProduct(long id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        optionalProduct.ifPresent(productRepository::delete);
    }

    @Override
    public boolean existsByName(String name) {
        return productRepository.existsByName(name);
    }
    @Override
    public ProductImage createProductImage(
            Long productId,
            ProductImageDTO productImageDTO) throws Exception {
        Product existingProduct = productRepository
                .findById(productId)
                .orElseThrow(() ->
                        new DataNotFoundException(
                                "Cannot find product with id: "+productImageDTO.getProductId()));
        ProductImage newProductImage = ProductImage.builder()
                .product(existingProduct)
                .imageUrl(productImageDTO.getImageUrl())
                .build();
        //Ko cho insert quá 5 ảnh cho 1 sản phẩm
        int size = productImageRepository.findByProductProductId(productId).size();
        if(size >= ProductImage.MAXIMUM_IMAGES_PER_PRODUCT) {
            throw new InvalidParamException(
                    "Number of images must be <= "
                    +ProductImage.MAXIMUM_IMAGES_PER_PRODUCT);
        }
        return productImageRepository.save(newProductImage);
    }

    @Override
    public List<Product> getBestSellers() {
        return productRepository.findByIsBestSellerTrue();
    }

    @Override
    public List<Product> getTryFoods() {
        return productRepository.findByIsTryFoodTrue();
    }

    @Override
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public List<Product> searchByName(String productName) {
        return productRepository.findByNameContainingIgnoreCase(productName);
    }
}
