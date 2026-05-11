package com.groovelink.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FotoEventoUploadResponseDTO {

    private Long fotoId;           // ID de la foto guardada
    private Long eventoId;         // ID del evento
    private String nombreFoto;     // Nombre de la foto
    private Boolean esPortada;     // Si es portada
    private String carpetaNombre;  // Nombre de la carpeta: nombreEvento_eventoId
    private String mensaje;        // Mensaje de éxito
}
