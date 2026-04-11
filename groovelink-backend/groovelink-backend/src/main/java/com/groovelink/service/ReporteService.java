package com.groovelink.service;

import com.groovelink.entitys.Reporte;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.repository.ReporteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ReporteService {

    private final ReporteRepository reporteRepository;

    public ReporteService(ReporteRepository reporteRepository) {
        this.reporteRepository = reporteRepository;
    }

    @Transactional
    public Reporte revisarReporte(Long reporteId, String nuevoEstado) {
        Reporte reporte = reporteRepository.findById(reporteId)
                .orElseThrow(() -> new ResourceNotFoundException("Reporte", reporteId));

        reporte.setEstado(nuevoEstado);
        reporte.setFechaRevision(java.time.LocalDateTime.now());

        return reporteRepository.save(reporte);
    }
}