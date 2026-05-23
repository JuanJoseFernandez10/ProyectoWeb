package com.groovelink.repository;

import com.groovelink.entitys.Reporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReporteRepository extends JpaRepository<Reporte, Long> {
    List<Reporte> findByReportero_Id(Long reporteroId);
    List<Reporte> findByRevisadoPor_Id(Long revisadoPorId);
}