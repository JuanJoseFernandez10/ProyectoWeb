package com.groovelink.chat;

import com.groovelink.entitys.Mensaje;
import com.groovelink.entitys.Usuario;
import com.groovelink.repository.UsuarioRepository;
import com.groovelink.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;
    private final UsuarioRepository usuarioRepository;

    public ChatWebSocketController(SimpMessagingTemplate messagingTemplate,
                                   ChatService chatService,
                                   UsuarioRepository usuarioRepository) {
        this.messagingTemplate = messagingTemplate;
        this.chatService = chatService;
        this.usuarioRepository = usuarioRepository;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessage chatMessage,
                            SimpMessageHeaderAccessor headerAccessor) {

        Authentication auth = (Authentication) headerAccessor.getUser();
        String username = auth.getName();

        Usuario usuario = usuarioRepository.findByUsername(username).orElse(null);
        if (usuario == null || chatMessage.getRoomId() == null) {
            return;
        }

        Mensaje mensaje = chatService.enviarMensaje(
                chatMessage.getRoomId(),
                usuario.getId(),
                chatMessage.getContent()
        );

        chatMessage.setSender(username);
        chatMessage.setType(ChatMessage.MessageType.CHAT);

        messagingTemplate.convertAndSend(
                "/topic/room/" + chatMessage.getRoomId(),
                chatMessage
        );
    }

    @MessageMapping("/chat.private")
    public void sendPrivateMessage(@Payload ChatMessage chatMessage,
                                   SimpMessageHeaderAccessor headerAccessor) {

        Authentication auth = (Authentication) headerAccessor.getUser();
        String username = auth.getName();

        chatMessage.setSender(username);
        chatMessage.setType(ChatMessage.MessageType.CHAT);

        Usuario usuario = usuarioRepository.findByUsername(username).orElse(null);
        if (usuario == null || chatMessage.getRoomId() == null) {
            return;
        }

        Mensaje mensaje = chatService.enviarMensaje(
                chatMessage.getRoomId(),
                usuario.getId(),
                chatMessage.getContent()
        );

        messagingTemplate.convertAndSend(
                "/topic/room/" + chatMessage.getRoomId(),
                chatMessage
        );
    }

    @MessageMapping("/chat.join")
    public void joinRoom(@Payload ChatMessage chatMessage,
                         SimpMessageHeaderAccessor headerAccessor) {

        Authentication auth = (Authentication) headerAccessor.getUser();
        String username = auth.getName();

        chatMessage.setSender(username);
        chatMessage.setType(ChatMessage.MessageType.JOIN);

        messagingTemplate.convertAndSend(
                "/topic/room/" + chatMessage.getRoomId(),
                chatMessage
        );
    }
}
