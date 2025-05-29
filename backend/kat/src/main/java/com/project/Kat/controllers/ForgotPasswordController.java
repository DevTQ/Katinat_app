package com.project.Kat.controllers;

import com.project.Kat.dtos.ForgotPasswordDTO;
import com.project.Kat.dtos.ResetPasswordDTO;
import com.project.Kat.dtos.VerifyOtpDTO;
import com.project.Kat.services.ForgotPasswordService;
import com.project.Kat.services.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/forgot")
@RequiredArgsConstructor
public class ForgotPasswordController {
    private final ForgotPasswordService forgotPasswordService;
    private final IUserService userService;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordDTO forgotPasswordDTO) {
        String phoneNumber = forgotPasswordDTO.getPhoneNumber();
        boolean exists = userService.existsByPhoneNumber(phoneNumber);
        if (!exists) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Số điện thoại chưa được đăng ký");
        }
        forgotPasswordService.sendVerificationCode(phoneNumber);
        return ResponseEntity.ok(forgotPasswordService.sendVerificationCode(forgotPasswordDTO.getPhoneNumber()));
    }


    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody VerifyOtpDTO verifyOtpDTO) {
        boolean isValid = forgotPasswordService.verifyOtp(verifyOtpDTO.getPhoneNumber(), verifyOtpDTO.getCode());
        if (isValid) {
            return ResponseEntity.ok().body(200);
        } else {
            return ResponseEntity.badRequest().body("Mã OTP không hợp lệ hoặc đã hết hạn");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordDTO resetPasswordDTO) {
        forgotPasswordService.resetPassword(resetPasswordDTO.getPhoneNumber(), resetPasswordDTO.getNewPassword());
        return ResponseEntity.ok().body("Mật khẩu đã được thay đổi thành công");
    }
}
