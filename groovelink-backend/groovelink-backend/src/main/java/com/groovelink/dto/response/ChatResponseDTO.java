package com.groovelink.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class ChatResponseDTO {

    private Long id;
    private String nombre;
    private boolean esGrupal;
    private LocalDateTime fechaCreacion;
    private LocalDateTime ultimoMensaje;

    private List<String> participantesUsernames;   // solo usernames
}