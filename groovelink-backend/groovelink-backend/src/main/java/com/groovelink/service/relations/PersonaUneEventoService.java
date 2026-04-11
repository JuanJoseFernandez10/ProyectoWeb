package com.groovelink.service.relations;

import com.groovelink.entitys.relations.PersonaUneEvento;
import com.groovelink.repository.relations.PersonaUneEventoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersonaUneEventoService {

    private final PersonaUneEventoRepository personaUneEventoRepository;

    public PersonaUneEventoService(PersonaUneEventoRepository personaUneEventoRepository) {
        this.personaUneEventoRepository = personaUneEventoRepository;
    }

    public List<PersonaUneEvento> findByUsuario(Long usuarioId) {
        return personaUneEventoRepository.findByUsuario_Id(usuarioId);
    }

    public List<PersonaUneEvento> findByEvento(Long eventoId) {
        return personaUneEventoRepository.findByEvento_Id(eventoId);
    }

    public boolean existeInscripcion(Long personaId, Long eventoId) {
        return personaUneEventoRepository.existsByUsuario_IdAndEvento_Id(personaId, eventoId);
    }
}