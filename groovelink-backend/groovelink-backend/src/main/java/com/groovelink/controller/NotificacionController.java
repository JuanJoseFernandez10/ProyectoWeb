package com.groovelink.controller;

import com.groovelink.dto.response.NotificacionResponseDTO;
import com.groovelink.entitys.Usuario;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.service.NotificacionService;
import com.groovelink.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notificaciones")
public class NotificacionController {

    private final NotificacionService notificacionService;
    private final UsuarioService usuarioService;

    public NotificacionController(NotificacionService notificacionService,
                                  UsuarioService usuarioService) {
        this.notificacionService = notificacionService;
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<NotificacionResponseDTO>> obtenerNotificaciones(Authentication auth) {
        Usuario usuario = usuarioService.findByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", 0L));
        return ResponseEntity.ok(notificacionService.obtenerNotificaciones(usuario.getId()));
    }

    @GetMapping("/no-leidas")
    public ResponseEntity<Map<String, Long>> contarNoLeidas(Authentication auth) {
        Usuario usuario = usuarioService.findByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", 0L));
        long count = notificacionService.contarNoLeidas(usuario.getId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PutMapping("/{id}/leer")
    public ResponseEntity<Void> marcarComoLeida(@PathVariable Long id, Authentication auth) {
        Usuario usuario = usuarioService.findByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", 0L));
        notificacionService.marcarComoLeida(id, usuario.getId());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/leer-todas")
    public ResponseEntity<Void> marcarTodasComoLeidas(Authentication auth) {
        Usuario usuario = usuarioService.findByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", 0L));
        notificacionService.marcarTodasComoLeidas(usuario.getId());
        return ResponseEntity.ok().build();
    }
}
