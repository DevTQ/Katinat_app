package com.project.Kat.services;

import com.project.Kat.dtos.NotificationDTO;
import com.project.Kat.models.Notification;
import com.project.Kat.models.Order;
import com.project.Kat.models.User;
import com.project.Kat.repositories.NotificationRepository;
import com.project.Kat.repositories.OrderRepository;
import com.project.Kat.repositories.UserRepository;
import com.project.Kat.responses.NotiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotiService implements INotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    @Override
    public Notification createNotification(NotificationDTO dto) {
        try {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            
            Order order = null;
            if (dto.getOrderId() != null) {
                order = orderRepository.findById(dto.getOrderId())
                        .orElseThrow(() -> new IllegalArgumentException("Order not found"));
            }

            Notification notif = Notification.builder()
                    .userId(user)
                    .orderId(order)
                    .title(dto.getTitle())
                    .content(dto.getContent())
                    .type(dto.getType())
                    .build();

            return notificationRepository.save(notif);
        } catch (Exception e) {
            System.err.println("Error creating notification: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }   
    
    @Override
    public NotiResponse getNotificationById(Long id) {
        return notificationRepository.findById(id)
                .map(NotiResponse::fromNoties)
                .orElse(null);
    }

    @Override
    public Page<NotiResponse> getAllNoticesByUser(Long userId, Pageable pageable) {
        // Sử dụng method mới để lấy cả NORMAL notifications và notifications của user
        return notificationRepository
                .findAllPublicOrUserSpecific(userId, pageable)
                .map(NotiResponse::fromNoties);
    }
}
