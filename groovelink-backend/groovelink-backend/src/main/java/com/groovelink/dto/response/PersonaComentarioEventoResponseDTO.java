package com.groovelink.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PersonaComentarioEventoResponseDTO {

    private Long id;
    private String texto;
    private Integer megustas;
    private LocalDateTime fecha;
    private String usuarioUsername;
}