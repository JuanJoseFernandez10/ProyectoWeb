package com.groovelink.repository;

import com.groovelink.entitys.SolicitudAmistad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SolicitudAmistadRepository extends JpaRepository<SolicitudAmistad, Long> {

    Optional<SolicitudAmistad> findBySolicitante_IdAndSolicitado_Id(Long solicitanteId, Long solicitadoId);

    @Query("SELECT s FROM SolicitudAmistad s WHERE (s.solicitante.id = :usuarioId OR s.solicitado.id = :usuarioId) AND s.estado = 'ACEPTADA'")
    List<SolicitudAmistad> findAmistadesByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT s FROM SolicitudAmistad s WHERE s.solicitado.id = :usuarioId AND s.estado = 'PENDIENTE'")
    List<SolicitudAmistad> findSolicitudesRecibidasByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT s FROM SolicitudAmistad s WHERE s.solicitante.id = :usuarioId AND s.estado = 'PENDIENTE'")
    List<SolicitudAmistad> findSolicitudesEnviadasByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM SolicitudAmistad s " +
           "WHERE ((s.solicitante.id = :usuarioId1 AND s.solicitado.id = :usuarioId2) " +
           "OR (s.solicitante.id = :usuarioId2 AND s.solicitado.id = :usuarioId1)) " +
           "AND s.estado = 'ACEPTADA'")
    boolean sonAmigos(@Param("usuarioId1") Long usuarioId1, @Param("usuarioId2") Long usuarioId2);
}
