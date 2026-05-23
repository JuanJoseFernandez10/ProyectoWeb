package com.groovelink.repository.relations;

import com.groovelink.entitys.relations.PersonaUneEvento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonaUneEventoRepository extends JpaRepository<PersonaUneEvento, Long> {
    List<PersonaUneEvento> findByUsuario_Id(Long usuarioId);
    Page<PersonaUneEvento> findByUsuario_Id(Long usuarioId, Pageable pageable);
    List<PersonaUneEvento> findByEvento_Id(Long eventoId);
    List<PersonaUneEvento> findByEvento_IdIn(List<Long> eventoIds);
    boolean existsByUsuario_IdAndEvento_Id(Long usuarioId, Long eventoId);
    void deleteByUsuario_IdAndEvento_Id(Long usuarioId, Long eventoId);
    long countByEvento_Id(Long eventoId);

    @Query("SELECT pue.evento.id, COUNT(pue) FROM PersonaUneEvento pue WHERE pue.evento.id IN :eventoIds GROUP BY pue.evento.id")
    List<Object[]> countByEventoIds(@Param("eventoIds") List<Long> eventoIds);

    @Modifying
    @Query("DELETE FROM PersonaUneEvento pue WHERE pue.usuario.id = :usuarioId")
    void eliminarTodosPorUsuario(@Param("usuarioId") Long usuarioId);
}
