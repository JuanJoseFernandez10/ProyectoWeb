package com.groovelink.service;

import com.groovelink.entitys.EstadoSolicitud;
import com.groovelink.entitys.SolicitudAmistad;
import com.groovelink.entitys.Usuario;
import com.groovelink.enums.TipoNotificacion;
import com.groovelink.exception.BusinessException;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.repository.SolicitudAmistadRepository;
import com.groovelink.repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AmistadService {

    private final SolicitudAmistadRepository solicitudAmistadRepository;
    private final UsuarioRepository usuarioRepository;
    private final NotificacionService notificacionService;

    public AmistadService(SolicitudAmistadRepository solicitudAmistadRepository,
                          UsuarioRepository usuarioRepository,
                          NotificacionService notificacionService) {
        this.solicitudAmistadRepository = solicitudAmistadRepository;
        this.usuarioRepository = usuarioRepository;
        this.notificacionService = notificacionService;
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
            if (EstadoSolicitud.ACEPTADA == rev.getEstado()) {
                throw new BusinessException("Ya sois amigos");
            }
            if (EstadoSolicitud.PENDIENTE == rev.getEstado()) {
                rev.setEstado(EstadoSolicitud.ACEPTADA);
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
        solicitud.setEstado(EstadoSolicitud.PENDIENTE);
        SolicitudAmistad saved = solicitudAmistadRepository.save(solicitud);

        notificacionService.crearNotificacion(
            solicitadoId, TipoNotificacion.SOLICITUD_AMISTAD,
            solicitante.getUsername() + " te ha enviado una solicitud de amistad",
            solicitanteId
        );

        return saved;
    }

    @Transactional
    public SolicitudAmistad responderSolicitud(Long solicitudId, Long usuarioId, boolean aceptar) {
        SolicitudAmistad solicitud = solicitudAmistadRepository.findById(solicitudId)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud de amistad", solicitudId));

        if (!solicitud.getSolicitado().getId().equals(usuarioId)) {
            throw new BusinessException("No puedes responder a esta solicitud");
        }

        if (EstadoSolicitud.PENDIENTE != solicitud.getEstado()) {
            throw new BusinessException("Esta solicitud ya ha sido respondida");
        }

        solicitud.setEstado(aceptar ? EstadoSolicitud.ACEPTADA : EstadoSolicitud.RECHAZADA);
        SolicitudAmistad saved = solicitudAmistadRepository.save(solicitud);

        if (aceptar) {
            notificacionService.crearNotificacion(
                solicitud.getSolicitante().getId(), TipoNotificacion.SOLICITUD_ACEPTADA,
                solicitud.getSolicitado().getUsername() + " ha aceptado tu solicitud de amistad",
                solicitud.getSolicitado().getId()
            );
        }

        return saved;
    }

    @Transactional
    public void eliminarAmistad(Long usuarioId, Long amigoId) {
        Optional<SolicitudAmistad> solicitud = solicitudAmistadRepository
                .findBySolicitante_IdAndSolicitado_Id(usuarioId, amigoId);
        if (solicitud.isPresent() && EstadoSolicitud.ACEPTADA == solicitud.get().getEstado()) {
            solicitudAmistadRepository.delete(solicitud.get());
            return;
        }

        solicitud = solicitudAmistadRepository
                .findBySolicitante_IdAndSolicitado_Id(amigoId, usuarioId);
        if (solicitud.isPresent() && EstadoSolicitud.ACEPTADA == solicitud.get().getEstado()) {
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

        if (EstadoSolicitud.PENDIENTE != solicitud.getEstado()) {
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
    public Page<Usuario> obtenerAmigosPaginados(Long usuarioId, Pageable pageable) {
        Page<SolicitudAmistad> amistades = solicitudAmistadRepository.findAmistadesByUsuarioId(usuarioId, pageable);
        return amistades.map(s -> {
            if (s.getSolicitante().getId().equals(usuarioId)) {
                return s.getSolicitado();
            } else {
                return s.getSolicitante();
            }
        });
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
            if (EstadoSolicitud.ACEPTADA == solicitud.get().getEstado()) return "AMIGOS";
            if (EstadoSolicitud.PENDIENTE == solicitud.get().getEstado()) return "SOLICITADO";
            return "NINGUNA";
        }

        solicitud = solicitudAmistadRepository
                .findBySolicitante_IdAndSolicitado_Id(otroUsuarioId, usuarioId);
        if (solicitud.isPresent()) {
            if (EstadoSolicitud.ACEPTADA == solicitud.get().getEstado()) return "AMIGOS";
            if (EstadoSolicitud.PENDIENTE == solicitud.get().getEstado()) return "PENDIENTE";
            return "NINGUNA";
        }

        return "NINGUNA";
    }
}
