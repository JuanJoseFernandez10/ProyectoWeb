package com.groovelink.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class EventoCreateRequestDTO {

    @NotBlank
    @Size(min = 5, max = 150)
    private String nombre;

    @NotBlank
    private String ubicacion;

    @Size(max = 1000)
    private String descripcion;

    @NotNull
    @FutureOrPresent
    private LocalDate fechaInicio;

    @NotNull
    @FutureOrPresent
    private LocalDate fechaFinal;

    private List<Long> aptitudesIds;   // IDs de aptitudes
    private List<Long> generosIds;     // IDs de géneros
}