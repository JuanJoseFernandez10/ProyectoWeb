package com.groovelink.service;

import com.groovelink.entitys.SolicitudAmistad;
import com.groovelink.entitys.Usuario;
import com.groovelink.exception.BusinessException;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.repository.SolicitudAmistadRepository;
import com.groovelink.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AmistadService {

    private final SolicitudAmistadRepository solicitudAmistadRepository;
    private final UsuarioRepository usuarioRepository;

    public AmistadService(SolicitudAmistadRepository solicitudAmistadRepository,
                          UsuarioRepository usuarioRepository) {
        this.solicitudAmistadRepository = solicitudAmistadRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public SolicitudAmistad solicitarAmistad(Long solicitanteId, Long solicitadoId) {
        if (solicitanteId.equals(solicitadoId)) {
            throw new BusinessException("No puedes enviarte una solicitud a ti mismo");
        }

        Optional<SolicitudAmistad> existing = solicitudAmistadRepository
                .findBySolicitante_IdAndSolicitado_Id(solicitanteId, solicitadoId);
        if (existing.isPresent()) {
            throw new BusinessException("Ya existe una solicitud de amistad entre estos usuarios");
        }

        Optional<SolicitudAmistad> reverse = solicitudAmistadRepository
                .findBySolicitante_IdAndSolicitado_Id(solicitadoId, solicitanteId);
        if (reverse.isPresent()) {
            SolicitudAmistad rev = reverse.get();
            if ("ACEPTADA".equals(rev.getEstado())) {
                throw new BusinessException("Ya sois amigos");
            }
            if ("PENDIENTE".equals(rev.getEstado())) {
                rev.setEstado("ACEPTADA");
                return solicitudAmistadRepository.save(rev);
            }
        }

        Usuario solicitante = usuarioRepository.findById(solicitanteId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", solicitanteId));
        Usuario solicitado = usuarioRepository.findById(solicitadoId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", solicitadoId));

        SolicitudAmistad solicitud = new SolicitudAmistad();
        solicitud.setSolicitante(solicitante);
        solicitud.setSolicitado(solicitado);
        solicitud.setEstado("PENDIENTE");
        return solicitudAmistadRepository.save(solicitud);
    }

    @Transactional
    public SolicitudAmistad responderSolicitud(Long solicitudId, Long usuarioId, boolean aceptar) {
        SolicitudAmistad solicitud = solicitudAmistadRepository.findById(solicitudId)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud de amistad", solicitudId));

        if (!solicitud.getSolicitado().getId().equals(usuarioId)) {
            throw new BusinessException("No puedes responder a esta solicitud");
        }

        if (!"PENDIENTE".equals(solicitud.getEstado())) {
            throw new BusinessException("Esta solicitud ya ha sido respondida");
        }

        solicitud.setEstado(aceptar ? "ACEPTADA" : "RECHAZADA");
        return solicitudAmistadRepository.save(solicitud);
    }

    @Transactional
    public void eliminarAmistad(Long usuarioId, Long amigoId) {
        Optional<SolicitudAmistad> solicitud = solicitudAmistadRepository
                .findBySolicitante_IdAndSolicitado_Id(usuarioId, amigoId);
        if (solicitud.isPresent() && "ACEPTADA".equals(solicitud.get().getEstado())) {
            solicitudAmistadRepository.delete(solicitud.get());
            return;
        }

        solicitud = solicitudAmistadRepository
                .findBySolicitante_IdAndSolicitado_Id(amigoId, usuarioId);
        if (solicitud.isPresent() && "ACEPTADA".equals(solicitud.get().getEstado())) {
            solicitudAmistadRepository.delete(solicitud.get());
            return;
        }

        throw new BusinessException("No existe una amistad entre estos usuarios");
    }

    @Transactional
    public void cancelarSolicitud(Long usuarioId, Long solicitadoId) {
        SolicitudAmistad solicitud = solicitudAmistadRepository
                .findBySolicitante_IdAndSolicitado_Id(usuarioId, solicitadoId)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud de amistad no encontrada"));

        if (!"PENDIENTE".equals(solicitud.getEstado())) {
            throw new BusinessException("Esta solicitud ya no está pendiente");
        }

        solicitudAmistadRepository.delete(solicitud);
    }

    @Transactional(readOnly = true)
    public List<Usuario> obtenerAmigos(Long usuarioId) {
        List<SolicitudAmistad> amistades = solicitudAmistadRepository.findAmistadesByUsuarioId(usuarioId);
        List<Usuario> amigos = new ArrayList<>();
        for (SolicitudAmistad s : amistades) {
            if (s.getSolicitante().getId().equals(usuarioId)) {
                amigos.add(s.getSolicitado());
            } else {
                amigos.add(s.getSolicitante());
            }
        }
        return amigos;
    }

    @Transactional(readOnly = true)
    public List<SolicitudAmistad> obtenerSolicitudesRecibidas(Long usuarioId) {
        return solicitudAmistadRepository.findSolicitudesRecibidasByUsuarioId(usuarioId);
    }

    @Transactional(readOnly = true)
    public List<SolicitudAmistad> obtenerSolicitudesEnviadas(Long usuarioId) {
        return solicitudAmistadRepository.findSolicitudesEnviadasByUsuarioId(usuarioId);
    }

    @Transactional(readOnly = true)
    public String obtenerEstadoAmistad(Long usuarioId, Long otroUsuarioId) {
        if (usuarioId.equals(otroUsuarioId)) return "YO";

        Optional<SolicitudAmistad> solicitud = solicitudAmistadRepository
                .findBySolicitante_IdAndSolicitado_Id(usuarioId, otroUsuarioId);
        if (solicitud.isPresent()) {
            if ("ACEPTADA".equals(solicitud.get().getEstado())) return "AMIGOS";
            if ("PENDIENTE".equals(solicitud.get().getEstado())) return "SOLICITADO";
            return "NINGUNA";
        }

        solicitud = solicitudAmistadRepository
                .findBySolicitante_IdAndSolicitado_Id(otroUsuarioId, usuarioId);
        if (solicitud.isPresent()) {
            if ("ACEPTADA".equals(solicitud.get().getEstado())) return "AMIGOS";
            if ("PENDIENTE".equals(solicitud.get().getEstado())) return "PENDIENTE";
            return "NINGUNA";
        }

        return "NINGUNA";
    }
}
