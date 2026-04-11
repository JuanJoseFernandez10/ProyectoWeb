package com.groovelink.service.relations;

import com.groovelink.entitys.relations.PersonaGenero;
import com.groovelink.repository.relations.PersonaGeneroRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersonaGeneroService {

    private final PersonaGeneroRepository personaGeneroRepository;

    public PersonaGeneroService(PersonaGeneroRepository personaGeneroRepository) {
        this.personaGeneroRepository = personaGeneroRepository;
    }

    public List<PersonaGenero> findByUsuario(Long usuarioId) {
        return personaGeneroRepository.findByUsuario_Id(usuarioId);
    }
}