package com.groovelink.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MensajeResponseDTO {

    private Long id;
    private String contenido;
    private String enviadoPorUsername;
    private LocalDateTime fechaEnvio;
}