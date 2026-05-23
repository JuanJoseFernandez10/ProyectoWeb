package com.groovelink.repository;

import com.groovelink.entitys.Mensaje;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Long> {
    List<Mensaje> findByChat_IdOrderByFechaEnvioAsc(Long chatId);
    Page<Mensaje> findByChat_IdOrderByFechaEnvioAsc(Long chatId, Pageable pageable);

    @Modifying
    @Query("DELETE FROM Mensaje m WHERE m.usuario.id = :usuarioId")
    void eliminarTodosPorUsuario(@Param("usuarioId") Long usuarioId);
}