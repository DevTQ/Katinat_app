package com.project.Kat.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.Kat.models.Notification;
import com.project.Kat.models.NotificationType;
import com.project.Kat.models.Order;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotiResponse extends BaseResponse {
    private Long id;
    private String title;
    private String content;
    private Long orderId;
    private NotificationType type;

    public static NotiResponse fromNoties(Notification notification) {
        NotiResponse notiResponse = NotiResponse.builder()
                .id(notification.getNotificationId())
                .title(notification.getTitle())
                .content(notification.getContent())
                .type(notification.getType())
                .orderId(notification.getOrderId() != null ? notification.getOrderId().getOrderId() : null)
                .build();
        notiResponse.setCreatedAt(notification.getCreatedAt());
        notiResponse.setUpdatedAt(notification.getUpdatedAt());
        return notiResponse;
    }
}
