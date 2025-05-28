package com.project.Kat.repositories;
import com.project.Kat.models.Order;
import com.project.Kat.models.OrderStatus;
import com.project.Kat.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserUserId(Long userId);
    Optional<Order> findByOrderCode(String orderCode);
    Page<Order> findAll(Pageable pageable);
    List<Order> findAllByStatus(OrderStatus status);
    List<Order> findByCreatedAtBetweenAndStatus(LocalDateTime start, LocalDateTime end, OrderStatus status);
    int countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    @Query("SELECT o FROM Order o WHERE o.Active = true ORDER BY o.orderDate DESC")
    List<Order> findTop10ByOrderByOrderDateDesc(Pageable pageable);
}
