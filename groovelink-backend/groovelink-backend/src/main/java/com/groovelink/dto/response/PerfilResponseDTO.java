package com.groovelink.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PerfilResponseDTO {

    private String descripcion;
    private String fotoPerfilUrl;   // base64 o URL si usas cloud
}