package com.project.Kat.services;
import com.project.Kat.dtos.PermissionsListDTO;
import com.project.Kat.components.JwtTokenUtil;
import com.project.Kat.dtos.AuthResponse;
import com.project.Kat.dtos.StaffDTO;
import com.project.Kat.dtos.StaffResponseDTO;
import com.project.Kat.dtos.UpdateProfileRequest;
import com.project.Kat.dtos.UserDTO;
import com.project.Kat.dtos.UserResponseDTO;
import com.project.Kat.exceptions.DataNotFoundException;
import com.project.Kat.exceptions.PermissionDenyException;
import com.project.Kat.models.*;
import com.project.Kat.repositories.RoleRepository;
import com.project.Kat.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static java.rmi.server.LogStream.log;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final AuthenticationManager authenticationManager;
    private final ModelMapper modelMapper;
    private final IRoleService roleService;

    // Định dạng ngày tháng cho response
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public boolean existsByPhoneNumber(String phoneNumber) {
        return userRepository.existsByPhoneNumber(phoneNumber);
    }

    @Override
    public User createUser(UserDTO userDTO, @AuthenticationPrincipal User currentUser) throws Exception {
        String phoneNumber = userDTO.getPhoneNumber();
        if (userRepository.existsByPhoneNumber(phoneNumber)) {
            throw new DataIntegrityViolationException("Phone number already exists");
        }
        Role role = roleRepository.findById(userDTO.getRoleId())
                .orElseThrow(() -> new DataNotFoundException("Role not found"));

        String roleName = role.getName().toUpperCase();

        // Kiểm tra quyền tạo role
        if (roleName.equals("ADMIN") || roleName.equals("MANAGER")) {
            if (currentUser == null || !currentUser.hasRole("ADMIN")) {
                throw new PermissionDenyException("Only admin can create admin/manager account");
            }
        } else if (roleName.equals("STAFF")) {
            if (currentUser == null || !(currentUser.hasRole("ADMIN") || currentUser.hasRole("MANAGER"))) {
                throw new PermissionDenyException("Only admin or manager can create staff account");
            }
        } else if (roleName.equals("USER")) {
            // Cho phép public đăng ký tài khoản USER
            // Nếu muốn chỉ cho phép khi chưa đăng nhập, kiểm tra currentUser == null
        } else {
            throw new DataNotFoundException("Invalid role");
        }

        // convert from userDTO => user
        User newUser = User.builder()
                .fullName(userDTO.getFullName())
                .phoneNumber(userDTO.getPhoneNumber())
                .password(userDTO.getPassword())
                .gender(userDTO.getGender())
                .referralCode(userDTO.getReferralCode())
                .active(true)
                .build();

        newUser.setRole(role);

        String password = userDTO.getPassword();
        String encodedPassword = passwordEncoder.encode(password);
        newUser.setPassword(encodedPassword);
        return userRepository.save(newUser);
    }

    @Override
    public AuthResponse login(String username, String password) throws Exception {
        Optional<User> optionalUser;

        // 1. Phân biệt email hay số điện thoại
        if (username.contains("@")) {
            optionalUser = userRepository.findByEmail(username);
            if (optionalUser.isEmpty()) {
                throw new DataNotFoundException("Invalid email/password");
            }
        } else {
            optionalUser = userRepository.findByPhoneNumber(username);
            if (optionalUser.isEmpty()) {
                throw new DataNotFoundException("Invalid phone number/password");
            }
        }

        User user = optionalUser.get();

        // 2. Kiểm tra mật khẩu
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        // 3. Xác thực qua AuthenticationManager (nếu cần)
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                user.getUsername(), password, user.getAuthorities());
        authenticationManager.authenticate(authenticationToken);

        // 4. Phân quyền đúng cách
        String roleName = user.getRole().getName();

        if (username.contains("@") && !Role.ADMIN.equals(roleName)) {
            throw new PermissionDenyException("Only admins can login using email");
        }

        if (!username.contains("@") && Role.ADMIN.equals(roleName)) {
            throw new PermissionDenyException("Admin must login using email");
        }

        // 5. Sinh JWT token
        String token = jwtTokenUtil.generateToken(user);

        UserResponseDTO userResponseDTO = UserResponseDTO.builder()
                .id(user.getUserId())
                .phoneNumber(user.getPhoneNumber())
                .fullName(user.getFullName())
                .gender(user.getGender())
                .email(user.getEmail())
                .build();
        List<String> permissions = roleService.getPermissionsByRole(roleName);
        PermissionsListDTO permissionsDTO = PermissionsListDTO.builder()
                .permissions(permissions)
                .build();

        return AuthResponse.builder()
                .token(token)
                .role(roleName)
                .permissions(permissionsDTO)
                .user(userResponseDTO)
                .build();
    }

    @Override
    public List<StaffResponseDTO> getAllStaff() {
        List<User> staffUsers = userRepository.findByRoleNameIn(List.of(Role.STAFF, Role.MANAGER));
        List<StaffResponseDTO> staffResponseDTOs = new ArrayList<>();

        for (User user : staffUsers) {
            StaffResponseDTO staffResponseDTO = mapUserToStaffResponseDTO(user);
            staffResponseDTOs.add(staffResponseDTO);
        }

        return staffResponseDTOs;
    }

    @Override
    public List<UserResponseDTO> getAllCustomer() {
        List<User> Users = userRepository.findByRoleNameIn(List.of(Role.USER));
        List<UserResponseDTO> UserResponseDTOs = new ArrayList<>();

        for (User user : Users) {
            UserResponseDTO userResponseDTO = mapUserToCustomerResponseDTO(user);
            UserResponseDTOs.add(userResponseDTO);
        }

        return UserResponseDTOs;
    }

    @Override
    public Page<UserResponseDTO> getAllCustomerPaging(Pageable pageable) {
        Page<User> customers = userRepository.findByRoleNameIn(List.of(Role.USER), pageable);
        return customers.map(this::mapUserToCustomerResponseDTO);
    }

    @Override
    public UserResponseDTO getCustomerById(Long id) throws DataNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Staff not found with id: " + id));

        // Kiểm tra nếu user không phải là nhân viên hoặc quản lý
        if (!user.getRole().getName().equals(Role.USER)) {
            throw new DataNotFoundException("User is not a staff or manager");
        }

        return mapUserToCustomerResponseDTO(user);
    }

    @Override
    public Page<StaffResponseDTO> getAllStaffPaging(Pageable pageable) {
        Page<User> staffUsers = userRepository.findByRoleNameIn(List.of(Role.STAFF, Role.MANAGER), pageable);
        return staffUsers.map(this::mapUserToStaffResponseDTO);
    }

    @Override
    public StaffResponseDTO getStaffById(Long id) throws DataNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Staff not found with id: " + id));

        // Kiểm tra nếu user không phải là nhân viên hoặc quản lý
        if (!user.getRole().getName().equals(Role.STAFF) && !user.getRole().getName().equals(Role.MANAGER)) {
            throw new DataNotFoundException("User is not a staff or manager");
        }

        return mapUserToStaffResponseDTO(user);
    }

    @Override
    @Transactional
    public StaffResponseDTO createStaff(StaffDTO staffDTO) throws Exception {
        // Kiểm tra số điện thoại đã tồn tại chưa
        if (userRepository.existsByPhoneNumber(staffDTO.getPhoneNumber())) {
            throw new DataIntegrityViolationException("Phone number already exists");
        }

        // Kiểm tra email nếu có
        if (staffDTO.getEmail() != null && !staffDTO.getEmail().isEmpty() &&
                userRepository.existsByEmail(staffDTO.getEmail())) {
            throw new DataIntegrityViolationException("Email already exists");
        }

        // Kiểm tra vai trò
        Role role = roleRepository.findById(staffDTO.getRoleId())
                .orElseThrow(() -> new DataNotFoundException("Role not found"));

        // Chỉ cho phép tạo STAFF hoặc MANAGER
        if (!role.getName().equals(Role.STAFF) && !role.getName().equals(Role.MANAGER)) {
            throw new PermissionDenyException("You can only create STAFF or MANAGER accounts");
        }

        // Tạo user mới
        User newStaff = User.builder()
                .fullName(staffDTO.getFullName())
                .phoneNumber(staffDTO.getPhoneNumber())
                .email(staffDTO.getEmail())
                .gender(staffDTO.getGender())
                .active(staffDTO.getActive() != null ? staffDTO.getActive() : true)
                .build();

        newStaff.setRole(role);

        // Mã hóa mật khẩu
        String password = staffDTO.getPassword();
        if (password == null || password.isEmpty()) {
            // Tạo mật khẩu mặc định nếu không có
            password = "Staff@" + staffDTO.getPhoneNumber().substring(staffDTO.getPhoneNumber().length() - 4);
        }
        newStaff.setPassword(passwordEncoder.encode(password));

        User savedStaff = userRepository.save(newStaff);
        return mapUserToStaffResponseDTO(savedStaff);
    }

    @Override
    @Transactional
    public StaffResponseDTO updateStaff(Long id, StaffDTO staffDTO) throws Exception {
        User existingStaff = userRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Staff not found with id: " + id));

        // Kiểm tra nếu user không phải là nhân viên hoặc quản lý
        if (!existingStaff.getRole().getName().equals(Role.STAFF) &&
                !existingStaff.getRole().getName().equals(Role.MANAGER)) {
            throw new DataNotFoundException("User is not a staff or manager");
        }

        // Kiểm tra số điện thoại nếu thay đổi
        if (!existingStaff.getPhoneNumber().equals(staffDTO.getPhoneNumber()) &&
                userRepository.existsByPhoneNumber(staffDTO.getPhoneNumber())) {
            throw new DataIntegrityViolationException("Phone number already exists");
        }

        // Kiểm tra email nếu thay đổi
        if (staffDTO.getEmail() != null && !staffDTO.getEmail().isEmpty() &&
                !staffDTO.getEmail().equals(existingStaff.getEmail()) &&
                userRepository.existsByEmail(staffDTO.getEmail())) {
            throw new DataIntegrityViolationException("Email already exists");
        }

        // Cập nhật thông tin
        existingStaff.setFullName(staffDTO.getFullName());
        existingStaff.setPhoneNumber(staffDTO.getPhoneNumber());
        existingStaff.setEmail(staffDTO.getEmail());
        existingStaff.setGender(staffDTO.getGender());

        // Cập nhật vai trò nếu thay đổi
        if (staffDTO.getRoleId() != null) {
            Role role = roleRepository.findById(staffDTO.getRoleId())
                    .orElseThrow(() -> new DataNotFoundException("Role not found"));

            // Chỉ cho phép cập nhật thành STAFF hoặc MANAGER
            if (!role.getName().equals(Role.STAFF) && !role.getName().equals(Role.MANAGER)) {
                throw new PermissionDenyException("You can only update to STAFF or MANAGER roles");
            }

            existingStaff.setRole(role);
        }

        // Cập nhật trạng thái active nếu có
        if (staffDTO.getActive() != null) {
            existingStaff.setActive(staffDTO.getActive());
        }

        User updatedStaff = userRepository.save(existingStaff);
        return mapUserToStaffResponseDTO(updatedStaff);
    }

    @Override
    @Transactional
    public void deleteStaff(Long id) throws DataNotFoundException {
        User staff = userRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Staff not found with id: " + id));

        // Kiểm tra nếu user không phải là nhân viên hoặc quản lý
        if (!staff.getRole().getName().equals(Role.STAFF) &&
                !staff.getRole().getName().equals(Role.MANAGER)) {
            throw new DataNotFoundException("User is not a staff or manager");
        }

        userRepository.deleteById(id);
    }

    @Override
    @Transactional
    public StaffResponseDTO updateStaffStatus(Long id, boolean active) throws DataNotFoundException {
        User staff = userRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Staff not found with id: " + id));

        // Kiểm tra nếu user không phải là nhân viên hoặc quản lý
        if (!staff.getRole().getName().equals(Role.STAFF) &&
                !staff.getRole().getName().equals(Role.MANAGER)) {
            throw new DataNotFoundException("User is not a staff or manager");
        }

        staff.setActive(active);
        User updatedStaff = userRepository.save(staff);
        return mapUserToStaffResponseDTO(updatedStaff);
    }

    // Helper method để chuyển đổi từ User sang StaffResponseDTO
    private StaffResponseDTO mapUserToStaffResponseDTO(User user) {
        return StaffResponseDTO.builder()
                .id(user.getUserId())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .email(user.getEmail())
                .gender(user.getGender())
                .role(user.getRole().getName())
                .active(user.isActive())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().format(formatter) : null)
                .updatedAt(user.getUpdatedAt() != null ? user.getUpdatedAt().format(formatter) : null)
                .build();
    }

    private UserResponseDTO mapUserToCustomerResponseDTO(User user) {
        return UserResponseDTO.builder()
                .id(user.getUserId())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .email(user.getEmail())
                .gender(user.getGender())
                .role(user.getRole().getName())
                .active(user.isActive())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().format(formatter) : null)
                .build();
    }

    @Override
    public List<User> searchUserByNameAndRoles(String fullName, List<String> roles) {
        return userRepository.findByFullNameContainingIgnoreCaseAndRole_NameIn(fullName, roles);
    }

    @Override
    public UserResponseDTO updateCustomer(Long id, UserResponseDTO userDTO) throws Exception {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("User not found with id: " + id));

        // Kiểm tra nếu user không phải là khách hàng
        if (!existingUser.getRole().getName().equals(Role.USER)) {
            throw new DataNotFoundException("User is not a customer");
        }

        // Cập nhật thông tin
        existingUser.setFullName(userDTO.getFullName());
        existingUser.setPhoneNumber(userDTO.getPhoneNumber());
        existingUser.setEmail(userDTO.getEmail());
        existingUser.setGender(userDTO.getGender());

        // Cập nhật mật khẩu nếu có
        existingUser.setActive(userDTO.getActive());

        User updatedUser = userRepository.save(existingUser);
        return mapUserToCustomerResponseDTO(updatedUser);
    }

    @Override
    public int countNewCustomersForDate(LocalDateTime date) {
        LocalDateTime endDate = date.plusDays(1);
        return userRepository.countByCreatedAtBetween(date, endDate);
    }

    @Override
    public void updateProfile(String phoneNumber, UpdateProfileRequest request) {
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        user.setFullName(request.getFullname());
        user.setGender(request.getGender());

        userRepository.save(user);
    }

    @Override
    public void changePassword(String phoneNumber, String oldPassword, String newPassword) {
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu cũ không đúng");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
