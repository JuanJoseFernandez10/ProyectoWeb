package com.groovelink.repository.relations;

import com.groovelink.entitys.relations.PersonaAptitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonaAptitudRepository extends JpaRepository<PersonaAptitud, Long> {
    List<PersonaAptitud> findByUsuario_Id(Long usuarioId);
    void deleteByUsuario_IdAndAptitud_Id(Long usuarioId, Long aptitudId);
}