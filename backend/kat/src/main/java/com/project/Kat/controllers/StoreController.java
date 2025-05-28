package com.project.Kat.controllers;
import com.project.Kat.dtos.StoreDTO;
import com.project.Kat.models.Store;
import com.project.Kat.responses.StoreListResponse;
import com.project.Kat.responses.StoreResponse;
import com.project.Kat.services.StoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/stores")
@RequiredArgsConstructor
public class StoreController {
    private final StoreService storeService;
    @PostMapping("")
    public ResponseEntity<?> createStore(
        @Valid @RequestBody StoreDTO storeDTO,
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
            Store newStore = storeService.createStore(storeDTO);
            return ResponseEntity.ok(newStore);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("")
    public ResponseEntity<StoreListResponse> getStores(
            @RequestParam("page")     int page,
            @RequestParam("limit")    int limit
    ) {
        // Tạo Pageable từ thông tin trang và giới hạn
        PageRequest pageRequest = PageRequest.of(
                page, limit);
        Page<StoreResponse> storePage = storeService.getAllStores(pageRequest);
        // Lấy tổng số trang
        int totalPages = storePage.getTotalPages();
        List<StoreResponse> stores = storePage.getContent();
        return ResponseEntity.ok(StoreListResponse
                .builder()
                .stores(stores)
                .totalPages(totalPages)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStoreById(
            @PathVariable("id") Long storeId
    ) {
        try {
            Store storeExisting = storeService.getStoreById(storeId);
            return ResponseEntity.ok(StoreResponse.fromStore(storeExisting));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }
}
