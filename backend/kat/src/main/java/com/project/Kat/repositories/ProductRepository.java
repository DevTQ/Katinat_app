package com.project.Kat.repositories;

import com.project.Kat.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.*;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByName(String name);
    Page<Product> findAll(Pageable pageable);//phân trang
    List<Product> findByIsBestSellerTrue();
    List<Product> findByIsTryFoodTrue();
    List<Product> findByNameContainingIgnoreCase(String SearchKey);
}
