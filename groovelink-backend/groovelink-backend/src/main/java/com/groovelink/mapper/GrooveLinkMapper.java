package com.groovelink.mapper;

import com.groovelink.dto.request.*;
import com.groovelink.dto.response.*;
import com.groovelink.entitys.*;
import com.groovelink.entitys.relations.*;
import org.mapstruct.*;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface GrooveLinkMapper {

    // ====================== Registro ======================
    Persona toPersona(UsuarioRegistroRequestDTO dto);
    Empresa toEmpresa(UsuarioRegistroRequestDTO dto);
    Administrador toAdministrador(UsuarioRegistroRequestDTO dto);

    UsuarioResponseDTO toUsuarioResponseDTO(Usuario usuario);

    // ====================== Persona ======================
    @Mapping(target = "aptitudes", source = "aptitudes", qualifiedByName = "aptitudesToNombres")
    @Mapping(target = "generos",   source = "generos",   qualifiedByName = "generosToNombres")
    @Mapping(target = "perfil",    source = "perfil")
    PersonaResponseDTO toPersonaResponseDTO(Persona persona);

    // ====================== Perfil ======================
    PerfilResponseDTO toPerfilResponseDTO(Perfil perfil);

    // ====================== Evento ======================
    Evento toEvento(EventoCreateRequestDTO dto);

    @Mapping(target = "codigo", source = "id")
    @Mapping(target = "publicadoPorUsername", source = "publicado.username")
    @Mapping(target = "aptitudes", source = "aptitudes", qualifiedByName = "eventoAptitudesToNombres")
    @Mapping(target = "generos",   source = "generos",   qualifiedByName = "eventoGenerosToNombres")
    @Mapping(target = "numeroAsistentes", expression = "java(evento.getPersonaUneEventos() != null ? evento.getPersonaUneEventos().size() : 0)")
    EventoResponseDTO toEventoResponseDTO(Evento evento);

    // ====================== Chat ======================
    @Mapping(target = "participantesUsernames", source = "participantes", qualifiedByName = "usuariosToUsernames")
    ChatResponseDTO toChatResponseDTO(Chat chat);

    // ====================== Mensaje ======================
    @Mapping(target = "enviadoPorUsername", source = "usuario.username")
    MensajeResponseDTO toMensajeResponseDTO(Mensaje mensaje);

    // ====================== Otros simples ======================
    AptitudResponseDTO toAptitudResponseDTO(Aptitud aptitud);
    GeneroResponseDTO toGeneroResponseDTO(Genero genero);

    @Mapping(target = "usuarioUsername", source = "usuario.username")
    PersonaComentarioEventoResponseDTO toComentarioResponseDTO(PersonaComentarioEvento comentario);

    @Mapping(target = "reporteroUsername", source = "reportero.username")
    @Mapping(target = "revisadoPorUsername", source = "revisadoPor.username", nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    ReporteResponseDTO toReporteResponseDTO(Reporte reporte);

    // ====================== Métodos auxiliares ======================
    @Named("aptitudesToNombres")
    default List<String> aptitudesToNombres(List<PersonaAptitud> aptitudes) {
        if (aptitudes == null) return List.of();
        return aptitudes.stream()
                .map(pa -> pa.getAptitud().getNombre())
                .collect(Collectors.toList());
    }

    @Named("generosToNombres")
    default List<String> generosToNombres(List<PersonaGenero> generos) {
        if (generos == null) return List.of();
        return generos.stream()
                .map(pg -> pg.getGenero().getNombre())
                .collect(Collectors.toList());
    }

    @Named("eventoAptitudesToNombres")
    default List<String> eventoAptitudesToNombres(List<EventoAptitud> list) {
        if (list == null) return List.of();
        return list.stream().map(ea -> ea.getAptitud().getNombre()).collect(Collectors.toList());
    }

    @Named("eventoGenerosToNombres")
    default List<String> eventoGenerosToNombres(List<EventoGenero> list) {
        if (list == null) return List.of();
        return list.stream().map(eg -> eg.getGenero().getNombre()).collect(Collectors.toList());
    }

    @Named("usuariosToUsernames")
    default List<String> usuariosToUsernames(List<Usuario> usuarios) {
        if (usuarios == null) return List.of();
        return usuarios.stream().map(Usuario::getUsername).collect(Collectors.toList());
    }
}