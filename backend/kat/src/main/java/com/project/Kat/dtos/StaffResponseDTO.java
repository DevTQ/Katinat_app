package com.project.Kat.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.Kat.responses.BaseResponse;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StaffResponseDTO {
    private Long id;
    
    @JsonProperty("fullname")
    private String fullName;

    @JsonProperty("phone_number")
    private String phoneNumber;

    @JsonProperty("email")
    private String email;

    @JsonProperty("gender")
    private String gender;
    
    @JsonProperty("role")
    private String role;
    
    @JsonProperty("active")
    private Boolean active;

    @JsonProperty("created_at")
    private String createdAt;

    @JsonProperty("updated_at")
    private String updatedAt;
} 