package com.groovelink.service;

import com.groovelink.entitys.Evento;
import com.groovelink.entitys.Persona;
import com.groovelink.entitys.relations.PersonaUneEvento;
import com.groovelink.exception.*;
import com.groovelink.repository.*;
import com.groovelink.repository.relations.PersonaUneEventoRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EventoService {

    private final EventoRepository eventoRepository;
    private final PersonaRepository personaRepository;
    private final PersonaUneEventoRepository personaUneEventoRepository;

    public EventoService(EventoRepository eventoRepository,
                         PersonaRepository personaRepository,
                         PersonaUneEventoRepository personaUneEventoRepository) {
        this.eventoRepository = eventoRepository;
        this.personaRepository = personaRepository;
        this.personaUneEventoRepository = personaUneEventoRepository;
    }

    @Cacheable(value = "eventos", key = "#id")
    public Optional<Evento> findById(Long id) {
        return eventoRepository.findById(id);
    }

    @Transactional
    @CacheEvict(value = "eventos", allEntries = true)
    public Evento save(Evento evento) {
        return eventoRepository.save(evento);
    }

    @Cacheable(value = "eventosFuturos")
    public List<Evento> findEventosFuturos() {
        return eventoRepository.findByFechaInicioAfter(LocalDate.now());
    }

    @Transactional
    public void inscribirEnEvento(Long personaId, Long eventoId) {
        Persona persona = personaRepository.findById(personaId)
                .orElseThrow(() -> new ResourceNotFoundException("Persona", personaId));

        Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new ResourceNotFoundException("Evento", eventoId));

        if (evento.getFechaInicio().isBefore(LocalDate.now())) {
            throw new InvalidOperationException("No puedes inscribirte a un evento que ya pasó");
        }

        if (personaUneEventoRepository.existsByUsuario_IdAndEvento_Id(personaId, eventoId)) {
            throw new BusinessException("Ya estás inscrito en este evento");
        }

        PersonaUneEvento asistencia = new PersonaUneEvento();
        asistencia.setUsuario(persona);
        asistencia.setEvento(evento);

        personaUneEventoRepository.save(asistencia);
    }

    @Transactional
    public void cancelarAsistencia(Long personaId, Long eventoId) {
        if (!personaUneEventoRepository.existsByUsuario_IdAndEvento_Id(personaId, eventoId)) {
            throw new BusinessException("No estás inscrito en este evento");
        }
        personaUneEventoRepository.deleteByUsuario_IdAndEvento_Id(personaId, eventoId);
    }
}