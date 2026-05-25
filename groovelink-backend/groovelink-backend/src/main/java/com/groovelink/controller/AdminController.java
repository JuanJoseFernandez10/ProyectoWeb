package com.groovelink.controller;

import com.groovelink.dto.response.ChatResponseDTO;
import com.groovelink.dto.response.EventoResponseDTO;
import com.groovelink.dto.response.MensajeResponseDTO;
import com.groovelink.dto.response.ReporteResponseDTO;
import com.groovelink.dto.response.UsuarioResponseDTO;
import com.groovelink.entitys.Administrador;
import com.groovelink.entitys.Chat;
import com.groovelink.entitys.Evento;
import com.groovelink.entitys.Mensaje;
import com.groovelink.entitys.EstadoReporte;
import com.groovelink.entitys.Persona;
import com.groovelink.entitys.Reporte;
import com.groovelink.entitys.Usuario;
import com.groovelink.enums.Rol;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.mapper.GrooveLinkMapper;
import com.groovelink.repository.ChatRepository;
import com.groovelink.repository.EventoRepository;
import com.groovelink.repository.MensajeRepository;
import com.groovelink.repository.ReporteRepository;
import com.groovelink.repository.SolicitudAmistadRepository;
import com.groovelink.repository.UsuarioRepository;
import com.groovelink.repository.relations.PersonaComentarioEventoRepository;
import com.groovelink.repository.relations.PersonaMeGustaEventoRepository;
import com.groovelink.repository.relations.PersonaUneEventoRepository;
import com.groovelink.service.AmistadService;
import com.groovelink.service.EventoService;
import com.groovelink.service.ReporteService;
import com.groovelink.service.UsuarioService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;
    private final EventoRepository eventoRepository;
    private final EventoService eventoService;
    private final ReporteRepository reporteRepository;
    private final ReporteService reporteService;
    private final AmistadService amistadService;
    private final PersonaUneEventoRepository personaUneEventoRepository;
    private final PersonaComentarioEventoRepository personaComentarioEventoRepository;
    private final ChatRepository chatRepository;
    private final MensajeRepository mensajeRepository;
    private final SolicitudAmistadRepository solicitudAmistadRepository;
    private final PersonaMeGustaEventoRepository personaMeGustaEventoRepository;
    private final GrooveLinkMapper mapper;

    public AdminController(UsuarioService usuarioService,
                           UsuarioRepository usuarioRepository,
                           EventoRepository eventoRepository,
                           EventoService eventoService,
                           ReporteRepository reporteRepository,
                           ReporteService reporteService,
                           AmistadService amistadService,
                           PersonaUneEventoRepository personaUneEventoRepository,
                           PersonaComentarioEventoRepository personaComentarioEventoRepository,
                           ChatRepository chatRepository,
                           MensajeRepository mensajeRepository,
                           SolicitudAmistadRepository solicitudAmistadRepository,
                           PersonaMeGustaEventoRepository personaMeGustaEventoRepository,
                           GrooveLinkMapper mapper) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
        this.eventoRepository = eventoRepository;
        this.eventoService = eventoService;
        this.reporteRepository = reporteRepository;
        this.reporteService = reporteService;
        this.amistadService = amistadService;
        this.personaUneEventoRepository = personaUneEventoRepository;
        this.personaComentarioEventoRepository = personaComentarioEventoRepository;
        this.chatRepository = chatRepository;
        this.mensajeRepository = mensajeRepository;
        this.solicitudAmistadRepository = solicitudAmistadRepository;
        this.personaMeGustaEventoRepository = personaMeGustaEventoRepository;
        this.mapper = mapper;
    }

    // ─── USUARIOS ────────────────────────────────────────────────────────────

    @GetMapping("/usuarios")
    @Transactional(readOnly = true)
    public Page<UsuarioResponseDTO> listarUsuarios(Pageable pageable) {
        return usuarioRepository.findAll(pageable).map(mapper::toUsuarioResponseDTO);
    }

    @GetMapping("/usuarios/{id}")
    @Transactional(readOnly = true)
    public UsuarioResponseDTO obtenerUsuario(@PathVariable Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));
        return mapper.toUsuarioResponseDTO(usuario);
    }

    @PutMapping("/usuarios/{id}")
    @Transactional
    public UsuarioResponseDTO actualizarUsuario(@PathVariable Long id,
                                                 @RequestBody Map<String, Object> body) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));

        if (body.containsKey("username")) {
            usuario.setUsername((String) body.get("username"));
        }
        if (body.containsKey("email")) {
            usuario.setEmail((String) body.get("email"));
        }
        if (body.containsKey("rol")) {
            usuario.setRol(Rol.valueOf((String) body.get("rol")));
        }
        if (body.containsKey("premium") && usuario instanceof Persona persona) {
            Object val = body.get("premium");
            if (val instanceof Boolean) {
                persona.setPremium((Boolean) val);
            } else if (val instanceof String) {
                persona.setPremium("true".equalsIgnoreCase((String) val));
            }
        }

        return mapper.toUsuarioResponseDTO(usuarioRepository.save(usuario));
    }

    @GetMapping("/usuarios/{id}/detalle")
    @Transactional(readOnly = true)
    public Map<String, Object> detalleUsuario(@PathVariable Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));

        List<Evento> eventosPublicados = eventoRepository.findEventosPublicadosPorUsuario(id);
        List<Usuario> amigos = amistadService.obtenerAmigos(id);
        List<Chat> chats = chatRepository.findByParticipantes_Id(id);

        Map<String, Object> result = new HashMap<>();
        result.put("usuario", mapper.toUsuarioResponseDTO(usuario));
        result.put("eventos", eventosPublicados.stream().map(mapper::toEventoResponseDTO).collect(Collectors.toList()));
        result.put("amigos", amigos.stream().map(mapper::toUsuarioResponseDTO).collect(Collectors.toList()));
        result.put("chats", chats.stream().map(mapper::toChatResponseDTO).collect(Collectors.toList()));

        return result;
    }

    @DeleteMapping("/usuarios/{id}")
    @Transactional
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));

        // Remove from all chats
        List<Chat> chats = chatRepository.findByParticipantes_Id(id);
        for (Chat chat : chats) {
            chat.getParticipantes().removeIf(p -> p.getId().equals(id));
            chatRepository.save(chat);
        }

        // Remove friend requests (both sides)
        solicitudAmistadRepository.eliminarTodasPorUsuario(id);

        // Remove event likes
        personaMeGustaEventoRepository.eliminarTodosPorUsuario(id);

        // Remove event attendance
        personaUneEventoRepository.eliminarTodosPorUsuario(id);

        // Remove event comments
        personaComentarioEventoRepository.eliminarTodosPorUsuario(id);

        // Nullify report references
        reporteRepository.findByReportero_Id(id).forEach(r -> r.setReportero(null));
        reporteRepository.findByRevisadoPor_Id(id).forEach(r -> r.setRevisadoPor(null));

        // Delete user's events
        List<Evento> eventos = eventoRepository.findEventosPublicadosPorUsuario(id);
        for (Evento evento : eventos) {
            eventoService.eliminarEvento(evento.getId());
        }

        // Delete messages sent by this user
        mensajeRepository.eliminarTodosPorUsuario(id);

        usuarioRepository.delete(usuario);
        return ResponseEntity.ok().build();
    }

    // ─── EVENTOS ─────────────────────────────────────────────────────────────

    @GetMapping("/eventos")
    @Transactional(readOnly = true)
    public Page<EventoResponseDTO> listarEventos(Pageable pageable) {
        Page<Evento> page = eventoRepository.findAll(pageable);
        page.getContent().forEach(e -> eventoService.cargarNumeroMeGustas(e));
        return page.map(mapper::toEventoResponseDTO);
    }

    @GetMapping("/eventos/{id}")
    @Transactional(readOnly = true)
    public EventoResponseDTO obtenerEvento(@PathVariable Long id) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento", id));
        eventoService.cargarNumeroMeGustas(evento);
        return mapper.toEventoResponseDTO(evento);
    }

    @GetMapping("/eventos/{id}/detalle")
    @Transactional(readOnly = true)
    public Map<String, Object> detalleEvento(@PathVariable Long id) {
        Evento evento = eventoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Evento", id));

        eventoService.cargarNumeroMeGustas(evento);

        Map<String, Object> result = new HashMap<>();
        result.put("evento", mapper.toEventoResponseDTO(evento));

        List<Map<String, Object>> participantes = personaUneEventoRepository.findByEvento_Id(id).stream()
            .map(pue -> {
                Map<String, Object> p = new HashMap<>();
                p.put("id", pue.getUsuario().getId());
                p.put("username", pue.getUsuario().getUsername());
                return p;
            })
            .collect(Collectors.toList());
        result.put("participantes", participantes);

        List<Map<String, Object>> comentarios = personaComentarioEventoRepository
            .findByEvento_IdOrderByFechaDesc(id).stream()
            .map(c -> {
                Map<String, Object> cm = new HashMap<>();
                cm.put("id", c.getId());
                cm.put("texto", c.getTexto());
                cm.put("megustas", c.getMegustas());
                cm.put("fecha", c.getFecha().toString());
                cm.put("usuarioUsername", c.getUsuario().getUsername());
                return cm;
            })
            .collect(Collectors.toList());
        result.put("comentarios", comentarios);

        return result;
    }

    @DeleteMapping("/eventos/{id}")
    public ResponseEntity<Void> eliminarEvento(@PathVariable Long id) {
        eventoService.eliminarEvento(id);
        return ResponseEntity.ok().build();
    }

    // ─── REPORTES ────────────────────────────────────────────────────────────

    @GetMapping("/reportes")
    @Transactional(readOnly = true)
    public Page<ReporteResponseDTO> listarReportes(Pageable pageable) {
        return reporteRepository.findAll(pageable).map(mapper::toReporteResponseDTO);
    }

    @GetMapping("/reportes/{id}")
    @Transactional(readOnly = true)
    public ReporteResponseDTO obtenerReporte(@PathVariable Long id) {
        Reporte reporte = reporteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reporte", id));
        return mapper.toReporteResponseDTO(reporte);
    }

    @PutMapping("/reportes/{id}")
    @Transactional
    public ReporteResponseDTO revisarReporte(@PathVariable Long id,
                                              @RequestBody Map<String, String> body,
                                              Authentication auth) {
        String estado = body.get("estado");
        if (estado == null || estado.isBlank()) {
            estado = "revisado";
        }

        Usuario usuario = usuarioService.findByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Admin no encontrado"));

        if (!(usuario instanceof Administrador admin)) {
            throw new ResourceNotFoundException("Admin no encontrado");
        }

        Reporte reporte = reporteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reporte", id));

        reporte.setEstado(EstadoReporte.valueOf(estado));
        reporte.setRevisadoPor(admin);
        reporte.setFechaRevision(LocalDateTime.now());

        return mapper.toReporteResponseDTO(reporteRepository.save(reporte));
    }

    // ─── CHATS ───────────────────────────────────────────────────────────────

    @GetMapping("/chats")
    @Transactional(readOnly = true)
    public List<ChatResponseDTO> listarChats() {
        return chatRepository.findAll().stream()
                .map(mapper::toChatResponseDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/usuarios/{id}/chats")
    @Transactional(readOnly = true)
    public List<ChatResponseDTO> listarChatsDeUsuario(@PathVariable Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));
        return chatRepository.findByParticipantes_Id(usuario.getId()).stream()
                .map(mapper::toChatResponseDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/chats/{chatId}/messages")
    @Transactional(readOnly = true)
    public Page<MensajeResponseDTO> listarMensajes(@PathVariable Long chatId,
                                                    @RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "50") int size) {
        Page<Mensaje> mensajes = mensajeRepository.findByChat_IdOrderByFechaEnvioAsc(chatId, PageRequest.of(page, size));
        return mensajes.map(mapper::toMensajeResponseDTO);
    }
}
