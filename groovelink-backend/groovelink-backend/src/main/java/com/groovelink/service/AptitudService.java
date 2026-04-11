package com.groovelink.service;

import com.groovelink.entitys.Aptitud;
import com.groovelink.exception.DuplicateResourceException;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.repository.AptitudRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AptitudService {

    private final AptitudRepository aptitudRepository;

    public AptitudService(AptitudRepository aptitudRepository) {
        this.aptitudRepository = aptitudRepository;
    }

    public List<Aptitud> findAll() {
        return aptitudRepository.findAll();
    }

    public Optional<Aptitud> findById(Long id) {
        return aptitudRepository.findById(id);
    }

    public Optional<Aptitud> findByNombre(String nombre) {
        return aptitudRepository.findByNombre(nombre);
    }

    @Transactional
    public Aptitud save(Aptitud aptitud) {
        if (aptitudRepository.findByNombre(aptitud.getNombre()).isPresent()) {
            throw new DuplicateResourceException("Aptitud", "nombre");
        }
        return aptitudRepository.save(aptitud);
    }
}