package com.groovelink.repository.relations;

import com.groovelink.entitys.relations.PersonaUneEvento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonaUneEventoRepository extends JpaRepository<PersonaUneEvento, Long> {
    List<PersonaUneEvento> findByUsuario_Id(Long usuarioId);
    List<PersonaUneEvento> findByEvento_Id(Long eventoId);
    boolean existsByUsuario_IdAndEvento_Id(Long usuarioId, Long eventoId);
    void deleteByUsuario_IdAndEvento_Id(Long usuarioId, Long eventoId);
    
}