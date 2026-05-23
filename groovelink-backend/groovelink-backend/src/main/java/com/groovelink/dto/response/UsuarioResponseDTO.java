package com.groovelink.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UsuarioResponseDTO {

    private Long id;
    private String username;
    private String email;
    private String rol;
    private Boolean premium;
    private LocalDateTime fechaCreacion;
}