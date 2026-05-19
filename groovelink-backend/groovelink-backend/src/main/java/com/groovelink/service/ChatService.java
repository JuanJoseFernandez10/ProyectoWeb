package com.groovelink.service;

import com.groovelink.entitys.Chat;
import com.groovelink.entitys.Mensaje;
import com.groovelink.entitys.Usuario;
import com.groovelink.exception.*;
import com.groovelink.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ChatService {

    private final ChatRepository chatRepository;
    private final MensajeRepository mensajeRepository;
    private final UsuarioRepository usuarioRepository;

    public ChatService(ChatRepository chatRepository,
                       MensajeRepository mensajeRepository,
                       UsuarioRepository usuarioRepository) {
        this.chatRepository = chatRepository;
        this.mensajeRepository = mensajeRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public Chat crearChat(String nombre, String descripcion, List<Long> participantesIds, boolean esGrupal) {
        if (participantesIds.size() < 2) {
            throw new InvalidOperationException("Un chat debe tener al menos 2 participantes");
        }

        List<Usuario> participantes = participantesIds.stream()
                .map(id -> usuarioRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Usuario", id)))
                .toList();

        Chat chat = new Chat();
        chat.setNombre(nombre);
        chat.setDescripcion(descripcion);
        chat.setEsGrupal(esGrupal);
        chat.setParticipantes(participantes);

        return chatRepository.save(chat);
    }

    @Transactional
    public Chat crearChat(String nombre, List<Long> participantesIds, boolean esGrupal) {
        return crearChat(nombre, null, participantesIds, esGrupal);
    }

    @Transactional
    public Chat findOrCreatePrivateChat(Long usuarioId1, Long usuarioId2) {
        List<Chat> chatsUsuario1 = chatRepository.findByParticipantes_Id(usuarioId1);
        for (Chat chat : chatsUsuario1) {
            if (!chat.isEsGrupal() && chat.getEventoId() == null) {
                boolean containsOther = chat.getParticipantes().stream()
                        .anyMatch(p -> p.getId().equals(usuarioId2));
                if (containsOther && chat.getParticipantes().size() == 2) {
                    return chat;
                }
            }
        }
        return crearChat("Chat privado", List.of(usuarioId1, usuarioId2), false);
    }

    @Transactional
    public Mensaje enviarMensaje(Long chatId, Long usuarioId, String contenido) {
        if (contenido == null || contenido.trim().isEmpty()) {
            throw new BusinessException("El contenido del mensaje no puede estar vacío");
        }

        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat", chatId));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", usuarioId));

        Mensaje mensaje = new Mensaje();
        mensaje.setUsuario(usuario);
        mensaje.setChat(chat);
        mensaje.setContenido(contenido.trim());

        chat.setUltimoMensaje(mensaje.getFechaEnvio());

        mensajeRepository.save(mensaje);
        chatRepository.save(chat);

        return mensaje;
    }
}