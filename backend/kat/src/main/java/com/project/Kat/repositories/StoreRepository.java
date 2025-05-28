package com.project.Kat.repositories;
import com.project.Kat.models.Store;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface StoreRepository extends JpaRepository<Store, Long> {
    boolean existsByStoreName(String storeName);
    Page<Store> findAll(Pageable pageable);
}

