package com.groovelink.controller;

import com.groovelink.dto.request.EventoCreateRequestDTO;
import com.groovelink.dto.request.EventoUpdateRequestDTO;
import com.groovelink.dto.response.EventoResponseDTO;
import com.groovelink.dto.response.FotoEventoResponseDTO;
import com.groovelink.entitys.*;
import com.groovelink.exception.BusinessException;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.mapper.GrooveLinkMapper;
import com.groovelink.repository.relations.PersonaMeGustaEventoRepository;
import com.groovelink.service.EventoService;
import com.groovelink.service.relations.FotoEventoService;
import com.groovelink.service.UsuarioService;

import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/eventos")
public class EventoController {

    private final EventoService eventoService;
    private final FotoEventoService fotoEventoService;
    private final UsuarioService usuarioService;
    private final GrooveLinkMapper mapper;
    private final PersonaMeGustaEventoRepository personaMeGustaEventoRepository;

    public EventoController(EventoService eventoService, 
                          FotoEventoService fotoEventoService, 
                          UsuarioService usuarioService,
                          GrooveLinkMapper mapper,
                          PersonaMeGustaEventoRepository personaMeGustaEventoRepository) {
        this.eventoService = eventoService;
        this.fotoEventoService = fotoEventoService;
        this.usuarioService = usuarioService;
        this.mapper = mapper;
        this.personaMeGustaEventoRepository = personaMeGustaEventoRepository;
    }

    @Transactional(readOnly = true)
    @GetMapping("/mis-eventos")
    public List<EventoResponseDTO> misEventos(Authentication authentication,
                                             @RequestParam(required = false) Long usuarioId,
                                             @RequestParam(required = false) String username) {
        Usuario usuario = resolverUsuarioObjetivo(authentication, usuarioId, username);

        return eventoService.findEventosPublicadosPorUsuario(usuario.getId()).stream()
            .map(evento -> convertirEvento(evento, false))
                .collect(Collectors.toList());
    }

    // POST /eventos - crear nuevo evento
    @Transactional
    @PostMapping
    public EventoResponseDTO crearEvento(@Valid @RequestBody EventoCreateRequestDTO request,
                                        Authentication authentication) {
        Usuario usuario = usuarioService.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", 0L));

        if (!((usuario instanceof Persona persona && persona.isPremium()) || usuario instanceof Empresa)) {
            throw new BusinessException("Solo usuarios premium y empresas pueden crear eventos");
        }

        Evento evento = new Evento();
        evento.setNombre(request.getNombre());
        evento.setUbicacion(request.getUbicacion());
        evento.setDescripcion(request.getDescripcion());
        evento.setFechaInicio(request.getFechaInicio());
        evento.setFechaFinal(request.getFechaFinal());
        evento.setPublicado(usuario);

        // Agregar aptitudes
        if (request.getAptitudesIds() != null && !request.getAptitudesIds().isEmpty()) {
            evento.setAptitudes(eventoService.crearRelacionesAptitudes(evento, request.getAptitudesIds()));
        }

        // Agregar géneros
        if (request.getGenerosIds() != null && !request.getGenerosIds().isEmpty()) {
            evento.setGeneros(eventoService.crearRelacionesGeneros(evento, request.getGenerosIds()));
        }

        Evento eventoGuardado = eventoService.save(evento);
        return convertirEvento(eventoGuardado, true);
    }

    // GET /eventos/{eventoId}
    @Transactional(readOnly = true)
    @GetMapping("/{eventoId}")
    public EventoResponseDTO cargarEvento(@PathVariable Long eventoId, Authentication authentication) {
        Evento evento = eventoService.findById(eventoId)
                .orElseThrow(() -> new BusinessException("Evento no encontrado"));
        
        Long usuarioId = null;
        if (authentication != null && authentication.isAuthenticated() 
            && !"anonymousUser".equals(authentication.getName())) {
            try {
                usuarioId = usuarioService.findByUsername(authentication.getName())
                    .map(Usuario::getId)
                    .orElse(null);
            } catch (Exception e) {
                usuarioId = null;
            }
        }
        
        EventoResponseDTO dto = convertirEvento(evento, false);
        if (usuarioId != null) {
            boolean liked = personaMeGustaEventoRepository.existsByUsuario_IdAndEvento_Id(usuarioId, eventoId);
            dto.setLikedByMe(liked);
        }
        return dto;
    }

        @Transactional(readOnly = true)
        @GetMapping("/{eventoId}/edicion")
        public EventoResponseDTO cargarEventoParaEdicion(@PathVariable Long eventoId, Authentication authentication) {
        Usuario usuario = usuarioService.findByUsername(authentication.getName())
            .orElseThrow(() -> new ResourceNotFoundException("Usuario", 0L));

        Evento evento = eventoService.findById(eventoId)
            .orElseThrow(() -> new ResourceNotFoundException("Evento", eventoId));

        if (evento.getPublicado() == null || !evento.getPublicado().getId().equals(usuario.getId())) {
            throw new BusinessException("No tienes permisos para ver informacion privada de este evento");
        }

        return convertirEvento(evento, true);
    }

    // PUT /eventos/{eventoId} - editar evento
    @Transactional
    @PutMapping("/{eventoId}")
    public EventoResponseDTO editarEvento(@PathVariable Long eventoId,
                                         @Valid @RequestBody EventoUpdateRequestDTO request,
                                         Authentication authentication) {
        Usuario usuario = usuarioService.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", 0L));

        Evento evento = eventoService.findById(eventoId)
                .orElseThrow(() -> new ResourceNotFoundException("Evento", eventoId));

        // Verificar que el usuario sea el creador del evento
        if (!evento.getPublicado().getId().equals(usuario.getId())) {
            throw new BusinessException("No tienes permisos para editar este evento");
        }

        evento.setNombre(request.getNombre());
        evento.setUbicacion(request.getUbicacion());
        evento.setDescripcion(request.getDescripcion());
        evento.setFechaInicio(request.getFechaInicio());
        evento.setFechaFinal(request.getFechaFinal());

        // Actualizar aptitudes
        if (request.getAptitudesIds() != null) {
            evento.getAptitudes().clear();
            evento.setAptitudes(eventoService.crearRelacionesAptitudes(evento, request.getAptitudesIds()));
        }

        // Actualizar géneros
        if (request.getGenerosIds() != null) {
            evento.getGeneros().clear();
            evento.setGeneros(eventoService.crearRelacionesGeneros(evento, request.getGenerosIds()));
        }

        Evento eventoActualizado = eventoService.save(evento);
        return convertirEvento(eventoActualizado, true);
    }

    // DELETE /eventos/{eventoId} - eliminar evento
    @Transactional
    @DeleteMapping("/{eventoId}")
    public void eliminarEvento(@PathVariable Long eventoId, Authentication authentication) {
        Usuario usuario = usuarioService.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", 0L));

        Evento evento = eventoService.findById(eventoId)
                .orElseThrow(() -> new ResourceNotFoundException("Evento", eventoId));

        // Verificar que el usuario sea el creador del evento
        if (!evento.getPublicado().getId().equals(usuario.getId())) {
            throw new BusinessException("No tienes permisos para eliminar este evento");
        }

        eventoService.eliminarEvento(eventoId);
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

        return usuario.getId();
    }

    private Usuario resolverUsuarioObjetivo(Authentication authentication, Long usuarioId, String username) {
        if (usuarioId != null) {
            return usuarioService.findById(usuarioId)
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario", usuarioId));
        }

        if (username != null && !username.isBlank()) {
            return usuarioService.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario", 0L));
        }

        return usuarioService.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", 0L));
    }

    private EventoResponseDTO convertirEvento(Evento evento, boolean incluirInfoPrivada) {
    Long eventoId = evento.getId();

    EventoResponseDTO response = new EventoResponseDTO();
    response.setCodigo(eventoId);
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

    if (incluirInfoPrivada) {
        response.setRutaPortada("/fotos-evento/" + eventoId + "/portada/archivo");
        response.setRutaFotos("/fotos-evento/" + eventoId + "/todas");
    }

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

    private FotoEventoResponseDTO convertirFoto(com.groovelink.entitys.relations.FotoEvento foto) {
        FotoEventoResponseDTO response = new FotoEventoResponseDTO();
        response.setId(foto.getId());
        response.setEsPortada(foto.getEsPortada());
        response.setNombreFoto(foto.getNombreFoto());
        response.setFotoUrl(construirFotoUrl(foto));
        return response;
    }

    private String construirFotoUrl(com.groovelink.entitys.relations.FotoEvento foto) {
        return mapper.construirFotoUrl(foto);
    }
}