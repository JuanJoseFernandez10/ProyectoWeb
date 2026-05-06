package com.groovelink.repository.relations;

import com.groovelink.entitys.relations.PersonaMeGustaEvento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonaMeGustaEventoRepository extends JpaRepository<PersonaMeGustaEvento, Long> {
    boolean existsByUsuario_IdAndEvento_Id(Long usuarioId, Long eventoId);
    void deleteByUsuario_IdAndEvento_Id(Long usuarioId, Long eventoId);
    Integer countByEvento_Id(Long eventoId);
}