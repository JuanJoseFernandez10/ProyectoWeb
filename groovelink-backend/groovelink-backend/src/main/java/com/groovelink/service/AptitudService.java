package com.groovelink.service;

import com.groovelink.entitys.Aptitud;
import com.groovelink.exception.DuplicateResourceException;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.repository.AptitudRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

import java.util.List;
import java.util.Optional;

@Service
public class AptitudService {

    private final AptitudRepository aptitudRepository;

    public AptitudService(AptitudRepository aptitudRepository) {
        this.aptitudRepository = aptitudRepository;
    }

    @Cacheable(value = "aptitudes", unless = "#result == null || #result.isEmpty()")
    public List<Aptitud> findAll() {
        return aptitudRepository.findAll();
    }

    @Cacheable(value = "aptitudes", key = "#id")
    public Optional<Aptitud> findById(Long id) {
        return aptitudRepository.findById(id);
    }

    public Optional<Aptitud> findByNombre(String nombre) {
        return aptitudRepository.findByNombre(nombre);
    }

    @Transactional
    @CacheEvict(value = "aptitudes", allEntries = true)
    public Aptitud save(Aptitud aptitud) {
        if (aptitudRepository.findByNombre(aptitud.getNombre()).isPresent()) {
            throw new DuplicateResourceException("Aptitud", "nombre");
        }
        return aptitudRepository.save(aptitud);
    }
}