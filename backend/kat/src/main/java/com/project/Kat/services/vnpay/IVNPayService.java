package com.project.Kat.services.vnpay;

import com.project.Kat.dtos.payment.PaymentDTO;
import com.project.Kat.dtos.payment.PaymentQueryDTO;
import com.project.Kat.dtos.payment.PaymentRefundDTO;
import com.project.Kat.exceptions.DataNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
public interface IVNPayService {
    String createPaymentUrl(PaymentDTO paymentRequest, HttpServletRequest request) throws DataNotFoundException;
    String queryTransaction(PaymentQueryDTO paymentQueryDTO, HttpServletRequest request) throws IOException;
    String refundTransaction(PaymentRefundDTO refundDTO) throws IOException;
}
