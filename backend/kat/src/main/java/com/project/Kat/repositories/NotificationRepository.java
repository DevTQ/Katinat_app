package com.project.Kat.repositories;

import com.project.Kat.models.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Tìm notification theo userId
    Page<Notification> findByUserId_UserId(Long userId, Pageable pageable);

    // Tìm tất cả notification type NORMAL hoặc notification của user cụ thể 
    @Query("SELECT n FROM Notification n WHERE n.type = 'NORMAL' OR n.userId.userId = ?1")
    Page<Notification> findAllPublicOrUserSpecific(Long userId, Pageable pageable);
}
