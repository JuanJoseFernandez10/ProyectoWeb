package com.groovelink.service.relations;

import com.groovelink.entitys.relations.PersonaComentarioEvento;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.repository.EventoRepository;
import com.groovelink.repository.relations.PersonaComentarioEventoRepository;
import com.groovelink.repository.PersonaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PersonaComentarioEventoService {

    private final PersonaComentarioEventoRepository comentarioRepository;
    private final PersonaRepository personaRepository;
    private final EventoRepository eventoRepository;

    public PersonaComentarioEventoService(PersonaComentarioEventoRepository comentarioRepository,
                                          PersonaRepository personaRepository,
                                          EventoRepository eventoRepository) {
        this.comentarioRepository = comentarioRepository;
        this.personaRepository = personaRepository;
        this.eventoRepository = eventoRepository;
    }

    public List<PersonaComentarioEvento> findByEvento(Long eventoId) {
        return comentarioRepository.findByEvento_IdOrderByFechaDesc(eventoId);
    }

    @Transactional
    public PersonaComentarioEvento agregarComentario(PersonaComentarioEvento comentario) {
        personaRepository.findById(comentario.getUsuario().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Persona", comentario.getUsuario().getId()));

        eventoRepository.findById(comentario.getEvento().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Evento", comentario.getEvento().getId()));

        return comentarioRepository.save(comentario);
    }

    @Transactional
    public void incrementarMeGusta(Long comentarioId) {
        PersonaComentarioEvento comentario = comentarioRepository.findById(comentarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Comentario", comentarioId));

        comentario.setMegustas(comentario.getMegustas() + 1);
        comentarioRepository.save(comentario);
    }
}