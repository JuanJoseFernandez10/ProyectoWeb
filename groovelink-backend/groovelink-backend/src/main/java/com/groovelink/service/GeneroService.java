package com.groovelink.service;

import com.groovelink.entitys.Genero;
import com.groovelink.exception.DuplicateResourceException;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.repository.GeneroRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class GeneroService {

    private final GeneroRepository generoRepository;

    public GeneroService(GeneroRepository generoRepository) {
        this.generoRepository = generoRepository;
    }

    public List<Genero> findAll() {
        return generoRepository.findAll();
    }

    public Optional<Genero> findById(Long id) {
        return generoRepository.findById(id);
    }

    public Optional<Genero> findByNombre(String nombre) {
        return generoRepository.findByNombre(nombre);
    }

    @Transactional
    public Genero save(Genero genero) {
        if (generoRepository.findByNombre(genero.getNombre()).isPresent()) {
            throw new DuplicateResourceException("Genero", "nombre");
        }
        return generoRepository.save(genero);
    }
}