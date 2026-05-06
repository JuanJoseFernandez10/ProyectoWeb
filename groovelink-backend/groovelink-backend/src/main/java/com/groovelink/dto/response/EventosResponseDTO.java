package com.groovelink.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventosResponseDTO {
    
    private List<EventoResponseDTO> eventos;
    private Integer total;
    private String mensaje;
    private Integer page;
    private Integer size;
    private Integer totalPages;
    private Boolean hasNext;
    private Boolean hasPrevious;
}
