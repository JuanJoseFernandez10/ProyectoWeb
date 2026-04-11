package com.groovelink.repository;

import com.groovelink.entitys.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {
    List<Evento> findByFechaInicioAfter(LocalDate date);
    List<Evento> findByFechaInicioBetween(LocalDate start, LocalDate end);

    @Query("SELECT e FROM Evento e WHERE e.publicado.id = :usuarioId")
    List<Evento> findEventosPublicadosPorUsuario(@Param("usuarioId") Long usuarioId);
}