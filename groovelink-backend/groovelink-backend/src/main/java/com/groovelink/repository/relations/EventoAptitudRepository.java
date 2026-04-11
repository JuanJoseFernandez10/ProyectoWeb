package com.groovelink.repository.relations;

import com.groovelink.entitys.relations.EventoAptitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventoAptitudRepository extends JpaRepository<EventoAptitud, Long> {
    List<EventoAptitud> findByEvento_Id(Long eventoId);
}