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
    public Chat crearChatGrupal(String nombre, List<Long> participantesIds) {
        if (participantesIds.size() < 2) {
            throw new InvalidOperationException("Un chat grupal debe tener al menos 2 participantes");
        }

        List<Usuario> participantes = participantesIds.stream()
                .map(id -> usuarioRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Usuario", id)))
                .toList();

        Chat chat = new Chat();
        chat.setNombre(nombre);
        chat.setEsGrupal(true);
        chat.setParticipantes(participantes);

        return chatRepository.save(chat);
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