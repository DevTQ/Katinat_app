package com.project.Kat.controllers;

import com.project.Kat.exceptions.DataNotFoundException;
import com.project.Kat.models.User;
import com.project.Kat.services.IOrderService;
import com.project.Kat.services.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import com.project.Kat.dtos.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.prefix}/users")
@RequiredArgsConstructor
public class UserController {
    private final IUserService userService;
    private final IOrderService orderService;

    @GetMapping("/check-phone")
    public ResponseEntity<?> checkPhoneNumber(@RequestParam String phoneNumber) {
        boolean exists = userService.existsByPhoneNumber(phoneNumber);
        if (exists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Phone number already exists");
        }
        return ResponseEntity.ok("Phone number available");
    }

    @PostMapping("/register")
    // can we register an "admin" user ?
    public ResponseEntity<?> createUser(
            @Valid @RequestBody UserDTO userDTO, @AuthenticationPrincipal User currentUser,
            BindingResult result) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest().body(errorMessages);
            }
            if (!userDTO.getPassword().equals(userDTO.getRetypePassword())) {
                return ResponseEntity.badRequest().body("Password does not match");
            }
            User user = userService.createUser(userDTO, currentUser);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody UserLoginDTO userLoginDTO) {
        try {
            AuthResponse authResponse = userService.login(userLoginDTO.getPhoneNumber(), userLoginDTO.getPassword());
            return ResponseEntity.ok(authResponse);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    AuthResponse.builder()
                            .token(null)
                            .user(null)
                            .role(null)
                            .permissions(null)
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    AuthResponse.builder()
                            .token(null)
                            .user(null)
                            .role(null)
                            .permissions(null)
                            .build());
        }
    }

    // Customer
    @GetMapping("/customer")
    public ResponseEntity<?> getAllCustomer(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "userId") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort.Direction direction = Sort.Direction.fromString(sortDir);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<UserResponseDTO> customerPage = userService.getAllCustomerPaging(pageRequest);

        Map<String, Object> response = new HashMap<>();
        response.put("customers", customerPage.getContent());
        response.put("currentPage", customerPage.getNumber());
        response.put("totalItems", customerPage.getTotalElements());
        response.put("totalPages", customerPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/customer/search")
    public ResponseEntity<List<User>> searchUser(
            @RequestParam("fullName") String searchKey,
            @RequestParam("roles") List<String> roles
    ) {
        List<User> results = userService.searchUserByNameAndRoles(searchKey, roles);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/customer/{id}")
    public ResponseEntity<UserResponseDTO> getCustomerById(@PathVariable Long id) throws DataNotFoundException {
        UserResponseDTO customer = userService.getCustomerById(id);
        return ResponseEntity.ok(customer);
    }

    @PutMapping("/customer/update/{id}")
    public ResponseEntity<?> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody UserResponseDTO userDTO,
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
            UserResponseDTO updatedCustomer = userService.updateCustomer(id, userDTO);
            return ResponseEntity.ok(updatedCustomer);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest request,
            Authentication authentication) {
        String phoneNumber = authentication.getName(); // Giả định username là số điện thoại

        try {
            userService.updateProfile(phoneNumber, request);
            return ResponseEntity.ok("Cập nhật thông tin thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi cập nhật thông tin: " + e.getMessage());
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody ChangePasswordRequest changePasswordRequest,
            Authentication authentication) {

        String phoneNumber = authentication.getName(); // lấy username (số điện thoại) từ token

        try {
            userService.changePassword(phoneNumber, changePasswordRequest.getOldPassword(), changePasswordRequest.getNewPassword());
            return ResponseEntity.ok("Đổi mật khẩu thành công");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    @GetMapping("/order-history/{userId}")
    //GET http://localhost:8088/api/v1/users/order-history/{userId}
    public ResponseEntity<List<OrderHistoryDTO>> getOrderHistoryByUser(@PathVariable Long userId) {
        List<OrderHistoryDTO> orderHistory = orderService.getOrderHistoryByUserId(userId);
        return ResponseEntity.ok(orderHistory);
    }
}
