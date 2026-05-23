package com.groovelink.controller;

import com.groovelink.dto.response.FotoEventoResponseDTO;
import com.groovelink.dto.response.FotoEventoUploadResponseDTO;
import com.groovelink.entitys.Evento;
import com.groovelink.entitys.Usuario;
import com.groovelink.entitys.relations.FotoEvento;
import com.groovelink.exception.BusinessException;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.exception.InvalidOperationException;
import com.groovelink.service.relations.FotoEventoService;
import com.groovelink.mapper.GrooveLinkMapper;
import com.groovelink.service.EventoService;
import com.groovelink.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;

import java.io.IOException;
import java.util.List;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/fotos-evento")
public class FotoEventoController {

    private final FotoEventoService fotoEventoService;
    private final EventoService eventoService;
    private final UsuarioService usuarioService;
    private final GrooveLinkMapper mapper;

    public FotoEventoController(FotoEventoService fotoEventoService,
                                EventoService eventoService,
                                UsuarioService usuarioService,
                                GrooveLinkMapper mapper) {
        this.fotoEventoService = fotoEventoService;
        this.eventoService = eventoService;
        this.usuarioService = usuarioService;
        this.mapper = mapper;
    }

    // Subir la portada del evento
    @PostMapping(value = "/{eventoId}/portada", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FotoEventoUploadResponseDTO> subirPortada(
            @PathVariable Long eventoId,
            Authentication authentication,
            @RequestParam("foto") MultipartFile foto) {

        validarPropietarioEvento(eventoId, authentication);
        validarFoto(foto);

        FotoEvento fotoGuardada = fotoEventoService.agregarFoto(eventoId, foto, true, "portada");

        return ResponseEntity.status(HttpStatus.CREATED).body(
                construirRespuestaUpload(eventoId, fotoGuardada, "Portada subida exitosamente")
        );
    }

    // Subir varias fotos normales de una vez
    @PostMapping(value = "/{eventoId}/otras", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<FotoEventoUploadResponseDTO>> subirFotosNormales(
            @PathVariable Long eventoId,
            Authentication authentication,
            @RequestParam("fotos") List<MultipartFile> fotos) {

        validarPropietarioEvento(eventoId, authentication);
        for (MultipartFile f : fotos) {
            validarFoto(f);
        }

        long inicio = fotoEventoService.countFotosNoPortada(eventoId) + 1;

        List<FotoEventoUploadResponseDTO> respuestas = java.util.stream.IntStream.range(0, fotos.size())
                .mapToObj(indice -> {
                    MultipartFile archivo = fotos.get(indice);
                    String nombreFoto = fotoEventoService.generarNombreFoto(eventoId, (int) (inicio + indice));
                    FotoEvento fotoGuardada = fotoEventoService.agregarFoto(eventoId, archivo, false, nombreFoto);
                    return construirRespuestaUpload(eventoId, fotoGuardada, "Foto subida exitosamente");
                })
                .collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.CREATED).body(respuestas);
    }

    // Obtener la portada de un evento
    @GetMapping("/{eventoId}/portada")
    public ResponseEntity<FotoEventoResponseDTO> obtenerPortada(@PathVariable Long eventoId) {
        return fotoEventoService.findPortadaByEvento(eventoId)
                .map(this::convertirAResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping(value = "/{eventoId}/portada/archivo", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<ByteArrayResource> obtenerPortadaArchivo(@PathVariable Long eventoId) {
        return fotoEventoService.findPortadaByEvento(eventoId)
                .map(this::servirArchivo)
                .orElse(ResponseEntity.notFound().build());
    }

    // Obtener todas las fotos de un evento (sin portada)
    @GetMapping("/{eventoId}/todas")
    public ResponseEntity<List<FotoEventoResponseDTO>> obtenerTodasLasFotos(@PathVariable Long eventoId) {
        List<FotoEventoResponseDTO> fotos = fotoEventoService.findFotosByEvento(eventoId)
                .stream()
                .map(this::convertirAResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(fotos);
    }

    // Obtener una foto específica por nombre
    @GetMapping("/{eventoId}/{nombreFoto}")
    public ResponseEntity<FotoEventoResponseDTO> obtenerFotoEspecifica(
            @PathVariable Long eventoId,
            @PathVariable String nombreFoto) {

        return fotoEventoService.findByEventoAndNombreFoto(eventoId, nombreFoto)
                .map(this::convertirAResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping(value = "/{eventoId}/{nombreFoto}/archivo", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<ByteArrayResource> obtenerFotoArchivo(
            @PathVariable Long eventoId,
            @PathVariable String nombreFoto) {

        return fotoEventoService.findByEventoAndNombreFoto(eventoId, nombreFoto)
                .map(this::servirArchivo)
                .orElse(ResponseEntity.notFound().build());
    }

    // Eliminar una foto específica
    @DeleteMapping("/{fotoId}")
    public ResponseEntity<Void> eliminarFoto(@PathVariable Long fotoId, Authentication authentication) {
        FotoEvento fotoEvento = fotoEventoService.findById(fotoId)
                .orElseThrow(() -> new ResourceNotFoundException("FotoEvento", fotoId));

        validarPropietarioEvento(fotoEvento.getEvento().getId(), authentication);

        fotoEventoService.eliminarFoto(fotoId);
        return ResponseEntity.noContent().build();
    }

    private void validarPropietarioEvento(Long eventoId, Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new BusinessException("No autenticado");
        }

        Usuario usuario = usuarioService.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", 0L));

        Evento evento = eventoService.findById(eventoId)
                .orElseThrow(() -> new ResourceNotFoundException("Evento", eventoId));

        if (evento.getPublicado() == null || !evento.getPublicado().getId().equals(usuario.getId())) {
            throw new BusinessException("Solo el creador del evento puede gestionar sus fotos");
        }
    }

    private FotoEventoUploadResponseDTO construirRespuestaUpload(Long eventoId, FotoEvento fotoGuardada, String mensaje) {
        String carpetaNombre = fotoEventoService.generarNombreCarpeta(eventoId);
        return new FotoEventoUploadResponseDTO(
                fotoGuardada.getId(),
                eventoId,
                fotoGuardada.getNombreFoto(),
                fotoGuardada.getEsPortada(),
                carpetaNombre,
                mensaje
        );
    }

    private void validarFoto(MultipartFile foto) {
        if (foto.isEmpty()) {
            throw new BusinessException("El archivo no puede estar vacío");
        }
        String contentType = foto.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BusinessException("Solo se permiten imágenes (JPEG, PNG, GIF, WebP)");
        }
        if (foto.getSize() > 5 * 1024 * 1024) {
            throw new BusinessException("La imagen no puede superar los 5MB");
        }
    }

    // Converter auxiliar: FotoEvento -> FotoEventoResponseDTO
    private FotoEventoResponseDTO convertirAResponse(FotoEvento foto) {
        FotoEventoResponseDTO response = new FotoEventoResponseDTO();
        response.setId(foto.getId());
        response.setEsPortada(foto.getEsPortada());
        response.setNombreFoto(foto.getNombreFoto());
        response.setFotoUrl(construirFotoUrl(foto));
        
        return response;
    }

    private String construirFotoUrl(FotoEvento foto) {
        return mapper.construirFotoUrl(foto);
    }

    private ResponseEntity<ByteArrayResource> servirArchivo(FotoEvento foto) {
        try {
            Path ruta = fotoEventoService.obtenerRutaFoto(foto);
            byte[] bytes = Files.readAllBytes(ruta);
            String contentType = Optional.ofNullable(Files.probeContentType(ruta)).orElse(MediaType.APPLICATION_OCTET_STREAM_VALUE);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + ruta.getFileName() + "\"")
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(new ByteArrayResource(bytes));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
