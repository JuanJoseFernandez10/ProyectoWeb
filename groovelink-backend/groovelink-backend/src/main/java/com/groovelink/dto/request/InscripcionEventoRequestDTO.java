package com.groovelink.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InscripcionEventoRequestDTO {

    @NotNull(message = "El ID del evento es obligatorio")
    private Long eventoId;
}