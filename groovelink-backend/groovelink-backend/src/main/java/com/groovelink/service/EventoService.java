package com.groovelink.service;

import com.groovelink.entitys.Evento;
import com.groovelink.dto.response.EventoResponseDTO;
import com.groovelink.mapper.GrooveLinkMapper;
import com.groovelink.entitys.Aptitud;
import com.groovelink.entitys.Genero;
import com.groovelink.entitys.Persona;
import com.groovelink.entitys.Usuario;
import com.groovelink.entitys.relations.EventoAptitud;
import com.groovelink.entitys.relations.EventoGenero;
import com.groovelink.entitys.relations.PersonaMeGustaEvento;
import com.groovelink.entitys.relations.PersonaUneEvento;
import com.groovelink.exception.*;
import com.groovelink.repository.AptitudRepository;
import com.groovelink.repository.EventoRepository;
import com.groovelink.repository.GeneroRepository;
import com.groovelink.repository.PersonaRepository;
import com.groovelink.repository.UsuarioRepository;
import com.groovelink.repository.relations.PersonaMeGustaEventoRepository;
import com.groovelink.repository.relations.PersonaUneEventoRepository;
import com.groovelink.service.relations.FotoEventoService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventoService {

    private final EventoRepository eventoRepository;
    private final PersonaRepository personaRepository;
    private final UsuarioRepository usuarioRepository;
    private final PersonaUneEventoRepository personaUneEventoRepository;
    private final PersonaMeGustaEventoRepository personaMeGustaEventoRepository;
    private final AptitudRepository aptitudRepository;
    private final GeneroRepository generoRepository;
    private final GrooveLinkMapper mapper;
    private final FotoEventoService fotoEventoService;

    public EventoService(EventoRepository eventoRepository,
                         PersonaRepository personaRepository,
                         UsuarioRepository usuarioRepository,
                         PersonaUneEventoRepository personaUneEventoRepository,
                         PersonaMeGustaEventoRepository personaMeGustaEventoRepository,
                         AptitudRepository aptitudRepository,
                         GeneroRepository generoRepository,
                         GrooveLinkMapper mapper,
                         FotoEventoService fotoEventoService) {
        this.eventoRepository = eventoRepository;
        this.personaRepository = personaRepository;
        this.usuarioRepository = usuarioRepository;
        this.personaUneEventoRepository = personaUneEventoRepository;
        this.personaMeGustaEventoRepository = personaMeGustaEventoRepository;
        this.aptitudRepository = aptitudRepository;
        this.generoRepository = generoRepository;
        this.mapper = mapper;
        this.fotoEventoService = fotoEventoService;
    }

    @Cacheable(value = "eventosList", key = "'all'")
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

    @Transactional(readOnly = true)
    public Page<EventoResponseDTO> findAllOrdenadosPorMeGustasDto(Pageable pageable, Long usuarioId) {
        Page<Evento> page = eventoRepository.findAllOrderByMeGustasDesc(pageable);
        page.forEach(this::cargarNumeroMeGustas);
        return page.map(evento -> {
            EventoResponseDTO dto = mapper.toEventoResponseDTO(evento);
            if (usuarioId != null) {
                dto.setLikedByMe(
                    personaMeGustaEventoRepository.existsByUsuario_IdAndEvento_Id(usuarioId, evento.getId())
                );
            }
            return dto;
        });
    }

    @Cacheable(value = "eventos", key = "#id")
    public Optional<Evento> findById(Long id) {
        Optional<Evento> evento = eventoRepository.findById(id);
        evento.ifPresent(this::cargarNumeroMeGustas);
        return evento;
    }

    @Transactional(readOnly = true)
    public List<Evento> findEventosPublicadosPorUsuario(Long usuarioId) {
        List<Evento> eventos = eventoRepository.findEventosPublicadosPorUsuario(usuarioId);
        eventos.forEach(this::cargarNumeroMeGustas);
        return eventos;
    }

    @Transactional
    @CacheEvict(value = {"eventos", "eventosList"}, allEntries = true)
    public Evento save(Evento evento) {
        return eventoRepository.save(evento);
    }

    @Transactional
    public void darMeGusta(Long usuarioId, Long eventoId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", usuarioId));

        Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new ResourceNotFoundException("Evento", eventoId));

        if (personaMeGustaEventoRepository.existsByUsuario_IdAndEvento_Id(usuarioId, eventoId)) {
            throw new BusinessException("Ya marcaste me gusta en este evento");
        }

        PersonaMeGustaEvento meGusta = new PersonaMeGustaEvento();
        meGusta.setUsuario(usuario);
        meGusta.setEvento(evento);
        personaMeGustaEventoRepository.save(meGusta);
    }

    @Transactional
    public void quitarMeGusta(Long usuarioId, Long eventoId) {
        if (!personaMeGustaEventoRepository.existsByUsuario_IdAndEvento_Id(usuarioId, eventoId)) {
            throw new BusinessException("No habías marcado me gusta en este evento");
        }

        personaMeGustaEventoRepository.deleteByUsuario_IdAndEvento_Id(usuarioId, eventoId);
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

    @Transactional
    @CacheEvict(value = {"eventos", "eventosList"}, allEntries = true)
    public void eliminarEvento(Long eventoId) {
        Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new ResourceNotFoundException("Evento", eventoId));

        if (evento.getFotos() != null) {
            evento.getFotos().forEach(foto -> fotoEventoService.eliminarFoto(foto.getId()));
        }

        eventoRepository.delete(evento);
    }

    public List<EventoAptitud> crearRelacionesAptitudes(Evento evento, List<Long> aptitudesIds) {
        if (aptitudesIds == null) return List.of();
        return aptitudesIds.stream()
                .map(aptitudId -> {
                    Aptitud aptitud = aptitudRepository.findById(aptitudId)
                            .orElseThrow(() -> new ResourceNotFoundException("Aptitud", aptitudId));
                    EventoAptitud eventoAptitud = new EventoAptitud();
                    eventoAptitud.setEvento(evento);
                    eventoAptitud.setAptitud(aptitud);
                    return eventoAptitud;
                })
                .collect(Collectors.toList());
    }

    public List<EventoGenero> crearRelacionesGeneros(Evento evento, List<Long> generosIds) {
        if (generosIds == null) return List.of();
        return generosIds.stream()
                .map(generoId -> {
                    Genero genero = generoRepository.findById(generoId)
                            .orElseThrow(() -> new ResourceNotFoundException("Genero", generoId));
                    EventoGenero eventoGenero = new EventoGenero();
                    eventoGenero.setEvento(evento);
                    eventoGenero.setGenero(genero);
                    return eventoGenero;
                })
                .collect(Collectors.toList());
    }

    private void cargarNumeroMeGustas(Evento evento) {
        evento.setNumeroMeGustas(personaMeGustaEventoRepository.countByEvento_Id(evento.getId()));
        try {
            long asistentes = personaUneEventoRepository.countByEvento_Id(evento.getId());
            evento.setNumeroAsistentes((int) asistentes);
        } catch (Exception e) {
            evento.setNumeroAsistentes(0);
        }
    }
}
