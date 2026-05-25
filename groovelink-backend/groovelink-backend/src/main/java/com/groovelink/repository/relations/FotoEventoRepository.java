package com.groovelink.repository.relations;

import com.groovelink.entitys.relations.FotoEvento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FotoEventoRepository extends JpaRepository<FotoEvento, Long> {
    List<FotoEvento> findByEvento_IdOrderByIdAsc(Long eventoId);
    
    // Obtener la portada del evento (usa findFirst por si hay duplicados)
    Optional<FotoEvento> findFirstByEvento_IdAndEsPortadaTrue(Long eventoId);
    
    // Obtener todas las fotos que NO son portada
    List<FotoEvento> findByEvento_IdAndEsPortadaFalseOrderByIdAsc(Long eventoId);

    List<FotoEvento> findByEvento_IdInAndEsPortadaTrue(List<Long> eventoIds);
    List<FotoEvento> findByEvento_IdInAndEsPortadaFalseOrderByIdAsc(List<Long> eventoIds);

    // Contar fotos que no son portada
    Long countByEvento_IdAndEsPortadaFalse(Long eventoId);
    
    // Obtener una foto específica por evento y nombre
    Optional<FotoEvento> findByEvento_IdAndNombreFoto(Long eventoId, String nombreFoto);
}