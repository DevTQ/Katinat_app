package com.project.Kat.services;

import com.project.Kat.dtos.OrderStatusUpdate;
import com.project.Kat.models.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final SimpMessagingTemplate messagingTemplate;

    public void notifyOrderStatus(Order order) {
        // Payload chứa orderCode (String) và status
        OrderStatusUpdate update = new OrderStatusUpdate(order.getOrderCode(), order.getStatus());

        // 1) Log lại để kiểm tra
        System.out.println("Gửi WebSocket message tới: /topic/orders/" + order.getOrderCode());

        // 2) Gửi theo user nếu cần
        if (order.getUser() != null) {
            messagingTemplate.convertAndSendToUser(
                    order.getUser().getUserId().toString(),
                    "/queue/order-status",
                    update
            );
        }

        // 3) Gửi theo orderCode (cho client subscribe dễ dàng)
        messagingTemplate.convertAndSend(
                "/topic/orders/" + order.getOrderCode(),
                update
        );
    }
}

