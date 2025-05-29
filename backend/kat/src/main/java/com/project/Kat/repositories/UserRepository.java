package com.project.Kat.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.project.Kat.models.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByPhoneNumber(String phoneNumber);
    Optional<User> findByPhoneNumber(String phoneNumber);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.role.name IN :roleNames")
    List<User> findByRoleNameIn(@Param("roleNames") List<String> roleNames);
    
    @Query("SELECT u FROM User u WHERE u.role.name IN :roleNames")
    Page<User> findByRoleNameIn(@Param("roleNames") List<String> roleNames, Pageable pageable);

    List<User> findByFullNameContainingIgnoreCaseAndRole_NameIn(String fullName, List<String> roles);
    int countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}

