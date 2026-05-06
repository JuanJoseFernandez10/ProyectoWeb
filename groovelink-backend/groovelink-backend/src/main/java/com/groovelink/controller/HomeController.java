package com.groovelink.controller;

import com.groovelink.dto.response.EventoResponseDTO;
import com.groovelink.dto.response.EventosResponseDTO;
import com.groovelink.mapper.GrooveLinkMapper;
import com.groovelink.security.JwtProvider;
import com.groovelink.service.EventoService;
import com.groovelink.service.UsuarioService;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/home")
public class HomeController {
    
    private final EventoService eventoService;
    private final GrooveLinkMapper mapper;

    public HomeController(EventoService eventoService, GrooveLinkMapper mapper) {

        this.eventoService = eventoService;
        this.mapper = mapper;
    }

    @GetMapping
    public EventosResponseDTO loadHome(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 12);

        Page<EventoResponseDTO> eventosPage = eventoService.findAllOrdenadosPorMeGustasDto(
            PageRequest.of(safePage, safeSize)
        );

        List<EventoResponseDTO> eventos = eventosPage.stream().toList();

        EventosResponseDTO response = new EventosResponseDTO();
        response.setEventos(eventos);
        response.setTotal((int) eventosPage.getTotalElements());
        response.setMensaje("Eventos cargados");
        response.setPage(eventosPage.getNumber());
        response.setSize(eventosPage.getSize());
        response.setTotalPages(eventosPage.getTotalPages());
        response.setHasNext(eventosPage.hasNext());
        response.setHasPrevious(eventosPage.hasPrevious());
        return response;
    }
}
