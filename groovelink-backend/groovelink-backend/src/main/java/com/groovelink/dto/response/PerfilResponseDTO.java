package com.groovelink.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PerfilResponseDTO {

    private Long id;
    private String username;
    private String email;
    private String descripcion;
    private String ubicacion;
    private String fotoPerfilUrl;
    private boolean premium;
}