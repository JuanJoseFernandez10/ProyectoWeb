package com.groovelink.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CrearChatRequest {

    @NotBlank
    @Size(max = 255)
    private String nombre;

    @Size(max = 1000)
    private String descripcion;

    private boolean esGrupal;

    @NotEmpty
    @Size(min = 2, max = 50)
    private List<Long> participantesIds;
}
