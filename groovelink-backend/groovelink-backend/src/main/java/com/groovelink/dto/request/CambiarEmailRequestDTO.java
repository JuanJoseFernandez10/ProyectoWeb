package com.groovelink.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CambiarEmailRequestDTO {
    @NotBlank
    @Email
    private String email;
}
