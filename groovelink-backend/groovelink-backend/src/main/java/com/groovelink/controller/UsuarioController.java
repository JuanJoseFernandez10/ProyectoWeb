package com.groovelink.controller;

import com.groovelink.dto.request.PerfilUpdateRequestDTO;
import com.groovelink.dto.response.PerfilResponseDTO;
import com.groovelink.service.PerfilService;
import com.groovelink.service.UsuarioService;
import com.groovelink.entitys.Usuario;
import com.groovelink.exception.BusinessException;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.dto.request.PersonalizarRequestDTO;
import com.groovelink.service.PersonaService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

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
                                                @RequestBody PerfilUpdateRequestDTO request) {
        Usuario usuario = usuarioService.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", 0L));

        return perfilService.actualizarDescripcion(usuario.getId(), request.getDescripcion());
    }

    // PUT /usuarios/me/personalizar - personalización post-registro (aptitudes, géneros, descripción, ubicación)
    @PutMapping("/me/personalizar")
    public PerfilResponseDTO personalizarPerfil(Authentication authentication,
                                                @RequestBody PersonalizarRequestDTO request) {
        Usuario usuario = usuarioService.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", 0L));
        
        Long usuarioId = usuario.getId();
        
        // Actualizar descripción y ubicación
        PerfilResponseDTO perfilActualizado = perfilService.actualizarPersonalizacion(
                usuarioId, request.getDescripcion(), request.getUbicacion());
        
        // Reemplazar aptitudes y géneros si se proporcionaron
        if (usuario instanceof com.groovelink.entitys.Persona) {
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

        if (foto.isEmpty()) {
            throw new BusinessException("La foto no puede estar vacía");
        }

        perfilService.subirFotoPerfil(usuario.getId(), foto);
        return perfilService.obtenerPerfil(usuario.getId());
    }

    // GET /perfiles/{usuarioId}/foto - descargar foto de perfil
    @GetMapping("/perfiles/{usuarioId}/foto")
    public ResponseEntity<ByteArrayResource> descargarFotoPerfil(@PathVariable Long usuarioId) {
        try {
            Path rutaFoto = perfilService.obtenerFotoPerfil(usuarioId);
            byte[] fotoData = Files.readAllBytes(rutaFoto);
            ByteArrayResource resource = new ByteArrayResource(fotoData);

            String contentType = determinarContentType(rutaFoto);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header("Content-Disposition", "inline; filename=\"fotoperfil\"")
                    .body(resource);
        } catch (IOException e) {
            throw new BusinessException("No se pudo leer la foto de perfil: " + e.getMessage());
        }
    }

    private String determinarContentType(Path ruta) {
        String filename = ruta.getFileName().toString().toLowerCase();
        if (filename.endsWith(".png")) {
            return "image/png";
        } else if (filename.endsWith(".gif")) {
            return "image/gif";
        } else if (filename.endsWith(".webp")) {
            return "image/webp";
        }
        return "image/jpeg";
    }
}
