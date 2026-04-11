package com.groovelink.repository.relations;

import com.groovelink.entitys.relations.EventoGenero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventoGeneroRepository extends JpaRepository<EventoGenero, Long> {
    List<EventoGenero> findByEvento_Id(Long eventoId);
}