package com.groovelink.service;

import com.groovelink.dto.response.DashboardEstadisticasDTO;
import com.groovelink.dto.response.EventoStatsDTO;
import com.groovelink.entitys.Evento;
import com.groovelink.entitys.Usuario;
import com.groovelink.repository.EventoRepository;
import com.groovelink.repository.relations.PersonaComentarioEventoRepository;
import com.groovelink.repository.relations.PersonaMeGustaEventoRepository;
import com.groovelink.repository.relations.PersonaUneEventoRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DashboardService {

    private final EventoRepository eventoRepository;
    private final PersonaUneEventoRepository personaUneEventoRepository;
    private final PersonaMeGustaEventoRepository personaMeGustaEventoRepository;
    private final PersonaComentarioEventoRepository personaComentarioEventoRepository;

    public DashboardService(EventoRepository eventoRepository,
                            PersonaUneEventoRepository personaUneEventoRepository,
                            PersonaMeGustaEventoRepository personaMeGustaEventoRepository,
                            PersonaComentarioEventoRepository personaComentarioEventoRepository) {
        this.eventoRepository = eventoRepository;
        this.personaUneEventoRepository = personaUneEventoRepository;
        this.personaMeGustaEventoRepository = personaMeGustaEventoRepository;
        this.personaComentarioEventoRepository = personaComentarioEventoRepository;
    }

    public DashboardEstadisticasDTO obtenerEstadisticas(Usuario usuario) {
        List<Evento> eventos = eventoRepository.findEventosPublicadosPorUsuario(usuario.getId());

        long totalEventos = eventos.size();
        long totalAsistentes = 0;
        long totalMeGustas = 0;
        long totalComentarios = 0;

        for (Evento evento : eventos) {
            totalAsistentes += personaUneEventoRepository.countByEvento_Id(evento.getId());
            totalMeGustas += personaMeGustaEventoRepository.countByEvento_Id(evento.getId());
            totalComentarios += personaComentarioEventoRepository.findByEvento_IdOrderByFechaDesc(evento.getId()).size();
        }

        return new DashboardEstadisticasDTO(totalEventos, totalAsistentes, totalMeGustas, totalComentarios);
    }

    public List<EventoStatsDTO> obtenerEventosConStats(Usuario usuario) {
        List<Evento> eventos = eventoRepository.findEventosPublicadosPorUsuario(usuario.getId());
        List<EventoStatsDTO> resultado = new ArrayList<>();

        for (Evento evento : eventos) {
            EventoStatsDTO dto = new EventoStatsDTO();
            dto.setId(evento.getId());
            dto.setNombre(evento.getNombre());
            dto.setFechaInicio(evento.getFechaInicio() != null ? evento.getFechaInicio().toString() : null);
            dto.setUbicacion(evento.getUbicacion());
            dto.setNumAsistentes(personaUneEventoRepository.countByEvento_Id(evento.getId()));
            dto.setNumMeGustas(personaMeGustaEventoRepository.countByEvento_Id(evento.getId()));
            dto.setNumComentarios(personaComentarioEventoRepository.findByEvento_IdOrderByFechaDesc(evento.getId()).size());

            if (evento.getFotos() != null && !evento.getFotos().isEmpty()) {
                dto.setImagen(evento.getFotos().get(0).getRutaArchivo());
            }

            resultado.add(dto);
        }

        return resultado;
    }
}
