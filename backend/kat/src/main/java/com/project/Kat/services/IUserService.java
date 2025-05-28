package com.project.Kat.services;

import com.project.Kat.dtos.*;
import com.project.Kat.exceptions.DataNotFoundException;
import com.project.Kat.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface IUserService {
    boolean existsByPhoneNumber(String phoneNumber);
    User createUser(UserDTO userDTO, User currentUser) throws Exception;
    AuthResponse login(String username, String password) throws Exception;
    
    // Staff management methods
    List<StaffResponseDTO> getAllStaff();
    Page<StaffResponseDTO> getAllStaffPaging(Pageable pageable);
    StaffResponseDTO getStaffById(Long id) throws DataNotFoundException;
    StaffResponseDTO createStaff(StaffDTO staffDTO) throws Exception;
    StaffResponseDTO updateStaff(Long id, StaffDTO staffDTO) throws Exception;
    void deleteStaff(Long id) throws DataNotFoundException;
    StaffResponseDTO updateStaffStatus(Long id, boolean active) throws DataNotFoundException;

    // customer management methods
    List<UserResponseDTO> getAllCustomer();
    Page<UserResponseDTO> getAllCustomerPaging(Pageable pageable);
    UserResponseDTO getCustomerById(Long id) throws DataNotFoundException;

    List<User> searchUserByNameAndRoles(String searchKey, List<String> roles);
    UserResponseDTO updateCustomer(Long id, UserResponseDTO userResponseDTO) throws Exception;

    int countNewCustomersForDate(LocalDateTime date);

    void updateProfile(String phoneNumber, UpdateProfileRequest request);
    void changePassword(String phoneNumber, String oldPassword, String newPassword);
}
