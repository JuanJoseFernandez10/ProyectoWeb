package com.groovelink.service;

import com.groovelink.entitys.Administrador;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.repository.AdministradorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AdministradorService {

    private final AdministradorRepository administradorRepository;

    public AdministradorService(AdministradorRepository administradorRepository) {
        this.administradorRepository = administradorRepository;
    }

    public Optional<Administrador> findById(Long id) {
        return administradorRepository.findById(id);
    }

    public List<Administrador> findAll() {
        return administradorRepository.findAll();
    }

    @Transactional
    public Administrador save(Administrador administrador) {
        return administradorRepository.save(administrador);
    }
}