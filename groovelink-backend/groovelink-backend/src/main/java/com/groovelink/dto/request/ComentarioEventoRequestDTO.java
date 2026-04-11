package com.groovelink.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComentarioEventoRequestDTO {

    @NotNull
    private Long eventoId;

    @NotBlank
    @Size(min = 5, max = 500)
    private String texto;
}