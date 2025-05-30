package com.project.Kat.dtos;

import com.project.Kat.models.NotificationType;
import com.project.Kat.models.Order;
import com.project.Kat.models.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {
    private Long userId;
    private Long orderId;
    private String title;
    private String content;
    private NotificationType type;
}
