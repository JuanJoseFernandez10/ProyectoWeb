package com.groovelink.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PersonalizarRequestDTO {
    private List<Long> aptitudesIds;
    private List<Long> generosIds;
    
    @Size(max = 500, message = "La descripción no puede tener más de 500 caracteres")
    private String descripcion;
    
    @Size(max = 200, message = "La ubicación no puede tener más de 200 caracteres")
    private String ubicacion;
}
