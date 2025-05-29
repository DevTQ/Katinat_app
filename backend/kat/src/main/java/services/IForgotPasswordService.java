package com.project.Kat.services;

public interface IForgotPasswordService {
    String sendVerificationCode(String phoneNumber);
    boolean verifyOtp(String phoneNumber, String code);
    void resetPassword(String phoneNumber, String newPassword);
}
