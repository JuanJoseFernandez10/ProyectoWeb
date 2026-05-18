package com.groovelink.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class ChatResponseDTO {

    private Long id;
    private String nombre;
    private boolean esGrupal;
    private LocalDateTime fechaCreacion;
    private LocalDateTime ultimoMensaje;

    private Long eventoId;
    private String imagen;

    private List<String> participantesUsernames;
    private Map<String, String> participantesFotos;   // username -> fotoPerfil URL
}