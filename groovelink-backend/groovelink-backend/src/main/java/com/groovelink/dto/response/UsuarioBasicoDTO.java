package com.groovelink.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioBasicoDTO {
    private Long id;
    private String username;
    private String email;
    private String rol;
    private String fotoPerfilUrl;

    public UsuarioBasicoDTO() {}

    public UsuarioBasicoDTO(Long id, String username, String email, String rol) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.rol = rol;
    }
}
