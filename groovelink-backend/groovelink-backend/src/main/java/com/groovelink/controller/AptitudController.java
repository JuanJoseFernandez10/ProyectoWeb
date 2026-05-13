package com.groovelink.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.groovelink.dto.response.AptitudResponseDTO;
import com.groovelink.entitys.Aptitud;
import com.groovelink.service.AptitudService;


@RestController
@RequestMapping("/aptitudes")
public class AptitudController {
    
    private final AptitudService service;

    public AptitudController(AptitudService service) {
        this.service = service;
    }

    @GetMapping
    public List<AptitudResponseDTO> getAllAptitudes() {
        List<Aptitud> aptitudes = service.findAll();
        return aptitudes.stream()
            .map(aptitud -> new AptitudResponseDTO(aptitud.getId(), aptitud.getNombre()))
            .collect(Collectors.toList());
    }
}
