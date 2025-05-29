package com.project.Kat.repositories;

import com.project.Kat.models.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {
    Optional<OtpVerification> findByPhoneNumber(String phoneNumber);
    void deleteByPhoneNumber(String phoneNumber);
    void deleteAllByExpiresAtBefore(LocalDateTime time);
}
