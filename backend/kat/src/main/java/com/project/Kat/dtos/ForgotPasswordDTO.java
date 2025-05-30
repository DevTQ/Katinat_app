package com.project.Kat.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data//toString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ForgotPasswordDTO {
    @NotBlank(message = "Số điện thoại không được để trống")
    private String phoneNumber;
}
