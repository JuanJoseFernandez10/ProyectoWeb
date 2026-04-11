package com.groovelink.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PersonaResponseDTO {
    private Long id;
    private String username;
    private String email;
    private boolean premium;

    private PerfilResponseDTO perfil;
    private List<String> aptitudes;     // solo nombres
    private List<String> generos;       // solo nombres
}