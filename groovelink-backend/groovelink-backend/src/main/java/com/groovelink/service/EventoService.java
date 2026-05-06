package com.groovelink.service;

import com.groovelink.entitys.Evento;
import com.groovelink.dto.response.EventoResponseDTO;
import com.groovelink.mapper.GrooveLinkMapper;
import com.groovelink.entitys.Persona;
import com.groovelink.entitys.relations.PersonaMeGustaEvento;
import com.groovelink.entitys.relations.PersonaUneEvento;
import com.groovelink.exception.*;
import com.groovelink.repository.*;
import com.groovelink.repository.relations.PersonaMeGustaEventoRepository;
import com.groovelink.repository.relations.PersonaUneEventoRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EventoService {

    private final EventoRepository eventoRepository;
    private final PersonaRepository personaRepository;
    private final PersonaUneEventoRepository personaUneEventoRepository;
    private final PersonaMeGustaEventoRepository personaMeGustaEventoRepository;
    private final GrooveLinkMapper mapper;

    public EventoService(EventoRepository eventoRepository,
                         PersonaRepository personaRepository,
                         PersonaUneEventoRepository personaUneEventoRepository,
                         PersonaMeGustaEventoRepository personaMeGustaEventoRepository,
                         GrooveLinkMapper mapper) {
        this.eventoRepository = eventoRepository;
        this.personaRepository = personaRepository;
        this.personaUneEventoRepository = personaUneEventoRepository;
        this.personaMeGustaEventoRepository = personaMeGustaEventoRepository;
        this.mapper = mapper;
    }

    @Cacheable(value = "eventos", key = "#id")
    public List<Evento> findAll() {
        return eventoRepository.findAll();
    }

    public Page<Evento> findAllOrdenadosPorMeGustas(Pageable pageable) {
        Page<Evento> page = eventoRepository.findAllOrderByMeGustasDesc(pageable);
        page.forEach(this::cargarNumeroMeGustas);
        return page;
    }

    @Transactional(readOnly = true)
    public Page<EventoResponseDTO> findAllOrdenadosPorMeGustasDto(Pageable pageable) {
        Page<Evento> page = eventoRepository.findAllOrderByMeGustasDesc(pageable);
        page.forEach(this::cargarNumeroMeGustas);
        return page.map(mapper::toEventoResponseDTO);
    }

    @Cacheable(value = "eventos", key = "#id")
    public Optional<Evento> findById(Long id) {
        Optional<Evento> evento = eventoRepository.findById(id);
        evento.ifPresent(this::cargarNumeroMeGustas);
        return evento;
    }

    @Transactional
    @CacheEvict(value = "eventos", allEntries = true)
    public Evento save(Evento evento) {
        return eventoRepository.save(evento);
    }

    @Transactional
    public void darMeGusta(Long personaId, Long eventoId) {
        Persona persona = personaRepository.findById(personaId)
                .orElseThrow(() -> new ResourceNotFoundException("Persona", personaId));

        Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new ResourceNotFoundException("Evento", eventoId));

        if (personaMeGustaEventoRepository.existsByUsuario_IdAndEvento_Id(personaId, eventoId)) {
            throw new BusinessException("Ya marcaste me gusta en este evento");
        }

        PersonaMeGustaEvento meGusta = new PersonaMeGustaEvento();
        meGusta.setUsuario(persona);
        meGusta.setEvento(evento);
        personaMeGustaEventoRepository.save(meGusta);
    }

    @Transactional
    public void quitarMeGusta(Long personaId, Long eventoId) {
        if (!personaMeGustaEventoRepository.existsByUsuario_IdAndEvento_Id(personaId, eventoId)) {
            throw new BusinessException("No habías marcado me gusta en este evento");
        }

        personaMeGustaEventoRepository.deleteByUsuario_IdAndEvento_Id(personaId, eventoId);
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

    private void cargarNumeroMeGustas(Evento evento) {
        evento.setNumeroMeGustas(personaMeGustaEventoRepository.countByEvento_Id(evento.getId()));
        // cuento asistentes aquí para no pelearme con lazy fuera de la sesión
        try {
            int asistentes = personaUneEventoRepository.findByEvento_Id(evento.getId()).size();
            evento.setNumeroAsistentes(asistentes);
        } catch (Exception e) {
            evento.setNumeroAsistentes(0);
        }
    }
}