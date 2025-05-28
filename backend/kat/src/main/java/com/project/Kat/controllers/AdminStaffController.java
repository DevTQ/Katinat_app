package com.project.Kat.controllers;

import com.project.Kat.dtos.StaffDTO;
import com.project.Kat.dtos.StaffResponseDTO;
import com.project.Kat.exceptions.DataNotFoundException;
import com.project.Kat.models.User;
import com.project.Kat.services.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.prefix}/admin/staff")
@RequiredArgsConstructor
public class AdminStaffController {
    private final IUserService userService;

    @GetMapping("")
    public ResponseEntity<?> getAllStaff(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "userId") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort.Direction direction = Sort.Direction.fromString(sortDir);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<StaffResponseDTO> staffPage = userService.getAllStaffPaging(pageRequest);
        
        Map<String, Object> response = new HashMap<>();
        response.put("staff", staffPage.getContent());
        response.put("currentPage", staffPage.getNumber());
        response.put("totalItems", staffPage.getTotalElements());
        response.put("totalPages", staffPage.getTotalPages());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/list")
    public ResponseEntity<List<StaffResponseDTO>> getStaffList() {
        List<StaffResponseDTO> staffList = userService.getAllStaff();
        return ResponseEntity.ok(staffList);
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUser(@RequestParam("fullName") String searchKey,
                                                 @RequestParam("roles") List<String> roles) {
        List<User> results = userService.searchUserByNameAndRoles(searchKey, roles);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StaffResponseDTO> getStaffById(@PathVariable Long id) throws DataNotFoundException {
        StaffResponseDTO staff = userService.getStaffById(id);
        return ResponseEntity.ok(staff);
    }

    @PostMapping("")
    public ResponseEntity<?> createStaff(
            @Valid @RequestBody StaffDTO staffDTO,
            BindingResult result
    ) {
        try {
            // Kiểm tra lỗi validation
            if (result.hasErrors()) {
                Map<String, String> errors = new HashMap<>();
                for (FieldError error : result.getFieldErrors()) {
                    errors.put(error.getField(), error.getDefaultMessage());
                }
                return ResponseEntity.badRequest().body(errors);
            }
            
            StaffResponseDTO createdStaff = userService.createStaff(staffDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdStaff);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateStaff(
            @PathVariable Long id,
            @Valid @RequestBody StaffDTO staffDTO,
            BindingResult result
    ) {
        try {
            // Kiểm tra lỗi validation
            if (result.hasErrors()) {
                Map<String, String> errors = new HashMap<>();
                for (FieldError error : result.getFieldErrors()) {
                    errors.put(error.getField(), error.getDefaultMessage());
                }
                return ResponseEntity.badRequest().body(errors);
            }
            
            StaffResponseDTO updatedStaff = userService.updateStaff(id, staffDTO);
            return ResponseEntity.ok(updatedStaff);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStaff(@PathVariable Long id) {
        try {
            userService.deleteStaff(id);
            return ResponseEntity.ok().body("Staff deleted successfully");
        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStaffStatus(
            @PathVariable Long id,
            @RequestParam boolean active
    ) {
        try {
            StaffResponseDTO updatedStaff = userService.updateStaffStatus(id, active);
            return ResponseEntity.ok(updatedStaff);
        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 