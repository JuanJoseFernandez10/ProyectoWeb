package com.groovelink.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class FotoEventoResponseDTO {

    private Long id;
    private String descripcion;
    private Integer orden;
    private LocalDateTime fechaSubida;
    // private String fotoBase64;   // o URL si usas cloud storage
}