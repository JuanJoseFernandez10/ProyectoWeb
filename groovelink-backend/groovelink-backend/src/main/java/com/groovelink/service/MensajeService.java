package com.groovelink.service;

import com.groovelink.entitys.Mensaje;
import com.groovelink.repository.MensajeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MensajeService {

    private final MensajeRepository mensajeRepository;

    public MensajeService(MensajeRepository mensajeRepository) {
        this.mensajeRepository = mensajeRepository;
    }

    public Optional<Mensaje> findById(Long id) {
        return mensajeRepository.findById(id);
    }

    public List<Mensaje> findByChat(Long chatId) {
        return mensajeRepository.findByChat_IdOrderByFechaEnvioAsc(chatId);
    }
}