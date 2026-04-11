package com.groovelink.service;

import com.groovelink.entitys.Empresa;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.repository.EmpresaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class EmpresaService {

    private final EmpresaRepository empresaRepository;

    public EmpresaService(EmpresaRepository empresaRepository) {
        this.empresaRepository = empresaRepository;
    }

    public Optional<Empresa> findById(Long id) {
        return empresaRepository.findById(id);
    }

    public List<Empresa> findAll() {
        return empresaRepository.findAll();
    }

    @Transactional
    public Empresa save(Empresa empresa) {
        return empresaRepository.save(empresa);
    }
}