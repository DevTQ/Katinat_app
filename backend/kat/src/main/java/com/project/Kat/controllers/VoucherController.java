package com.project.Kat.controllers;
import com.project.Kat.dtos.VoucherDTO;
import com.project.Kat.models.Store;
import com.project.Kat.models.Voucher;
import com.project.Kat.responses.VoucherListResponse;
import com.project.Kat.responses.VoucherResponse;
import com.project.Kat.services.VoucherService;
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
@RequestMapping("${api.prefix}/vouchers")
@RequiredArgsConstructor
public class VoucherController {
    private final VoucherService voucherService;
    @PostMapping("")
    public ResponseEntity<?> createVoucher(
            @Valid @RequestBody VoucherDTO voucherDTO,
            BindingResult result
    ) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest().body(errorMessages);
            }
            Voucher newVoucher = voucherService.createVoucher(voucherDTO);
            return ResponseEntity.ok(newVoucher);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("")
    public ResponseEntity<VoucherListResponse> getVochers(
            @RequestParam("page")     int page,
            @RequestParam("limit")    int limit
    ) {
        // Tạo Pageable từ thông tin trang và giới hạn
        PageRequest pageRequest = PageRequest.of(
                page, limit);
        Page<VoucherResponse> vocherPage = voucherService.getAllVouchers(pageRequest);
        // Lấy tổng số trang
        int totalPages = vocherPage.getTotalPages();
        List<VoucherResponse> vochers = vocherPage.getContent();
        return ResponseEntity.ok(VoucherListResponse
                .builder()
                .vouchers(vochers)
                .totalPages(totalPages)
                .build());
    }

    @GetMapping("/{voucherId}")
    public ResponseEntity<?> getVoucherById(
            @PathVariable("voucherId") Long voucherId
    ) {
        try {
            Voucher voucherExisting = voucherService.getVoucherById(voucherId);
            return ResponseEntity.ok(VoucherResponse.fromVoucher(voucherExisting));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }
}
