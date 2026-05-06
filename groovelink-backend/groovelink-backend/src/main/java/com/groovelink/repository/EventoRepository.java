package com.groovelink.repository;

import com.groovelink.entitys.Evento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {
    List<Evento> findByFechaInicioAfter(LocalDate date);
    List<Evento> findByFechaInicioBetween(LocalDate start, LocalDate end);
    Optional<Evento> findByNombre(String nombre);

    @Query("SELECT e FROM Evento e LEFT JOIN e.megustas m GROUP BY e ORDER BY COUNT(m) DESC, e.fechaCreacion DESC")
        List<Evento> findAllOrderByMeGustasDesc();

        @Query(
            value = "SELECT e FROM Evento e LEFT JOIN e.megustas m GROUP BY e ORDER BY COUNT(m) DESC, e.fechaCreacion DESC",
            countQuery = "SELECT COUNT(e) FROM Evento e"
        )
        Page<Evento> findAllOrderByMeGustasDesc(Pageable pageable);

    @Query("SELECT e FROM Evento e WHERE e.publicado.id = :usuarioId")
    List<Evento> findEventosPublicadosPorUsuario(@Param("usuarioId") Long usuarioId);
}