package com.groovelink.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class NotificacionResponseDTO {
    private Long id;
    private String tipo;
    private String mensaje;
    private boolean leida;
    private LocalDateTime fechaCreacion;
    private Long referenciaId;
}
