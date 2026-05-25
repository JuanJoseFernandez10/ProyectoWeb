package com.groovelink.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
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
import java.util.Map;
import java.util.Optional;

@Service
public class PerfilService {

    private final Cloudinary cloudinary;
    private final String cloudinaryFolder;
    private final String localBaseDir;
    private final PerfilRepository perfilRepository;
    private final UsuarioRepository usuarioRepository;

    public PerfilService(Optional<Cloudinary> cloudinary,
                         @Value("${app.cloudinary.folder}") String cloudinaryFolder,
                         @Value("${app.fotos-perfil.base-dir}") String localBaseDir,
                         PerfilRepository perfilRepository,
                         UsuarioRepository usuarioRepository) {
        this.cloudinary = cloudinary.orElse(null);
        this.cloudinaryFolder = cloudinaryFolder;
        this.localBaseDir = localBaseDir;
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
            if (cloudinary != null) {
                String publicId = cloudinaryFolder + "/perfiles/usuario_" + usuarioId + "/fotoperfil";

                Map<?, ?> uploadResult = cloudinary.uploader().upload(archivo.getBytes(),
                    ObjectUtils.asMap(
                        "public_id", publicId,
                        "overwrite", true,
                        "resource_type", "image"
                    ));

                String url = (String) uploadResult.get("secure_url");
                perfil.setRutaFotoPerfil(url);
            } else {
                Path usuarioDir = Paths.get(localBaseDir, "usuario_" + usuarioId);
                Files.createDirectories(usuarioDir);

                String extension = "";
                String originalFilename = archivo.getOriginalFilename();
                if (originalFilename != null && originalFilename.contains(".")) {
                    extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }

                Path rutaArchivo = usuarioDir.resolve("fotoperfil" + extension);
                Files.copy(archivo.getInputStream(), rutaArchivo, StandardCopyOption.REPLACE_EXISTING);

                perfil.setRutaFotoPerfil(rutaArchivo.toString());
            }

            perfil.setFechaActualizacion(LocalDateTime.now());
            perfilRepository.save(perfil);

        } catch (IOException e) {
            throw new BusinessException("No se pudo guardar la foto de perfil: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public String obtenerUrlFotoPerfil(Long usuarioId) {
        Perfil perfil = obtenerOCrearPerfil(usuarioId);

        if (perfil.getRutaFotoPerfil() == null) {
            throw new ResourceNotFoundException("Foto de perfil no disponible", usuarioId);
        }

        return perfil.getRutaFotoPerfil();
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