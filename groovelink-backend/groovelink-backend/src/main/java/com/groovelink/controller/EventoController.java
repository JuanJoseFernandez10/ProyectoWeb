package com.groovelink.controller;

import com.groovelink.dto.response.EventoResponseDTO;
import com.groovelink.dto.response.FotoEventoResponseDTO;
import com.groovelink.entitys.Evento;
import com.groovelink.entitys.Persona;
import com.groovelink.entitys.Usuario;
import com.groovelink.exception.BusinessException;
import com.groovelink.service.EventoService;
import com.groovelink.service.relations.FotoEventoService;
import com.groovelink.service.UsuarioService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/eventos")
public class EventoController {

    private final EventoService eventoService;
    private final FotoEventoService fotoEventoService;
    private final UsuarioService usuarioService;

    public EventoController(EventoService eventoService, FotoEventoService fotoEventoService, UsuarioService usuarioService) {
        this.eventoService = eventoService;
        this.fotoEventoService = fotoEventoService;
        this.usuarioService = usuarioService;
    }

    @GetMapping("/{eventoId}")
    public EventoResponseDTO cargarEvento(@PathVariable Long eventoId) {
        Evento evento = eventoService.findById(eventoId)
                .orElseThrow(() -> new BusinessException("Evento no encontrado"));

        EventoResponseDTO response = new EventoResponseDTO();
        response.setCodigo(evento.getId());
        response.setNombre(evento.getNombre());
        response.setUbicacion(evento.getUbicacion());
        response.setDescripcion(evento.getDescripcion());
        response.setFechaInicio(evento.getFechaInicio());
        response.setFechaFinal(evento.getFechaFinal());
        response.setFechaCreacion(evento.getFechaCreacion());
        response.setPublicadoPorUsername(evento.getPublicado() != null ? evento.getPublicado().getUsername() : null);
        response.setNumeroAsistentes(evento.getNumeroAsistentes());
        response.setNumeroMeGustas(evento.getNumeroMeGustas());

        response.setAptitudes(evento.getAptitudes() == null ? List.of() : evento.getAptitudes().stream()
                .map(relacion -> relacion.getAptitud().getNombre())
                .collect(Collectors.toList()));
        response.setGeneros(evento.getGeneros() == null ? List.of() : evento.getGeneros().stream()
                .map(relacion -> relacion.getGenero().getNombre())
                .collect(Collectors.toList()));

        response.setRutaPortada("/fotos-evento/" + eventoId + "/portada/archivo");
        response.setRutaFotos("/fotos-evento/" + eventoId + "/todas");

        FotoEventoResponseDTO portada = fotoEventoService.findPortadaByEvento(eventoId)
                .map(this::convertirFoto)
                .orElse(null);
        response.setPortada(portada);
        response.setImagen(portada != null ? portada.getFotoUrl() : null);

        response.setFotos(fotoEventoService.findFotosByEvento(eventoId)
                .stream()
                .map(this::convertirFoto)
                .collect(Collectors.toList()));
        
        return response;
    }
    

    @PostMapping("/{eventoId}/me-gusta")
    public void darMeGusta(@PathVariable Long eventoId, Authentication authentication) {
        eventoService.darMeGusta(obtenerPersonaId(authentication), eventoId);
    }

    @DeleteMapping("/{eventoId}/me-gusta")
    public void quitarMeGusta(@PathVariable Long eventoId, Authentication authentication) {
        eventoService.quitarMeGusta(obtenerPersonaId(authentication), eventoId);
    }

    private Long obtenerPersonaId(Authentication authentication) {
        Usuario usuario = usuarioService.findByUsername(authentication.getName())
                .orElseThrow(() -> new BusinessException("Usuario autenticado no encontrado"));

        if (!(usuario instanceof Persona persona)) {
            throw new BusinessException("Solo una persona puede dar me gusta a un evento");
        }

        return persona.getId();
    }

    private FotoEventoResponseDTO convertirFoto(com.groovelink.entitys.relations.FotoEvento foto) {
        FotoEventoResponseDTO response = new FotoEventoResponseDTO();
        response.setId(foto.getId());
        response.setEsPortada(foto.getEsPortada());
        response.setNombreFoto(foto.getNombreFoto());
        response.setFotoUrl(construirFotoUrl(foto));
        return response;
    }

    private String construirFotoUrl(com.groovelink.entitys.relations.FotoEvento foto) {
        if (Boolean.TRUE.equals(foto.getEsPortada())) {
            return "/fotos-evento/" + foto.getEvento().getId() + "/portada/archivo";
        }

        return "/fotos-evento/" + foto.getEvento().getId() + "/" + foto.getNombreFoto() + "/archivo";
    }
}