package com.groovelink.controller;

import com.groovelink.entitys.Persona;
import com.groovelink.entitys.Usuario;
import com.groovelink.exception.BusinessException;
import com.groovelink.service.EventoService;
import com.groovelink.service.UsuarioService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/eventos")
public class EventoController {

    private final EventoService eventoService;
    private final UsuarioService usuarioService;

    public EventoController(EventoService eventoService, UsuarioService usuarioService) {
        this.eventoService = eventoService;
        this.usuarioService = usuarioService;
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
}