package com.groovelink.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PerfilResponseDTO {

    private String descripcion;
    private String fotoPerfilUrl;   // puedes poner base64 o URL si guardas las fotos en cloud
}