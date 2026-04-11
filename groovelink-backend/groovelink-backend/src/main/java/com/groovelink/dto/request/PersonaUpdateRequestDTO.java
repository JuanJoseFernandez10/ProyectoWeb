package com.groovelink.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PersonaUpdateRequestDTO {

    @Size(max = 500, message = "La descripción no puede superar los 500 caracteres")
    private String descripcion;

    private boolean premium;
}