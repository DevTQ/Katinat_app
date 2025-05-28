package com.project.Kat.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    @JsonProperty("token")
    private String token;

    @JsonProperty("user")
    private UserResponseDTO user;

    @JsonProperty("role")
    private String role;

    @JsonProperty("permissions")
    private PermissionsListDTO permissions;
}
