package com.groovelink.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CambiarPasswordRequestDTO {
    @NotBlank
    private String passwordActual;

    @NotBlank
    @Size(min = 6, max = 100)
    private String nuevaPassword;
}
