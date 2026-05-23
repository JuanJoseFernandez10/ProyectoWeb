package com.groovelink.controller;

import com.groovelink.dto.response.DashboardEstadisticasDTO;
import com.groovelink.dto.response.EventoStatsDTO;
import com.groovelink.entitys.Usuario;
import com.groovelink.enums.Rol;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.service.DashboardService;
import com.groovelink.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final UsuarioService usuarioService;

    public DashboardController(DashboardService dashboardService, UsuarioService usuarioService) {
        this.dashboardService = dashboardService;
        this.usuarioService = usuarioService;
    }

    @GetMapping("/estadisticas")
    public ResponseEntity<DashboardEstadisticasDTO> estadisticas(Authentication auth) {
        Usuario usuario = usuarioService.findByUsername(auth.getName())
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        if (usuario.getRol() != Rol.ROLE_EMPRESA) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(dashboardService.obtenerEstadisticas(usuario));
    }

    @GetMapping("/eventos")
    public ResponseEntity<List<EventoStatsDTO>> eventos(Authentication auth) {
        Usuario usuario = usuarioService.findByUsername(auth.getName())
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        if (usuario.getRol() != Rol.ROLE_EMPRESA) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(dashboardService.obtenerEventosConStats(usuario));
    }
}
