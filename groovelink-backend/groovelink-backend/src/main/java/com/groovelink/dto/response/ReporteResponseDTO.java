package com.groovelink.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ReporteResponseDTO {

    private Long id;
    private String tipoContenido;
    private Long idContenido;
    private String motivo;
    private String detalleAdicional;
    private String estado;
    private LocalDateTime fechaReporte;
    private String reporteroUsername;
    private String revisadoPorUsername;
}