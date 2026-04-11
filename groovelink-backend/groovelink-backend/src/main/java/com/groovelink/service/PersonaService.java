package com.groovelink.service;

import com.groovelink.entitys.Persona;
import com.groovelink.entitys.relations.PersonaAptitud;
import com.groovelink.entitys.relations.PersonaGenero;
import com.groovelink.exception.*;
import com.groovelink.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PersonaService {

    private final PersonaRepository personaRepository;
    private final PersonaAptitudRepository personaAptitudRepository;
    private final PersonaGeneroRepository personaGeneroRepository;
    private final PersonaUneEventoRepository personaUneEventoRepository;
    private final AptitudRepository aptitudRepository;
    private final GeneroRepository generoRepository;

    public PersonaService(PersonaRepository personaRepository,
                          PersonaAptitudRepository personaAptitudRepository,
                          PersonaGeneroRepository personaGeneroRepository,
                          PersonaUneEventoRepository personaUneEventoRepository,
                          AptitudRepository aptitudRepository,
                          GeneroRepository generoRepository) {
        this.personaRepository = personaRepository;
        this.personaAptitudRepository = personaAptitudRepository;
        this.personaGeneroRepository = personaGeneroRepository;
        this.personaUneEventoRepository = personaUneEventoRepository;
        this.aptitudRepository = aptitudRepository;
        this.generoRepository = generoRepository;
    }

    public Optional<Persona> findById(Long id) {
        return personaRepository.findById(id);
    }

    @Transactional
    public Persona save(Persona persona) {
        return personaRepository.save(persona);
    }

    @Transactional
    public void agregarAptitud(Long personaId, Long aptitudId) {
        Persona persona = personaRepository.findById(personaId)
                .orElseThrow(() -> new ResourceNotFoundException("Persona", personaId));

        Aptitud aptitud = aptitudRepository.findById(aptitudId)
                .orElseThrow(() -> new ResourceNotFoundException("Aptitud", aptitudId));

        if (personaAptitudRepository.existsByUsuario_IdAndAptitud_Id(personaId, aptitudId)) {
            throw new DuplicateResourceException("Aptitud", "persona");
        }

        PersonaAptitud relacion = new PersonaAptitud();
        relacion.setUsuario(persona);
        relacion.setAptitud(aptitud);
        personaAptitudRepository.save(relacion);
    }

    @Transactional
    public void eliminarAptitud(Long personaId, Long aptitudId) {
        personaAptitudRepository.deleteByUsuario_IdAndAptitud_Id(personaId, aptitudId);
    }

    @Transactional
    public void agregarGenero(Long personaId, Long generoId) {
        Persona persona = personaRepository.findById(personaId)
                .orElseThrow(() -> new ResourceNotFoundException("Persona", personaId));

        Genero genero = generoRepository.findById(generoId)
                .orElseThrow(() -> new ResourceNotFoundException("Genero", generoId));

        if (personaGeneroRepository.existsByUsuario_IdAndGenero_Id(personaId, generoId)) {
            throw new DuplicateResourceException("Genero", "persona");
        }

        PersonaGenero relacion = new PersonaGenero();
        relacion.setUsuario(persona);
        relacion.setGenero(genero);
        personaGeneroRepository.save(relacion);
    }

    @Transactional
    public void eliminarGenero(Long personaId, Long generoId) {
        personaGeneroRepository.deleteByUsuario_IdAndGenero_Id(personaId, generoId);
    }

    public List<Persona> findAllPremium() {
        return personaRepository.findByPremiumTrue();
    }
}