package com.groovelink.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class EventoResponseDTO {

    private Long codigo;
    private String nombre;
    private String ubicacion;
    private String descripcion;
    private LocalDate fechaInicio;
    private LocalDate fechaFinal;
    private LocalDateTime fechaCreacion;

    private String publicadoPorUsername;   // username del que publicó
    private List<String> aptitudes;        // solo nombres
    private List<String> generos;          // solo nombres
    private Integer numeroAsistentes;
}