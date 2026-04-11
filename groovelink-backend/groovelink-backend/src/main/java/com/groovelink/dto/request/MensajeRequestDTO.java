package com.groovelink.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MensajeRequestDTO {

    @NotNull
    private Long chatId;

    @NotBlank
    private String contenido;
}