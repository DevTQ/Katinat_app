package com.project.Kat.controllers;

import com.project.Kat.dtos.NotificationDTO;
import com.project.Kat.models.Notification;
import com.project.Kat.responses.NotiListResponse;
import com.project.Kat.responses.NotiResponse;
import com.project.Kat.services.INotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/notification")
@RequiredArgsConstructor
public class NotificationController {
    private final INotificationService notificationService;
    @PostMapping("")
    public ResponseEntity<?> createNotification(
            @Valid @RequestBody BindingResult result,
            NotificationDTO notificationDTO) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest().body(errorMessages);
            }
            Notification notification = notificationService.createNotification(notificationDTO);
            return ResponseEntity.ok("nice");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("")
    public ResponseEntity<NotiListResponse> getNoties(
            @RequestParam("page") int page,
            @RequestParam("limit") int limit,
            @RequestParam("userId") Long userId
    ) {
        PageRequest pageRequest = PageRequest.of(page, limit);
        Page<NotiResponse> notiesPage = notificationService.getAllNoticesByUser(userId, pageRequest);
        int totalPages = notiesPage.getTotalPages();
        List<NotiResponse> notices = notiesPage.getContent();
        return ResponseEntity.ok(NotiListResponse
                .builder()
                .notices(notices)
                .totalPages(totalPages)
                .build());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getNotification(@Valid @PathVariable("id") Long id) {
        try {
            NotiResponse notification = notificationService.getNotificationById(id);
            if (notification == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(notification);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
