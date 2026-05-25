package com.groovelink.controller;

import com.groovelink.dto.request.EventoCreateRequestDTO;
import com.groovelink.dto.request.EventoUpdateRequestDTO;
import com.groovelink.dto.response.EventoResponseDTO;
import com.groovelink.dto.response.EventosResponseDTO;
import com.groovelink.dto.response.FotoEventoResponseDTO;
import com.groovelink.dto.response.UsuarioBasicoDTO;
import com.groovelink.entitys.Evento;
import com.groovelink.entitys.Persona;
import com.groovelink.entitys.Empresa;
import com.groovelink.entitys.Usuario;
import com.groovelink.entitys.relations.PersonaUneEvento;
import com.groovelink.exception.BusinessException;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.mapper.GrooveLinkMapper;
import com.groovelink.repository.relations.FotoEventoRepository;
import com.groovelink.repository.relations.PersonaMeGustaEventoRepository;
import com.groovelink.repository.relations.PersonaUneEventoRepository;
import com.groovelink.service.EventoService;
import com.groovelink.service.PerfilService;
import com.groovelink.service.relations.FotoEventoService;
import com.groovelink.service.UsuarioService;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/eventos")
public class EventoController {

    private final EventoService eventoService;
    private final FotoEventoService fotoEventoService;
    private final UsuarioService usuarioService;
    private final PerfilService perfilService;
    private final GrooveLinkMapper mapper;
    private final PersonaMeGustaEventoRepository personaMeGustaEventoRepository;
    private final PersonaUneEventoRepository personaUneEventoRepository;
    private final FotoEventoRepository fotoEventoRepository;

    public EventoController(EventoService eventoService, 
                          FotoEventoService fotoEventoService, 
                          UsuarioService usuarioService,
                          PerfilService perfilService,
                          GrooveLinkMapper mapper,
                          PersonaMeGustaEventoRepository personaMeGustaEventoRepository,
                          PersonaUneEventoRepository personaUneEventoRepository,
                          FotoEventoRepository fotoEventoRepository) {
        this.eventoService = eventoService;
        this.fotoEventoService = fotoEventoService;
        this.usuarioService = usuarioService;
        this.perfilService = perfilService;
        this.mapper = mapper;
        this.personaMeGustaEventoRepository = personaMeGustaEventoRepository;
        this.personaUneEventoRepository = personaUneEventoRepository;
        this.fotoEventoRepository = fotoEventoRepository;
    }

    @Transactional(readOnly = true)
    @GetMapping("/mis-eventos")
    public EventosResponseDTO misEventos(Authentication authentication,
                                         @RequestParam(required = false) Long usuarioId,
                                         @RequestParam(required = false) String username,
                                         @RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "10") int size) {
        Usuario usuario = resolverUsuarioObjetivo(authentication, usuarioId, username);
        Pageable pageable = PageRequest.of(page, size);

        Page<Evento> eventosPage = eventoService.findEventosPublicadosPorUsuario(usuario.getId(), pageable);
        List<EventoResponseDTO> dtos = convertirEventos(eventosPage.getContent(), false);

        EventosResponseDTO response = new EventosResponseDTO();
        response.setEventos(dtos);
        response.setTotal((int) eventosPage.getTotalElements());
        response.setPage(eventosPage.getNumber());
        response.setSize(eventosPage.getSize());
        response.setTotalPages(eventosPage.getTotalPages());
        response.setHasNext(eventosPage.hasNext());
        response.setHasPrevious(eventosPage.hasPrevious());
        return response;
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
    @GetMapping("/{eventoId}")
    public EventoResponseDTO cargarEvento(@PathVariable Long eventoId, Authentication authentication) {
        Evento evento = eventoService.findByIdWithDetails(eventoId)
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

    @GetMapping("/{eventoId}/edicion")
    public EventoResponseDTO cargarEventoParaEdicion(@PathVariable Long eventoId, Authentication authentication) {
        Usuario usuario = usuarioService.findByUsername(authentication.getName())
            .orElseThrow(() -> new ResourceNotFoundException("Usuario", 0L));

        Evento evento = eventoService.findByIdWithDetails(eventoId)
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

        Evento evento = eventoService.findByIdWithDetails(eventoId)
                .orElseThrow(() -> new ResourceNotFoundException("Evento", eventoId));

        // Verificar que el usuario sea el creador del evento
        if (evento.getPublicado() == null || !evento.getPublicado().getId().equals(usuario.getId())) {
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
        if (evento.getPublicado() == null || !evento.getPublicado().getId().equals(usuario.getId())) {
            throw new BusinessException("No tienes permisos para eliminar este evento");
        }

        eventoService.eliminarEvento(eventoId);
    }

    @PostMapping("/{eventoId}/me-gusta")
    public void darMeGusta(@PathVariable Long eventoId, Authentication authentication) {
        eventoService.darMeGusta(obtenerUsuarioId(authentication), eventoId);
    }

    @DeleteMapping("/{eventoId}/me-gusta")
    public void quitarMeGusta(@PathVariable Long eventoId, Authentication authentication) {
        eventoService.quitarMeGusta(obtenerUsuarioId(authentication), eventoId);
    }

    @PostMapping("/{eventoId}/unirse")
    public void unirseEvento(@PathVariable Long eventoId, Authentication authentication) {
        eventoService.inscribirEnEvento(obtenerUsuarioId(authentication), eventoId);
    }

    @DeleteMapping("/{eventoId}/unirse")
    public void salirEvento(@PathVariable Long eventoId, Authentication authentication) {
        eventoService.cancelarAsistencia(obtenerUsuarioId(authentication), eventoId);
    }

    @GetMapping("/buscar")
    @Transactional(readOnly = true)
    public EventosResponseDTO buscarEventos(@RequestParam String q,
                                            @RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "6") int size,
                                            Authentication authentication) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 12);

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

        Page<EventoResponseDTO> eventosPage = eventoService.buscarEventosDto(
            q, PageRequest.of(safePage, safeSize), usuarioId
        );

        EventosResponseDTO response = new EventosResponseDTO();
        response.setEventos(eventosPage.stream().toList());
        response.setTotal((int) eventosPage.getTotalElements());
        response.setMensaje("Resultados de busqueda");
        response.setPage(eventosPage.getNumber());
        response.setSize(eventosPage.getSize());
        response.setTotalPages(eventosPage.getTotalPages());
        response.setHasNext(eventosPage.hasNext());
        response.setHasPrevious(eventosPage.hasPrevious());
        return response;
    }

    @GetMapping("/unidos")
    @Transactional(readOnly = true)
    public EventosResponseDTO eventosUnidos(Authentication authentication,
                                            @RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "10") int size) {
        Long usuarioId = obtenerUsuarioId(authentication);
        Pageable pageable = PageRequest.of(page, size);

        Page<PersonaUneEvento> puePage = personaUneEventoRepository.findByUsuario_Id(usuarioId, pageable);
        List<Evento> eventos = puePage.getContent().stream()
            .map(PersonaUneEvento::getEvento)
            .collect(Collectors.toList());
        eventoService.cargarContadores(eventos, null);
        List<EventoResponseDTO> dtos = convertirEventos(eventos, false);

        EventosResponseDTO response = new EventosResponseDTO();
        response.setEventos(dtos);
        response.setTotal((int) puePage.getTotalElements());
        response.setPage(puePage.getNumber());
        response.setSize(puePage.getSize());
        response.setTotalPages(puePage.getTotalPages());
        response.setHasNext(puePage.hasNext());
        response.setHasPrevious(puePage.hasPrevious());
        return response;
    }

    private Long obtenerUsuarioId(Authentication authentication) {
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

    private EventoResponseDTO toEventoResponseDTO(Evento evento, boolean incluirInfoPrivada, FotoEventoResponseDTO portada, List<FotoEventoResponseDTO> fotos, List<UsuarioBasicoDTO> participantes) {
        EventoResponseDTO dto = new EventoResponseDTO();
        dto.setCodigo(evento.getId());
        dto.setNombre(evento.getNombre());
        dto.setUbicacion(evento.getUbicacion());
        dto.setDescripcion(evento.getDescripcion());
        dto.setFechaInicio(evento.getFechaInicio());
        dto.setFechaFinal(evento.getFechaFinal());
        dto.setFechaCreacion(evento.getFechaCreacion());
        dto.setPublicadoPorUsername(evento.getPublicado() != null ? evento.getPublicado().getUsername() : null);
        dto.setNumeroAsistentes(evento.getNumeroAsistentes());
        dto.setNumeroMeGustas(evento.getNumeroMeGustas());
        dto.setAptitudes(evento.getAptitudes() == null ? List.of() : evento.getAptitudes().stream()
            .map(relacion -> relacion.getAptitud().getNombre()).collect(Collectors.toList()));
        dto.setAptitudesIds(evento.getAptitudes() == null ? List.of() : evento.getAptitudes().stream()
            .map(relacion -> relacion.getAptitud().getId()).collect(Collectors.toList()));
        dto.setGeneros(evento.getGeneros() == null ? List.of() : evento.getGeneros().stream()
            .map(relacion -> relacion.getGenero().getNombre()).collect(Collectors.toList()));
        dto.setGenerosIds(evento.getGeneros() == null ? List.of() : evento.getGeneros().stream()
            .map(relacion -> relacion.getGenero().getId()).collect(Collectors.toList()));
        dto.setPortada(portada);
        dto.setImagen(portada != null ? portada.getFotoUrl() : null);
        if (incluirInfoPrivada) {
            dto.setRutaPortada(portada != null ? portada.getFotoUrl() : null);
            dto.setRutaFotos(null);
        }
        dto.setFotos(fotos);
        dto.setParticipantes(participantes);
        return dto;
    }

    private EventoResponseDTO convertirEvento(Evento evento, boolean incluirInfoPrivada) {
        Long eventoId = evento.getId();
        FotoEventoResponseDTO portada = fotoEventoService.findPortadaByEvento(eventoId)
            .map(this::convertirFoto).orElse(null);
        List<FotoEventoResponseDTO> fotos = fotoEventoService.findFotosByEvento(eventoId)
            .stream().map(this::convertirFoto).collect(Collectors.toList());
        List<UsuarioBasicoDTO> participantes = personaUneEventoRepository.findByEvento_Id(eventoId).stream()
            .map(inscripcion -> toUsuarioBasicoDTO(inscripcion.getUsuario())).collect(Collectors.toList());
        return toEventoResponseDTO(evento, incluirInfoPrivada, portada, fotos, participantes);
    }

    private List<EventoResponseDTO> convertirEventos(List<Evento> eventos, boolean incluirInfoPrivada) {
        if (eventos.isEmpty()) return List.of();
        List<Long> ids = eventos.stream().map(Evento::getId).collect(Collectors.toList());
        Map<Long, FotoEventoResponseDTO> portadaMap = fotoEventoRepository
            .findByEvento_IdInAndEsPortadaTrue(ids).stream()
            .collect(Collectors.toMap(f -> f.getEvento().getId(), this::convertirFoto,
                (existente, reemplazo) -> existente));
        Map<Long, List<FotoEventoResponseDTO>> fotosMap = fotoEventoRepository
            .findByEvento_IdInAndEsPortadaFalseOrderByIdAsc(ids).stream()
            .collect(Collectors.groupingBy(f -> f.getEvento().getId(),
                Collectors.mapping(this::convertirFoto, Collectors.toList())));
        Map<Long, List<UsuarioBasicoDTO>> participantesMap = personaUneEventoRepository.findByEvento_IdIn(ids).stream()
            .collect(Collectors.groupingBy(
                pue -> pue.getEvento().getId(),
                Collectors.mapping(pue -> toUsuarioBasicoDTO(pue.getUsuario()), Collectors.toList())));
        return eventos.stream().map(evento -> toEventoResponseDTO(evento, incluirInfoPrivada,
            portadaMap.get(evento.getId()),
            fotosMap.getOrDefault(evento.getId(), List.of()),
            participantesMap.getOrDefault(evento.getId(), List.of())))
            .collect(Collectors.toList());
    }

    private UsuarioBasicoDTO toUsuarioBasicoDTO(Usuario u) {
        UsuarioBasicoDTO dto = new UsuarioBasicoDTO(u.getId(), u.getUsername(), u.getEmail(), u.getRol().name());
        try {
            var perfilDTO = perfilService.obtenerPerfil(u.getId());
            dto.setFotoPerfilUrl(perfilDTO.getFotoPerfilUrl());
        } catch (Exception e) {
            dto.setFotoPerfilUrl(null);
        }
        return dto;
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