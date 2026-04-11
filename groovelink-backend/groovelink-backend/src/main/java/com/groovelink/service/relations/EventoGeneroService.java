package com.groovelink.service;

import com.groovelink.entitys.relations.EventoGenero;
import com.groovelink.repository.EventoGeneroRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EventoGeneroService {

    private final EventoGeneroRepository eventoGeneroRepository;

    public EventoGeneroService(EventoGeneroRepository eventoGeneroRepository) {
        this.eventoGeneroRepository = eventoGeneroRepository;
    }

    public List<EventoGenero> findByEvento(Long eventoId) {
        return eventoGeneroRepository.findByEvento_Id(eventoId);
    }
}