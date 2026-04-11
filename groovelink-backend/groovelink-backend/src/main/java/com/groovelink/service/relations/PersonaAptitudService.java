package com.groovelink.service.relations;

import com.groovelink.entitys.relations.PersonaAptitud;
import com.groovelink.repository.relations.PersonaAptitudRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersonaAptitudService {

    private final PersonaAptitudRepository personaAptitudRepository;

    public PersonaAptitudService(PersonaAptitudRepository personaAptitudRepository) {
        this.personaAptitudRepository = personaAptitudRepository;
    }

    public List<PersonaAptitud> findByUsuario(Long usuarioId) {
        return personaAptitudRepository.findByUsuario_Id(usuarioId);
    }
}