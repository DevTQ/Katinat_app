package com.project.Kat.dtos;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import java.util.List;
@Builder
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PermissionsListDTO {
    @JsonProperty("permissions")
    private List<String> permissions;
}
