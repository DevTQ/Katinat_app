package com.project.Kat.controllers;

import com.project.Kat.components.VNPayConfig;
import com.project.Kat.components.VNPayUtils;
import com.project.Kat.dtos.payment.PaymentDTO;
import com.project.Kat.dtos.payment.PaymentQueryDTO;
import com.project.Kat.dtos.payment.PaymentRefundDTO;
import com.project.Kat.exceptions.DataNotFoundException;
import com.project.Kat.models.Order;
import com.project.Kat.models.OrderStatus;
import com.project.Kat.repositories.OrderRepository;
import com.project.Kat.responses.ResponseObject;
import com.project.Kat.services.OrderService;
import com.project.Kat.services.vnpay.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/payments")
public class PaymentController {

    private final VNPayService vnPayService;
    private final VNPayUtils vnPayUtils;
    private final VNPayConfig vnPayConfig;
    private final OrderService orderService;
    private final OrderRepository orderRepository;

    @PostMapping("/create_payment_url")
    public ResponseEntity<ResponseObject> createPayment(@RequestBody PaymentDTO paymentRequest, HttpServletRequest request) {
        try {

            String paymentUrl = vnPayService.createPaymentUrl(paymentRequest, request);
            return ResponseEntity.ok(ResponseObject.builder()
                    .status(HttpStatus.OK)
                    .message("Payment URL generated successfully.")
                    .data(paymentUrl)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseObject.builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .message("Error generating payment URL: " + e.getMessage())
                            .build());
        }
    }

    @PostMapping("/query")
    public ResponseEntity<ResponseObject> queryTransaction(@RequestBody PaymentQueryDTO paymentQueryDTO, HttpServletRequest request) {
        try {
            String result = vnPayService.queryTransaction(paymentQueryDTO, request);
            return ResponseEntity.ok(ResponseObject.builder()
                    .status(HttpStatus.OK)
                    .message("Query successful")
                    .data(result)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ResponseObject.builder()
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .message("Error querying transaction: " + e.getMessage())
                    .build());
        }
    }

    @PostMapping("/refund")
    public ResponseEntity<ResponseObject> refundTransaction(
            @Valid @RequestBody PaymentRefundDTO paymentRefundDTO,
            BindingResult result) {
        if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(ResponseObject.builder()
                    .message(String.join(", ", errorMessages))
                    .status(HttpStatus.BAD_REQUEST)
                    .data(null)
                    .build());
        }

        try {
            String response = vnPayService.refundTransaction(paymentRefundDTO);
            return ResponseEntity.ok().body(ResponseObject.builder()
                    .message("Refund processed successfully")
                    .status(HttpStatus.OK)
                    .data(response)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ResponseObject.builder()
                    .message("Failed to process refund: " + e.getMessage())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .data(null)
                    .build());
        }
    }

    @GetMapping("/payment-callback")
    public void paymentCallback(@RequestParam Map<String, String> params,
                                HttpServletResponse response,
                                HttpServletRequest request) throws IOException, DataNotFoundException {
        String receivedSecureHash = params.remove("vnp_SecureHash");

        SortedMap<String, String> sortedParams = new TreeMap<>(params);
        StringBuilder hashData = new StringBuilder();
        for (Map.Entry<String, String> entry : sortedParams.entrySet()) {
            if (entry.getValue() != null && !entry.getValue().isEmpty()) {
                if (hashData.length() > 0) {
                    hashData.append('&');
                }
                hashData.append(entry.getKey()).append('=')
                        .append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII));
            }
        }

        String calculatedHash = vnPayUtils.hmacSHA512(vnPayConfig.getSecretKey(), hashData.toString());
        if (!calculatedHash.equalsIgnoreCase(receivedSecureHash)) {
            String redirectUrl = buildRedirectUrl("payment-failed", "invalid_signature", null);
            System.out.println("Redirecting to: " + redirectUrl);
            response.sendRedirect(redirectUrl);
            return;
        }

        String responseCode = params.get("vnp_ResponseCode");
        String orderCode = params.get("vnp_TxnRef");
        try {
            Order order = orderRepository.findByOrderCode(orderCode)
                    .orElseThrow(() -> new DataNotFoundException("Order not found for code: " + orderCode));

            if ("00".equals(responseCode)) {
                orderService.updateOrderByOrderCode(orderCode, OrderStatus.PAID);
                String redirectUrl = buildRedirectUrl("payment-success", null, order.getOrderCode());
                System.out.println("Redirecting to: " + redirectUrl);
                response.sendRedirect(redirectUrl);
            } else {
                orderService.updateOrderByOrderCode(orderCode, OrderStatus.FAILED);
                String redirectUrl = buildRedirectUrl("payment-failed", null, order.getOrderCode());
                System.out.println("Redirecting to: " + redirectUrl);
                response.sendRedirect(redirectUrl);
            }
        } catch (NumberFormatException e) {
            String redirectUrl = buildRedirectUrl("payment-failed", "invalid_order_id", null);
            System.out.println("Redirecting to: " + redirectUrl);
            response.sendRedirect(redirectUrl);
        }
    }

    @GetMapping("/payment-success")
    public ResponseEntity<Void> handlePaymentSuccess(@RequestParam(required = false) Long orderCode) {
        if (orderCode != null) {

        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/payment-failed")
    public ResponseEntity<Void> handlePaymentFailed(
            @RequestParam(required = false) Long orderCode,
            @RequestParam(required = false) String reason) {
        if (orderCode != null) {

        }
        return ResponseEntity.ok().build();
    }

    private String buildRedirectUrl(String path, String extraParam, String orderCode) {
        String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().toUriString();
        StringBuilder redirectUrl = new StringBuilder(baseUrl);
        redirectUrl.append("/api/v1/payments/").append(path);

        boolean hasQuery = false;
        if (orderCode != null) {
            redirectUrl.append("?orderCode=").append(orderCode);
            hasQuery = true;
        }
        if (extraParam != null) {
            redirectUrl.append(hasQuery ? "&" : "?").append("reason=").append(extraParam);
        }

        return redirectUrl.toString();
    }
}