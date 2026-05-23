package com.groovelink.repository.relations;

import com.groovelink.entitys.relations.PersonaMeGustaEvento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonaMeGustaEventoRepository extends JpaRepository<PersonaMeGustaEvento, Long> {
    boolean existsByUsuario_IdAndEvento_Id(Long usuarioId, Long eventoId);
    void deleteByUsuario_IdAndEvento_Id(Long usuarioId, Long eventoId);
    Integer countByEvento_Id(Long eventoId);

    @Query("SELECT pme.evento.id, COUNT(pme) FROM PersonaMeGustaEvento pme WHERE pme.evento.id IN :eventoIds GROUP BY pme.evento.id")
    List<Object[]> countByEventoIds(@Param("eventoIds") List<Long> eventoIds);

    @Query("SELECT pme.evento.id, pme.usuario.id FROM PersonaMeGustaEvento pme WHERE pme.evento.id IN :eventoIds AND pme.usuario.id = :usuarioId")
    List<Object[]> findByEventoIdsAndUsuarioId(@Param("eventoIds") List<Long> eventoIds, @Param("usuarioId") Long usuarioId);

    @Modifying
    @Query("DELETE FROM PersonaMeGustaEvento pme WHERE pme.usuario.id = :usuarioId")
    void eliminarTodosPorUsuario(@Param("usuarioId") Long usuarioId);
}