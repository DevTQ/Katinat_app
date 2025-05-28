package com.project.Kat.services;

import com.project.Kat.dtos.NotificationDTO;
import com.project.Kat.models.Notification;
import com.project.Kat.responses.NotiResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface INotificationService {
    Notification createNotification(NotificationDTO notificationDTO);    NotiResponse getNotificationById(Long id);
    Page<NotiResponse> getAllNoticesByUser(Long userId, Pageable pageable);
}
