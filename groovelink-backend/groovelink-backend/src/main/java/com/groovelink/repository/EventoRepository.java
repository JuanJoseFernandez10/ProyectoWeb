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

    @Query("SELECT e FROM Evento e LEFT JOIN e.megustas m WHERE e.fechaFinal >= CURRENT_DATE GROUP BY e ORDER BY COUNT(m) DESC, e.fechaCreacion DESC")
        List<Evento> findAllOrderByMeGustasDesc();

        @Query(
            value = "SELECT e FROM Evento e LEFT JOIN e.megustas m WHERE e.fechaFinal >= CURRENT_DATE GROUP BY e ORDER BY COUNT(m) DESC, e.fechaCreacion DESC",
            countQuery = "SELECT COUNT(e) FROM Evento e WHERE e.fechaFinal >= CURRENT_DATE"
        )
        Page<Evento> findAllOrderByMeGustasDesc(Pageable pageable);

    @Query("SELECT e FROM Evento e WHERE e.publicado.id = :usuarioId")
    List<Evento> findEventosPublicadosPorUsuario(@Param("usuarioId") Long usuarioId);

    @Query(value = "SELECT e FROM Evento e WHERE e.publicado.id = :usuarioId",
           countQuery = "SELECT COUNT(e) FROM Evento e WHERE e.publicado.id = :usuarioId")
    Page<Evento> findEventosPublicadosPorUsuario(@Param("usuarioId") Long usuarioId, Pageable pageable);

    @Query(
        value = "SELECT e FROM Evento e LEFT JOIN e.megustas m WHERE e.fechaFinal >= CURRENT_DATE AND LOWER(e.nombre) LIKE LOWER(CONCAT('%', :q, '%')) GROUP BY e ORDER BY COUNT(m) DESC, e.fechaCreacion DESC",
        countQuery = "SELECT COUNT(e) FROM Evento e WHERE e.fechaFinal >= CURRENT_DATE AND LOWER(e.nombre) LIKE LOWER(CONCAT('%', :q, '%'))"
    )
    Page<Evento> buscarPorNombre(@Param("q") String q, Pageable pageable);

    @Query(
        value = "SELECT e FROM Evento e LEFT JOIN e.megustas m WHERE e.fechaFinal >= CURRENT_DATE AND " +
                "(EXISTS (SELECT 1 FROM EventoGenero eg3 WHERE eg3.evento = e AND eg3.genero.id IN :generoIds) " +
                "OR EXISTS (SELECT 1 FROM EventoAptitud ea3 WHERE ea3.evento = e AND ea3.aptitud.id IN :aptitudIds)) " +
                "GROUP BY e ORDER BY COUNT(m) DESC, e.fechaCreacion DESC",
        countQuery = "SELECT COUNT(e) FROM Evento e WHERE e.fechaFinal >= CURRENT_DATE AND " +
                "(EXISTS (SELECT 1 FROM EventoGenero eg3 WHERE eg3.evento = e AND eg3.genero.id IN :generoIds) " +
                "OR EXISTS (SELECT 1 FROM EventoAptitud ea3 WHERE ea3.evento = e AND ea3.aptitud.id IN :aptitudIds))"
    )
    Page<Evento> findRecomendados(@Param("generoIds") List<Long> generoIds,
                                   @Param("aptitudIds") List<Long> aptitudIds,
                                   Pageable pageable);

    @Query(
        value = "SELECT e FROM Evento e LEFT JOIN e.megustas m WHERE e.fechaFinal >= CURRENT_DATE " +
                "AND (:generoId IS NULL OR EXISTS (SELECT 1 FROM EventoGenero eg2 WHERE eg2.evento = e AND eg2.genero.id = :generoId)) " +
                "AND (:aptitudId IS NULL OR EXISTS (SELECT 1 FROM EventoAptitud ea2 WHERE ea2.evento = e AND ea2.aptitud.id = :aptitudId)) " +
                "GROUP BY e ORDER BY COUNT(m) DESC, e.fechaCreacion DESC",
        countQuery = "SELECT COUNT(e) FROM Evento e WHERE e.fechaFinal >= CURRENT_DATE " +
                "AND (:generoId IS NULL OR EXISTS (SELECT 1 FROM EventoGenero eg2 WHERE eg2.evento = e AND eg2.genero.id = :generoId)) " +
                "AND (:aptitudId IS NULL OR EXISTS (SELECT 1 FROM EventoAptitud ea2 WHERE ea2.evento = e AND ea2.aptitud.id = :aptitudId))"
    )
    Page<Evento> findFiltered(@Param("generoId") Long generoId,
                               @Param("aptitudId") Long aptitudId,
                               Pageable pageable);

    @Query(
        value = "SELECT e FROM Evento e LEFT JOIN e.megustas m WHERE e.fechaFinal >= CURRENT_DATE AND " +
                "EXISTS (SELECT 1 FROM EventoGenero eg3 WHERE eg3.evento = e AND eg3.genero.id IN :generoIds) " +
                "GROUP BY e ORDER BY COUNT(m) DESC, e.fechaCreacion DESC",
        countQuery = "SELECT COUNT(e) FROM Evento e WHERE e.fechaFinal >= CURRENT_DATE AND " +
                "EXISTS (SELECT 1 FROM EventoGenero eg3 WHERE eg3.evento = e AND eg3.genero.id IN :generoIds)"
    )
    Page<Evento> findRecomendadosPorGenero(@Param("generoIds") List<Long> generoIds, Pageable pageable);

    @Query(
        value = "SELECT e FROM Evento e LEFT JOIN e.megustas m WHERE e.fechaFinal >= CURRENT_DATE AND " +
                "EXISTS (SELECT 1 FROM EventoAptitud ea3 WHERE ea3.evento = e AND ea3.aptitud.id IN :aptitudIds) " +
                "GROUP BY e ORDER BY COUNT(m) DESC, e.fechaCreacion DESC",
        countQuery = "SELECT COUNT(e) FROM Evento e WHERE e.fechaFinal >= CURRENT_DATE AND " +
                "EXISTS (SELECT 1 FROM EventoAptitud ea3 WHERE ea3.evento = e AND ea3.aptitud.id IN :aptitudIds)"
    )
    Page<Evento> findRecomendadosPorAptitud(@Param("aptitudIds") List<Long> aptitudIds, Pageable pageable);
}