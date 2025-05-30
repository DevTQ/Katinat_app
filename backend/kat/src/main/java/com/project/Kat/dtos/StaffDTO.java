package com.project.Kat.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class StaffDTO {
    private Long id;
    
    @JsonProperty("fullname")
    @NotBlank(message = "Fullname is required")
    private String fullName;

    @JsonProperty("phone_number")
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^(\\+84|0)[3|5|7|8|9][0-9]{8}$", message = "Phone number is invalid")
    private String phoneNumber;

    @JsonProperty("email")
    @Email(message = "Email is invalid")
    private String email;

    @JsonProperty("gender")
    @NotBlank(message = "Gender is required")
    private String gender;

    @JsonProperty("role_id")
    @NotNull(message = "Role ID is required")
    private Long roleId;
    
    @JsonProperty("password")
    private String password;
    
    @JsonProperty("active")
    private Boolean active;
} 