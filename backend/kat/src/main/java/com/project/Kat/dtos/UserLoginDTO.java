package com.project.Kat.dtos;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserLoginDTO {
    @JsonProperty("username")
    @JsonAlias({"email", "phone_number", "phoneNumber"})
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password cannot be blank")
    private String password;
    
    public String getPhoneNumber() {
        return username;
    }
}
