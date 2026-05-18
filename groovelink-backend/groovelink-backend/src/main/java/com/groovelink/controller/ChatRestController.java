package com.groovelink.controller;

import com.groovelink.dto.request.CrearChatRequest;
import com.groovelink.dto.response.ChatResponseDTO;
import com.groovelink.dto.response.MensajeResponseDTO;
import com.groovelink.entitys.Chat;
import com.groovelink.entitys.Mensaje;
import com.groovelink.entitys.Usuario;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.mapper.GrooveLinkMapper;
import com.groovelink.repository.ChatRepository;
import com.groovelink.repository.UsuarioRepository;
import com.groovelink.service.ChatService;
import com.groovelink.service.MensajeService;
import com.groovelink.service.relations.FotoEventoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chats")
@Transactional(readOnly = true)
public class ChatRestController {

    private final ChatRepository chatRepository;
    private final ChatService chatService;
    private final MensajeService mensajeService;
    private final UsuarioRepository usuarioRepository;
    private final GrooveLinkMapper mapper;
    private final FotoEventoService fotoEventoService;

    public ChatRestController(ChatRepository chatRepository,
                              ChatService chatService,
                              MensajeService mensajeService,
                              UsuarioRepository usuarioRepository,
                              GrooveLinkMapper mapper,
                              FotoEventoService fotoEventoService) {
        this.chatRepository = chatRepository;
        this.chatService = chatService;
        this.mensajeService = mensajeService;
        this.usuarioRepository = usuarioRepository;
        this.mapper = mapper;
        this.fotoEventoService = fotoEventoService;
    }

    @GetMapping
    public ResponseEntity<List<ChatResponseDTO>> getMyChats(Authentication auth) {
        Usuario usuario = usuarioRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        List<Chat> chats = chatRepository.findByParticipantes_Id(usuario.getId());
        List<ChatResponseDTO> dtos = new ArrayList<>();

        for (Chat chat : chats) {
            ChatResponseDTO dto = mapper.toChatResponseDTO(chat);

            if (chat.getEventoId() != null) {
                fotoEventoService.findPortadaByEvento(chat.getEventoId())
                        .ifPresent(portada ->
                                dto.setImagen("/fotos-evento/" + chat.getEventoId() + "/portada/archivo")
                        );
            }

            Map<String, String> fotos = new HashMap<>();
            if (chat.getParticipantes() != null) {
                for (Usuario p : chat.getParticipantes()) {
                    String fotoUrl = "/usuarios/perfiles/" + p.getId() + "/foto";
                    fotos.put(p.getUsername(), fotoUrl);
                }
            }
            dto.setParticipantesFotos(fotos);

            dtos.add(dto);
        }

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<List<MensajeResponseDTO>> getMessages(@PathVariable Long chatId) {
        List<Mensaje> mensajes = mensajeService.findByChat(chatId);
        List<MensajeResponseDTO> dtos = mensajes.stream()
                .map(mapper::toMensajeResponseDTO)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<ChatResponseDTO> createChat(@RequestBody @Valid CrearChatRequest request,
                                                       Authentication auth) {
        Usuario usuario = usuarioRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        List<Long> ids = request.getParticipantesIds();
        if (!ids.contains(usuario.getId())) {
            ids.add(usuario.getId());
        }

        Chat chat = chatService.crearChat(request.getNombre(), ids, request.isEsGrupal());
        ChatResponseDTO dto = mapper.toChatResponseDTO(chat);

        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }
}