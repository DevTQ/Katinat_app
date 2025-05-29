package com.project.Kat.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.Kat.dtos.PermissionsListDTO;
import com.project.Kat.dtos.UserResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    @JsonProperty("success")
    private boolean success;
    
    @JsonProperty("message")
    private String message;
    
    @JsonProperty("token")
    private String token;
    
    @JsonProperty("role")
    private String role;

    @JsonProperty("user")
    private UserResponseDTO user;

    @JsonProperty("permission")
    private PermissionsListDTO permissions;


} 