package com.groovelink.service;

import com.groovelink.entitys.Perfil;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.repository.PerfilRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class PerfilService {

    private final PerfilRepository perfilRepository;

    public PerfilService(PerfilRepository perfilRepository) {
        this.perfilRepository = perfilRepository;
    }

    @Transactional
    public Perfil actualizarDescripcion(Long perfilId, String descripcion) {
        Perfil perfil = perfilRepository.findById(perfilId)
                .orElseThrow(() -> new ResourceNotFoundException("Perfil", perfilId));

        perfil.setDescripcion(descripcion);
        perfil.setFechaActualizacion(java.time.LocalDateTime.now());

        return perfilRepository.save(perfil);
    }
}