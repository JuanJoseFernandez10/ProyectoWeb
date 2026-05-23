package com.groovelink.repository.relations;

import com.groovelink.entitys.relations.PersonaComentarioEvento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonaComentarioEventoRepository extends JpaRepository<PersonaComentarioEvento, Long> {
    List<PersonaComentarioEvento> findByEvento_IdOrderByFechaDesc(Long eventoId);
    List<PersonaComentarioEvento> findByUsuario_Id(Long usuarioId);

    @Modifying
    @Query("DELETE FROM PersonaComentarioEvento pce WHERE pce.usuario.id = :usuarioId")
    void eliminarTodosPorUsuario(@Param("usuarioId") Long usuarioId);
}