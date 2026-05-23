package com.groovelink.controller;

import com.groovelink.dto.request.CrearChatRequest;
import com.groovelink.dto.response.ChatResponseDTO;
import com.groovelink.dto.response.MensajeResponseDTO;
import com.groovelink.dto.response.UsuarioBasicoDTO;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

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
            dtos.add(enriquecerChatDTO(chat));
        }

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<Page<MensajeResponseDTO>> getMessages(@PathVariable Long chatId,
                                                                @RequestParam(defaultValue = "0") int page,
                                                                @RequestParam(defaultValue = "20") int size) {
        Page<Mensaje> mensajes = mensajeService.findByChatPaginado(chatId, PageRequest.of(page, size));
        return ResponseEntity.ok(mensajes.map(mapper::toMensajeResponseDTO));
    }

    @PostMapping("/privado/{usuarioId}")
    @Transactional
    public ResponseEntity<ChatResponseDTO> createOrGetPrivateChat(@PathVariable Long usuarioId,
                                                                   Authentication auth) {
        Usuario current = usuarioRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Chat chat = chatService.findOrCreatePrivateChat(current.getId(), usuarioId);
        return ResponseEntity.ok(enriquecerChatDTO(chat));
    }

    @GetMapping("/{chatId}/participantes")
    public ResponseEntity<List<UsuarioBasicoDTO>> getParticipantes(@PathVariable Long chatId,
                                                                     Authentication auth) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat", chatId));

        Usuario current = usuarioRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        boolean esParticipante = chat.getParticipantes().stream()
                .anyMatch(p -> p.getId().equals(current.getId()));
        if (!esParticipante) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<UsuarioBasicoDTO> dtos = chat.getParticipantes().stream()
                .map(this::toUsuarioBasicoDTO)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<ChatResponseDTO> createChat(@RequestBody @Valid CrearChatRequest request,
                                                       Authentication auth) {
        Usuario usuario = usuarioRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        List<Long> ids = new ArrayList<>(request.getParticipantesIds());
        if (!ids.contains(usuario.getId())) {
            ids.add(usuario.getId());
        }

        Chat chat = chatService.crearChat(request.getNombre(), request.getDescripcion(), ids, request.isEsGrupal());
        ChatResponseDTO dto = enriquecerChatDTO(chat);

        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    private UsuarioBasicoDTO toUsuarioBasicoDTO(Usuario u) {
        UsuarioBasicoDTO dto = new UsuarioBasicoDTO();
        dto.setId(u.getId());
        dto.setUsername(u.getUsername());
        dto.setEmail(u.getEmail());
        dto.setRol(u.getRol().name());
        dto.setFotoPerfilUrl("/usuarios/perfiles/" + u.getId() + "/foto");
        return dto;
    }

    private ChatResponseDTO enriquecerChatDTO(Chat chat) {
        ChatResponseDTO dto = mapper.toChatResponseDTO(chat);

        if (chat.getEventoId() != null) {
            fotoEventoService.findPortadaByEvento(chat.getEventoId())
                    .ifPresent(portada ->
                            dto.setImagen("/fotos-evento/" + chat.getEventoId() + "/portada/archivo")
                    );
        }

        Map<String, String> fotos = new HashMap<>();
        Map<String, Long> ids = new HashMap<>();
        if (chat.getParticipantes() != null) {
            for (Usuario p : chat.getParticipantes()) {
                fotos.put(p.getUsername(), "/usuarios/perfiles/" + p.getId() + "/foto");
                ids.put(p.getUsername(), p.getId());
            }
        }
        dto.setParticipantesFotos(fotos);
        dto.setParticipantesIds(ids);

        return dto;
    }
}