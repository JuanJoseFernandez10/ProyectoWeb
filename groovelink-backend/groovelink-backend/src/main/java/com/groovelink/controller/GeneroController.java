package com.groovelink.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.groovelink.dto.response.GeneroResponseDTO;
import com.groovelink.entitys.Genero;
import com.groovelink.service.GeneroService;


@RestController
@RequestMapping("/generos")
public class GeneroController {
    
    private final GeneroService service;

    public GeneroController(GeneroService service) {
        this.service = service;
    }

    @GetMapping
    public List<GeneroResponseDTO> getAllGeneros() {
        List<Genero> generos = service.findAll();
        return generos.stream()
            .map(genero -> new GeneroResponseDTO(genero.getId(), genero.getNombre()))
            .collect(Collectors.toList());
    }
}
