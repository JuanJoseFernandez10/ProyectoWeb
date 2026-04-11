package com.groovelink.repository.relations;

import com.groovelink.entitys.relations.FotoEvento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FotoEventoRepository extends JpaRepository<FotoEvento, Long> {
    List<FotoEvento> findByEvento_IdOrderByOrdenAsc(Long eventoId);
}