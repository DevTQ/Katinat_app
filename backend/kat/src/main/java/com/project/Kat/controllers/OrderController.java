package com.project.Kat.controllers;

import com.project.Kat.dtos.*;
import com.project.Kat.exceptions.DataNotFoundException;
import com.project.Kat.models.Order;
import com.project.Kat.models.OrderStatus;
import com.project.Kat.responses.*;
import com.project.Kat.services.IOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.prefix}/orders")
@RequiredArgsConstructor
public class OrderController {
    private final IOrderService orderService;

    @PostMapping("")
    public ResponseEntity<?> createOrder(
            @Valid @RequestBody OrderDTO orderDTO,
            BindingResult result) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest().body(errorMessages);
            }
            Order order = orderService.createOrder(orderDTO);
            OrderResponse orderResponse = OrderResponse.fromOrder(order);
            return ResponseEntity.ok(orderResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{user_id}")
    // GET http://localhost:8088/api/v1/orders/user/4
    public ResponseEntity<?> getOrders(@Valid @PathVariable("user_id") Long userId) {
        try {
            List<Order> orders = orderService.findByUserId(userId);
            List<OrderResponse> orderResponses = orders.stream()
                    .map(OrderResponse::fromOrder)
                    .toList();
            return ResponseEntity.ok(orderResponses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET http://localhost:8088/api/v1/orders/2 
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@Valid @PathVariable("id") Long orderId) {
        try {
            Order existingOrder = orderService.getOrder(orderId);
            if (existingOrder == null) {
                return ResponseEntity.notFound().build();
            }
            OrderResponse orderResponse = OrderResponse.fromOrder(existingOrder);
            return ResponseEntity.ok(orderResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("")
    public ResponseEntity<OrderListResponse> getOrders(
            @RequestParam("page") int page,
            @RequestParam("limit") int limit) {
        // Tạo Pageable từ thông tin trang và giới hạn
        PageRequest pageRequest = PageRequest.of(
                page, limit);
        Page<OrderResponse> orderPages = orderService.getAllOrders(pageRequest);
        // Lấy tổng số trang
        int totalPages = orderPages.getTotalPages();
        List<OrderResponse> orders = orderPages.getContent();
        return ResponseEntity.ok(OrderListResponse
                .builder()
                .orders(orders)
                .totalPages(totalPages)
                .build());
    }

    @GetMapping("/code/{orderCode}")
    public ResponseEntity<?> getOrderByOrderCode(@Valid @PathVariable("orderCode") String orderCode) {
        try {
            Order existingOrderOrderCode = orderService.getOrderByOrderCode(orderCode);
            if (existingOrderOrderCode == null) {
                return ResponseEntity.notFound().build();
            }
            OrderResponse orderResponse = OrderResponse.fromOrder(existingOrderOrderCode);
            return ResponseEntity.ok(orderResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(
            @Valid @PathVariable long id,
            @Valid @RequestBody OrderDTO orderDTO) {

        try {
            Order order = orderService.updateOrder(id, orderDTO);
            if (order == null) {
                return ResponseEntity.notFound().build();
            }
            OrderResponse orderResponse = OrderResponse.fromOrder(order);
            return ResponseEntity.ok(orderResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@Valid @PathVariable Long id) {
        // xóa mềm => cập nhật trường active = false
        orderService.deleteOrder(id);
        return ResponseEntity.ok("Order deleted successfully.");
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            // Lấy trạng thái từ payload
            String statusString = request.get("status");
            if (statusString == null || statusString.isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }

            OrderStatus status = OrderStatus.valueOf(statusString.toUpperCase());
            Order updatedOrder = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/status/{orderCode}")
    public ResponseEntity<OrderStatusResponse> getOrderStatus(@PathVariable String orderCode) {
        Order order = orderService.getOrderByOrderCode(orderCode);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(OrderStatusResponse.fromOrder(order));
    }

    @PutMapping("/code/{orderCode}/status")
    public ResponseEntity<Order> updateOrderStatusByOrderCode(
            @PathVariable String orderCode,
            @RequestBody Map<String, String> request) {
        try {
            // Lấy trạng thái từ payload
            String statusString = request.get("status");
            if (statusString == null || statusString.isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }

            OrderStatus status = OrderStatus.valueOf(statusString.toUpperCase());
            Order updatedOrder = orderService.updateOrderByOrderCode(orderCode, status);

            if (status == OrderStatus.COMPLETED || status == OrderStatus.CANCELLED) {
                orderService.finishOrder(orderCode, status);
            }
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
