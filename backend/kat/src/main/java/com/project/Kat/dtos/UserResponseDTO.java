package com.project.Kat.dtos;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    @JsonProperty("id")
    private Long id;

    @JsonProperty("email")
    private String email;

    @JsonProperty("phone_number")
    private String phoneNumber;

    @JsonProperty("fullname")
    private String fullName;

    @JsonProperty("role")
    private String role;

    private String gender;

    private Boolean active;

    @JsonProperty("created_at")
    private String createdAt;
}
