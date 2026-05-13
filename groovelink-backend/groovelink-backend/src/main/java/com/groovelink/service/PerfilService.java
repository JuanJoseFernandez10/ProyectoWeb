package com.groovelink.service;

import com.groovelink.dto.response.PerfilResponseDTO;
import com.groovelink.entitys.Perfil;
import com.groovelink.entitys.Persona;
import com.groovelink.entitys.Usuario;
import com.groovelink.exception.BusinessException;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.repository.PerfilRepository;
import com.groovelink.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;

@Service
public class PerfilService {

    @Value("${app.fotos-perfil.base-dir}")
    private String baseDir;

    private final PerfilRepository perfilRepository;
    private final UsuarioRepository usuarioRepository;

    public PerfilService(PerfilRepository perfilRepository, UsuarioRepository usuarioRepository) {
        this.perfilRepository = perfilRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public PerfilResponseDTO obtenerPerfil(Long usuarioId) {
        Perfil perfil = obtenerOCrearPerfil(usuarioId);

        Usuario usuario = perfil.getUsuario();
        if (usuario == null) {
            throw new BusinessException("Perfil sin usuario asociado");
        }

        PerfilResponseDTO dto = new PerfilResponseDTO();
        dto.setId(usuario.getId());
        dto.setUsername(usuario.getUsername());
        dto.setEmail(usuario.getEmail());
        dto.setDescripcion(perfil.getDescripcion());
        dto.setFotoPerfilUrl(perfil.getRutaFotoPerfil() != null ? "/usuarios/perfiles/" + usuarioId + "/foto" : null);
        dto.setUbicacion(perfil.getUbicacion());
        
        // Si es Persona, mostrar premium flag
        if (usuario instanceof Persona persona) {
            dto.setPremium(persona.isPremium());
        }

        return dto;
    }

    @Transactional
    public PerfilResponseDTO actualizarDescripcion(Long usuarioId, String descripcion) {
        Perfil perfil = obtenerOCrearPerfil(usuarioId);

        perfil.setDescripcion(descripcion);
        perfil.setFechaActualizacion(LocalDateTime.now());
        perfilRepository.save(perfil);

        return obtenerPerfil(usuarioId);
    }

    @Transactional
    public Perfil actualizarDescripcionEntity(Long perfilId, String descripcion) {
        Perfil perfil = perfilRepository.findById(perfilId)
                .orElseThrow(() -> new ResourceNotFoundException("Perfil", perfilId));

        perfil.setDescripcion(descripcion);
        perfil.setFechaActualizacion(LocalDateTime.now());

        return perfilRepository.save(perfil);
    }

    @Transactional
    public PerfilResponseDTO actualizarPersonalizacion(Long usuarioId, String descripcion, String ubicacion) {
        Perfil perfil = obtenerOCrearPerfil(usuarioId);
        
        if (descripcion != null) {
            perfil.setDescripcion(descripcion);
        }
        if (ubicacion != null) {
            perfil.setUbicacion(ubicacion);
        }
        perfil.setFechaActualizacion(LocalDateTime.now());
        perfilRepository.save(perfil);
        
        return obtenerPerfil(usuarioId);
    }

    @Transactional
    public void subirFotoPerfil(Long usuarioId, MultipartFile archivo) {
        Perfil perfil = obtenerOCrearPerfil(usuarioId);

        try {
            // Crear directorio para el usuario si no existe
            Path usuarioDir = crearDirectorioUsuario(usuarioId);

            // Obtener extensión del archivo
            String extension = obtenerExtensionArchivo(archivo);
            String nombreArchivo = "fotoperfil" + extension;
            Path rutaArchivo = usuarioDir.resolve(nombreArchivo);

            // Guardar archivo en disco (reemplazar si existe)
            Files.copy(archivo.getInputStream(), rutaArchivo, StandardCopyOption.REPLACE_EXISTING);

            // Actualizar perfil con ruta
            perfil.setRutaFotoPerfil(rutaArchivo.toString());
            perfil.setFechaActualizacion(LocalDateTime.now());
            perfilRepository.save(perfil);

        } catch (IOException e) {
            throw new BusinessException("No se pudo guardar la foto de perfil: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public Path obtenerFotoPerfil(Long usuarioId) {
        Perfil perfil = obtenerOCrearPerfil(usuarioId);

        if (perfil.getRutaFotoPerfil() == null) {
            throw new ResourceNotFoundException("Foto de perfil no disponible", usuarioId);
        }

        Path ruta = Paths.get(perfil.getRutaFotoPerfil());
        if (!Files.exists(ruta)) {
            throw new ResourceNotFoundException("Foto de perfil no encontrada en disco", usuarioId);
        }

        return ruta;
    }

    private Path crearDirectorioUsuario(Long usuarioId) throws IOException {
        Path usuarioDir = Paths.get(baseDir, "usuario_" + usuarioId);
        Files.createDirectories(usuarioDir);
        return usuarioDir;
    }

    private String obtenerExtensionArchivo(MultipartFile archivo) {
        String originalFilename = archivo.getOriginalFilename();
        if (originalFilename != null) {
            int index = originalFilename.lastIndexOf('.');
            if (index >= 0) {
                return originalFilename.substring(index);
            }
        }

        String contentType = archivo.getContentType();
        if (contentType == null) {
            return ".jpg";
        }

        if (contentType.contains("png")) {
            return ".png";
        }
        if (contentType.contains("webp")) {
            return ".webp";
        }
        if (contentType.contains("gif")) {
            return ".gif";
        }

        return ".jpg";
    }

    private Perfil obtenerOCrearPerfil(Long usuarioId) {
        return perfilRepository.findById(usuarioId).orElseGet(() -> {
            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario", usuarioId));

            Perfil perfil = new Perfil();
            perfil.setUsuario(usuario);
            perfil.setDescripcion("");
            return perfilRepository.save(perfil);
        });
    }
}