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
    private String imagen;
    private String descripcion;
    private LocalDate fechaInicio;
    private LocalDate fechaFinal;
    private LocalDateTime fechaCreacion;

    private String publicadoPorUsername;   
    private List<String> aptitudes;
    private List<Long> aptitudesIds;
    private List<String> generos;
    private List<Long> generosIds;
    private Integer numeroAsistentes;
    private Integer numeroMeGustas;
    private List<UsuarioBasicoDTO> participantes;
    private Boolean likedByMe;

    private String rutaPortada;
    private String rutaFotos;
    private FotoEventoResponseDTO portada;
    private List<FotoEventoResponseDTO> fotos;
}