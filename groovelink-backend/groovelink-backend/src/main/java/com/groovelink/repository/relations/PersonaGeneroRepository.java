package com.groovelink.repository.relations;

import com.groovelink.entitys.relations.PersonaGenero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonaGeneroRepository extends JpaRepository<PersonaGenero, Long> {
    List<PersonaGenero> findByUsuario_Id(Long usuarioId);
    void deleteByUsuario_IdAndGenero_Id(Long usuarioId, Long generoId);
    boolean existsByUsuario_IdAndGenero_Id(Long usuarioId, Long generoId);
}