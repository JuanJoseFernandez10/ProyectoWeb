package com.groovelink.service;

import com.groovelink.entitys.relations.FotoEvento;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.repository.EventoRepository;
import com.groovelink.repository.FotoEventoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class FotoEventoService {

    private final FotoEventoRepository fotoEventoRepository;
    private final EventoRepository eventoRepository;

    public FotoEventoService(FotoEventoRepository fotoEventoRepository, EventoRepository eventoRepository) {
        this.fotoEventoRepository = fotoEventoRepository;
        this.eventoRepository = eventoRepository;
    }

    public List<FotoEvento> findByEvento(Long eventoId) {
        return fotoEventoRepository.findByEvento_IdOrderByOrdenAsc(eventoId);
    }

    @Transactional
    public FotoEvento agregarFoto(Long eventoId, FotoEvento fotoEvento) {
        eventoRepository.findById(eventoId)
                .orElseThrow(() -> new ResourceNotFoundException("Evento", eventoId));

        fotoEvento.setEvento(null); // Se asigna en el controlador o aquí si prefieres
        return fotoEventoRepository.save(fotoEvento);
    }
}