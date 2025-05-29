package com.project.Kat.services;
import com.project.Kat.models.OtpVerification;
import com.project.Kat.repositories.OtpVerificationRepository;
import com.project.Kat.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;


@Service
@RequiredArgsConstructor
@Slf4j
public class ForgotPasswordService implements IForgotPasswordService {
    private final OtpVerificationRepository otpRepo;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public String  sendVerificationCode(String phoneNumber) {

        otpRepo.deleteAllByExpiresAtBefore(LocalDateTime.now());
        String code = String.format("%06d", new Random().nextInt(999_999));
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(5);
        OtpVerification otp = otpRepo.findByPhoneNumber(phoneNumber)
                .orElseGet(OtpVerification::new);
        otp.setPhoneNumber(phoneNumber);
        otp.setCode(code);
        otp.setExpiresAt(expiresAt);
        otpRepo.save(otp);
        return code;
    }

    @Override
    @Transactional
    public boolean verifyOtp(String phoneNumber, String code) {
        Optional<OtpVerification> optionalOtp = otpRepo.findByPhoneNumber(phoneNumber);
        if (optionalOtp.isPresent()) {
            OtpVerification otp = optionalOtp.get();
            if (otp.getCode().equals(code) && otp.getExpiresAt().isAfter(LocalDateTime.now())) {
                return true;
            }
        }
        return false;
    }

    @Override
    @Transactional
    public void resetPassword(String phoneNumber, String newPassword) {
        log.info("Resetting password for phone: {}", phoneNumber);
        userRepository.findByPhoneNumber(phoneNumber).ifPresent(user -> {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            log.info("Password reset and saved for user: {}", user.getPhoneNumber());
        });
    }
}

