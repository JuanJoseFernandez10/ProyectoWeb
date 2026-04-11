package com.groovelink.repository;

import com.groovelink.entitys.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Long> {
    List<Mensaje> findByChat_IdOrderByFechaEnvioAsc(Long chatId);
}