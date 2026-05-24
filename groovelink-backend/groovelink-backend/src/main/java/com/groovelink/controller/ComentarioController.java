package com.groovelink.controller;

import com.groovelink.dto.request.ComentarioEventoRequestDTO;
import com.groovelink.dto.response.PersonaComentarioEventoResponseDTO;
import com.groovelink.entitys.Evento;
import com.groovelink.entitys.Usuario;
import com.groovelink.entitys.relations.PersonaComentarioEvento;
import com.groovelink.enums.TipoNotificacion;
import com.groovelink.exception.BusinessException;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.mapper.GrooveLinkMapper;
import com.groovelink.repository.EventoRepository;
import com.groovelink.repository.relations.PersonaComentarioEventoRepository;
import com.groovelink.service.NotificacionService;
import com.groovelink.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/eventos")
public class ComentarioController {

    private final PersonaComentarioEventoRepository comentarioRepository;
    private final EventoRepository eventoRepository;
    private final UsuarioService usuarioService;
    private final GrooveLinkMapper mapper;
    private final NotificacionService notificacionService;

    public ComentarioController(PersonaComentarioEventoRepository comentarioRepository,
                                EventoRepository eventoRepository,
                                UsuarioService usuarioService,
                                GrooveLinkMapper mapper,
                                NotificacionService notificacionService) {
        this.comentarioRepository = comentarioRepository;
        this.eventoRepository = eventoRepository;
        this.usuarioService = usuarioService;
        this.mapper = mapper;
        this.notificacionService = notificacionService;
    }

    @GetMapping("/{eventoId}/comentarios")
    public ResponseEntity<List<PersonaComentarioEventoResponseDTO>> obtenerComentarios(@PathVariable Long eventoId) {
        List<PersonaComentarioEvento> comentarios = comentarioRepository.findByEvento_IdOrderByFechaDesc(eventoId);
        List<PersonaComentarioEventoResponseDTO> dtos = comentarios.stream()
                .map(mapper::toComentarioResponseDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/{eventoId}/comentarios")
    @Transactional
    public ResponseEntity<PersonaComentarioEventoResponseDTO> crearComentario(@PathVariable Long eventoId,
                                                                               @Valid @RequestBody ComentarioEventoRequestDTO request,
                                                                               Authentication auth) {
        Usuario usuario = usuarioService.findByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", 0L));

        Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new ResourceNotFoundException("Evento", eventoId));

        PersonaComentarioEvento comentario = new PersonaComentarioEvento();
        comentario.setUsuario(usuario);
        comentario.setEvento(evento);
        comentario.setTexto(request.getTexto());

        PersonaComentarioEvento saved = comentarioRepository.save(comentario);

        if (evento.getPublicado() != null && !evento.getPublicado().getId().equals(usuario.getId())) {
            notificacionService.crearNotificacion(
                evento.getPublicado().getId(), TipoNotificacion.NUEVO_COMENTARIO,
                usuario.getUsername() + " ha comentado en tu evento \"" + evento.getNombre() + "\"",
                eventoId
            );
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toComentarioResponseDTO(saved));
    }
}
