package com.project.Kat.services;

import com.project.Kat.models.Order;
import com.project.Kat.models.OrderStatus;
import com.project.Kat.repositories.OrderRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderAutoCancelService {

    private final OrderRepository orderRepository;

    public OrderAutoCancelService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // Chạy mỗi 5 phút (cron: "0 */5 * * * *")
    @Scheduled(cron = "0 */5 * * * *")
    @Transactional
    public void cancelPendingOrders() {
        List<Order> pendingOrders = orderRepository.findAllByStatus(OrderStatus.PENDING);
        LocalDateTime now = LocalDateTime.now();
        for (Order order : pendingOrders) {
            if (order.getOrderDate().plusMinutes(12).isBefore(now)) {
                order.setStatus(OrderStatus.CANCELLED);
                orderRepository.save(order);
            }
        }
    }
}
