package com.groovelink.service;

import com.groovelink.dto.response.NotificacionResponseDTO;
import com.groovelink.entitys.Notificacion;
import com.groovelink.entitys.Usuario;
import com.groovelink.enums.TipoNotificacion;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.repository.NotificacionRepository;
import com.groovelink.repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final UsuarioRepository usuarioRepository;

    public NotificacionService(NotificacionRepository notificacionRepository,
                               UsuarioRepository usuarioRepository) {
        this.notificacionRepository = notificacionRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public Notificacion crearNotificacion(Long usuarioId, TipoNotificacion tipo, String mensaje, Long referenciaId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", usuarioId));

        Notificacion notificacion = new Notificacion();
        notificacion.setUsuario(usuario);
        notificacion.setTipo(tipo);
        notificacion.setMensaje(mensaje);
        notificacion.setReferenciaId(referenciaId);

        return notificacionRepository.save(notificacion);
    }

    @Transactional(readOnly = true)
    public List<NotificacionResponseDTO> obtenerNotificaciones(Long usuarioId) {
        return notificacionRepository.findByUsuario_IdOrderByFechaCreacionDesc(usuarioId).stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<NotificacionResponseDTO> obtenerNotificacionesPaginadas(Long usuarioId, Pageable pageable) {
        return notificacionRepository.findByUsuario_IdOrderByFechaCreacionDesc(usuarioId, pageable)
                .map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public long contarNoLeidas(Long usuarioId) {
        return notificacionRepository.countByUsuario_IdAndLeidaFalse(usuarioId);
    }

    @Transactional
    public void marcarComoLeida(Long notificacionId, Long usuarioId) {
        Notificacion notificacion = notificacionRepository.findById(notificacionId)
                .orElseThrow(() -> new ResourceNotFoundException("Notificacion", notificacionId));

        if (!notificacion.getUsuario().getId().equals(usuarioId)) {
            throw new SecurityException("No tienes permiso para modificar esta notificacion");
        }

        notificacion.setLeida(true);
        notificacionRepository.save(notificacion);
    }

    @Transactional
    public void marcarTodasComoLeidas(Long usuarioId) {
        List<Notificacion> noLeidas = notificacionRepository.findByUsuario_IdOrderByFechaCreacionDesc(usuarioId)
                .stream()
                .filter(n -> !n.isLeida())
                .toList();

        noLeidas.forEach(n -> n.setLeida(true));
        notificacionRepository.saveAll(noLeidas);
    }

    private NotificacionResponseDTO toDTO(Notificacion n) {
        NotificacionResponseDTO dto = new NotificacionResponseDTO();
        dto.setId(n.getId());
        dto.setTipo(n.getTipo().name());
        dto.setMensaje(n.getMensaje());
        dto.setLeida(n.isLeida());
        dto.setFechaCreacion(n.getFechaCreacion());
        dto.setReferenciaId(n.getReferenciaId());
        return dto;
    }
}
