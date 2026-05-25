package com.groovelink.controller;

import com.groovelink.dto.response.PerfilResponseDTO;
import com.groovelink.dto.response.UsuarioBasicoDTO;
import com.groovelink.entitys.EstadoSolicitud;
import com.groovelink.entitys.SolicitudAmistad;
import com.groovelink.entitys.Usuario;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.repository.UsuarioRepository;
import com.groovelink.service.AmistadService;
import com.groovelink.service.PerfilService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class AmistadController {

    private final AmistadService amistadService;
    private final UsuarioRepository usuarioRepository;
    private final PerfilService perfilService;

    public AmistadController(AmistadService amistadService,
                             UsuarioRepository usuarioRepository,
                             PerfilService perfilService) {
        this.amistadService = amistadService;
        this.usuarioRepository = usuarioRepository;
        this.perfilService = perfilService;
    }

    private Usuario getCurrentUser(Authentication auth) {
        return usuarioRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    @PostMapping("/amistad/solicitar/{usuarioId}")
    public ResponseEntity<Map<String, Object>> solicitarAmistad(@PathVariable Long usuarioId,
                                                                  Authentication auth) {
        Usuario current = getCurrentUser(auth);
        SolicitudAmistad solicitud = amistadService.solicitarAmistad(current.getId(), usuarioId);
        return ResponseEntity.ok(Map.of(
            "id", solicitud.getId(),
            "estado", solicitud.getEstado(),
            "message", "Solicitud enviada"
        ));
    }

    @PutMapping("/amistad/responder/{solicitudId}")
    public ResponseEntity<Map<String, Object>> responderSolicitud(@PathVariable Long solicitudId,
                                                                   @RequestParam boolean aceptar,
                                                                   Authentication auth) {
        Usuario current = getCurrentUser(auth);
        SolicitudAmistad solicitud = amistadService.responderSolicitud(solicitudId, current.getId(), aceptar);
        return ResponseEntity.ok(Map.of(
            "id", solicitud.getId(),
            "estado", solicitud.getEstado(),
            "message", aceptar ? "Solicitud aceptada" : "Solicitud rechazada"
        ));
    }

    @DeleteMapping("/amistad/eliminar/{amigoId}")
    public ResponseEntity<Map<String, Object>> eliminarAmistad(@PathVariable Long amigoId,
                                                                Authentication auth) {
        Usuario current = getCurrentUser(auth);
        amistadService.eliminarAmistad(current.getId(), amigoId);
        return ResponseEntity.ok(Map.of("message", "Amistad eliminada"));
    }

    @DeleteMapping("/amistad/cancelar/{usuarioId}")
    public ResponseEntity<Map<String, Object>> cancelarSolicitud(@PathVariable Long usuarioId,
                                                                  Authentication auth) {
        Usuario current = getCurrentUser(auth);
        amistadService.cancelarSolicitud(current.getId(), usuarioId);
        return ResponseEntity.ok(Map.of("message", "Solicitud cancelada"));
    }

    @GetMapping("/amistad/amigos")
    public ResponseEntity<List<UsuarioBasicoDTO>> obtenerAmigos(Authentication auth) {
        Usuario current = getCurrentUser(auth);
        List<Usuario> amigos = amistadService.obtenerAmigos(current.getId());
        List<UsuarioBasicoDTO> dtos = amigos.stream()
                .map(u -> toBasicoDTO(u))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/amistad/solicitudes-recibidas")
    public ResponseEntity<List<Map<String, Object>>> solicitudesRecibidas(Authentication auth) {
        Usuario current = getCurrentUser(auth);
        List<SolicitudAmistad> solicitudes = amistadService.obtenerSolicitudesRecibidas(current.getId());
        return ResponseEntity.ok(solicitudes.stream().map(s -> Map.<String, Object>of(
            "id", s.getId(),
            "solicitante", toBasicoDTO(s.getSolicitante()),
            "fecha", s.getFechaSolicitud().toString()
        )).collect(Collectors.toList()));
    }

    @GetMapping("/amistad/estado/{usuarioId}")
    public ResponseEntity<Map<String, String>> estadoAmistad(@PathVariable Long usuarioId,
                                                             Authentication auth) {
        Usuario current = getCurrentUser(auth);
        String estado = amistadService.obtenerEstadoAmistad(current.getId(), usuarioId);
        return ResponseEntity.ok(Map.of("estado", estado));
    }

    @GetMapping("/usuarios/{id}")
    public ResponseEntity<PerfilResponseDTO> obtenerPerfilUsuario(@PathVariable Long id) {
        PerfilResponseDTO perfil = perfilService.obtenerPerfil(id);
        return ResponseEntity.ok(perfil);
    }

    @GetMapping("/usuarios/buscar")
    public ResponseEntity<List<UsuarioBasicoDTO>> buscarUsuarios(@RequestParam String q) {
        List<Usuario> usuarios = usuarioRepository.findByUsernameContainingIgnoreCase(q);
        List<UsuarioBasicoDTO> dtos = usuarios.stream()
                .map(this::toBasicoDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private UsuarioBasicoDTO toBasicoDTO(Usuario u) {
        UsuarioBasicoDTO dto = new UsuarioBasicoDTO(u.getId(), u.getUsername(), u.getEmail(), u.getRol().name());
        try {
            var perfilDTO = perfilService.obtenerPerfil(u.getId());
            dto.setFotoPerfilUrl(perfilDTO.getFotoPerfilUrl());
        } catch (Exception e) {
            dto.setFotoPerfilUrl(null);
        }
        return dto;
    }
}
