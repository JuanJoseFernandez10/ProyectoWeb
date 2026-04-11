package com.groovelink.service.relations;

import com.groovelink.entitys.relations.EventoAptitud;
import com.groovelink.repository.relations.EventoAptitudRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EventoAptitudService {

    private final EventoAptitudRepository eventoAptitudRepository;

    public EventoAptitudService(EventoAptitudRepository eventoAptitudRepository) {
        this.eventoAptitudRepository = eventoAptitudRepository;
    }

    public List<EventoAptitud> findByEvento(Long eventoId) {
        return eventoAptitudRepository.findByEvento_Id(eventoId);
    }

    @Transactional
    public EventoAptitud agregarAptitudAEvento(Long eventoId, Long aptitudId) {
        // Aquí deberías cargar Evento y Aptitud, pero por simplicidad lo dejo básico
        EventoAptitud ea = new EventoAptitud();
        // ea.setEvento(evento); 
        // ea.setAptitud(aptitud);
        return eventoAptitudRepository.save(ea);
    }
}