package com.project.Kat.services;

import com.project.Kat.dtos.OrderDTO;
import com.project.Kat.dtos.OrderHistoryDTO;
import com.project.Kat.exceptions.DataNotFoundException;
import com.project.Kat.models.Order;
import com.project.Kat.models.OrderStatus;
import com.project.Kat.responses.OrderResponse;
import com.project.Kat.responses.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.List;

public interface IOrderService {
    Order createOrder(OrderDTO orderDTO) throws Exception;
    Order getOrder(Long id);
    Order updateOrder(Long id, OrderDTO orderDTO) throws DataNotFoundException;
    void deleteOrder(Long id);
    List<Order> findByUserId(Long userId);
    Order getOrderByOrderCode(String orderCode);
    Page<OrderResponse> getAllOrders(PageRequest pageRequest);
    Order updateOrderStatus(Long orderId, OrderStatus status) throws DataNotFoundException;
    Order updateOrderByOrderCode(String orderCode, OrderStatus status) throws DataNotFoundException;
    Order finishOrder(String orderCode, OrderStatus status) throws Exception;
    double calculateRevenueForDate(LocalDateTime date);
    int countOrdersForDate(LocalDateTime date);
    int countProductsSoldForDate(LocalDateTime date);
    List<OrderHistoryDTO> getOrderHistoryByUserId(Long userId);
}
