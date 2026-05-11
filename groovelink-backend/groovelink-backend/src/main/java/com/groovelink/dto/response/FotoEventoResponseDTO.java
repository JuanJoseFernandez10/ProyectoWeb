package com.groovelink.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FotoEventoResponseDTO {

    private Long id;
    private Boolean esPortada;
    private String nombreFoto;
    private String fotoUrl;
}