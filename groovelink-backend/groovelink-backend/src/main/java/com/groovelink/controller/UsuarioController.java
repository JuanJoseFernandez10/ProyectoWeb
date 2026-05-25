package com.groovelink.controller;

import com.groovelink.dto.request.PerfilUpdateRequestDTO;
import com.groovelink.dto.request.CambiarEmailRequestDTO;
import com.groovelink.dto.request.CambiarPasswordRequestDTO;
import com.groovelink.dto.request.DeleteAccountRequestDTO;
import com.groovelink.dto.request.PersonalizarRequestDTO;
import com.groovelink.dto.response.PerfilResponseDTO;
import com.groovelink.entitys.Persona;
import com.groovelink.entitys.Usuario;
import com.groovelink.exception.BusinessException;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.service.PerfilService;
import com.groovelink.service.PersonaService;
import com.groovelink.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final PerfilService perfilService;
    private final PersonaService personaService;

    public UsuarioController(UsuarioService usuarioService, PerfilService perfilService, PersonaService personaService) {
        this.usuarioService = usuarioService;
        this.perfilService = perfilService;
        this.personaService = personaService;
    }

    // GET /usuarios/me - obtener perfil del usuario actual
    @GetMapping("/me")
    public PerfilResponseDTO obtenerMiPerfil(Authentication authentication) {
        Usuario usuario = usuarioService.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", 0L));

        return perfilService.obtenerPerfil(usuario.getId());
    }

    // PUT /usuarios/me - actualizar descripción del perfil
    @PutMapping("/me")
    public PerfilResponseDTO actualizarMiPerfil(Authentication authentication,
                                                @Valid @RequestBody PerfilUpdateRequestDTO request) {
        Usuario usuario = usuarioService.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", 0L));

        return perfilService.actualizarDescripcion(usuario.getId(), request.getDescripcion());
    }

    // PUT /usuarios/me/personalizar - personalización post-registro (aptitudes, géneros, descripción, ubicación)
    @PutMapping("/me/personalizar")
    public PerfilResponseDTO personalizarPerfil(Authentication authentication,
                                                @Valid @RequestBody PersonalizarRequestDTO request) {
        Usuario usuario = usuarioService.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", 0L));
        
        Long usuarioId = usuario.getId();
        
        // Actualizar descripción y ubicación
        PerfilResponseDTO perfilActualizado = perfilService.actualizarPersonalizacion(
                usuarioId, request.getDescripcion(), request.getUbicacion());
        
        // Reemplazar aptitudes y géneros si se proporcionaron
        if (usuario instanceof Persona) {
            if (request.getAptitudesIds() != null) {
                personaService.reemplazarAptitudes(usuarioId, request.getAptitudesIds());
            }
            if (request.getGenerosIds() != null) {
                personaService.reemplazarGeneros(usuarioId, request.getGenerosIds());
            }
        }
        
        return perfilService.obtenerPerfil(usuarioId);
    }

    // POST /usuarios/me/foto-perfil - subir foto de perfil
    @PostMapping("/me/foto-perfil")
    public PerfilResponseDTO subirFotoPerfil(Authentication authentication,
                                            @RequestParam("foto") MultipartFile foto) {
        Usuario usuario = usuarioService.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", 0L));

        validarFoto(foto);

        perfilService.subirFotoPerfil(usuario.getId(), foto);
        return perfilService.obtenerPerfil(usuario.getId());
    }

    // GET /perfiles/{usuarioId}/foto - descargar foto de perfil (redirige a Cloudinary)
    @GetMapping("/perfiles/{usuarioId}/foto")
    public ResponseEntity<Void> descargarFotoPerfil(@PathVariable Long usuarioId) {
        String url = perfilService.obtenerUrlFotoPerfil(usuarioId);
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(url))
                .build();
    }

    @PutMapping("/me/email")
    public PerfilResponseDTO cambiarEmail(Authentication authentication,
                                           @Valid @RequestBody CambiarEmailRequestDTO request) {
        Usuario usuario = usuarioService.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", 0L));
        usuarioService.cambiarEmail(usuario.getId(), request.getEmail());
        return perfilService.obtenerPerfil(usuario.getId());
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> cambiarPassword(Authentication authentication,
                                                 @Valid @RequestBody CambiarPasswordRequestDTO request) {
        Usuario usuario = usuarioService.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", 0L));
        usuarioService.cambiarPassword(usuario.getId(), request.getPasswordActual(), request.getNuevaPassword());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> eliminarCuenta(Authentication authentication,
                                               @Valid @RequestBody DeleteAccountRequestDTO request) {
        Usuario usuario = usuarioService.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", 0L));
        usuarioService.eliminarCuenta(usuario.getId(), request.getPassword());
        return ResponseEntity.ok().build();
    }

    // POST /usuarios/me/premium - activar premium
    @PostMapping("/me/premium")
    public PerfilResponseDTO activarPremium(Authentication authentication) {
        Usuario usuario = usuarioService.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", 0L));

        if (!(usuario instanceof Persona persona)) {
            throw new BusinessException("Solo los usuarios personales pueden activar premium");
        }

        personaService.activarPremium(persona.getId());
        return perfilService.obtenerPerfil(usuario.getId());
    }

    private void validarFoto(MultipartFile foto) {
        if (foto.isEmpty()) {
            throw new BusinessException("La foto no puede estar vacía");
        }
        String contentType = foto.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BusinessException("Solo se permiten imágenes (JPEG, PNG, GIF, WebP)");
        }
        if (foto.getSize() > 5 * 1024 * 1024) {
            throw new BusinessException("La foto no puede superar los 5MB");
        }
    }

}
