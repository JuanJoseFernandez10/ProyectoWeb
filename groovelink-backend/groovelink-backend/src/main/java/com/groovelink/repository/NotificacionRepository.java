package com.groovelink.repository;

import com.groovelink.entitys.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    List<Notificacion> findByUsuario_IdOrderByFechaCreacionDesc(Long usuarioId);
    long countByUsuario_IdAndLeidaFalse(Long usuarioId);
}
