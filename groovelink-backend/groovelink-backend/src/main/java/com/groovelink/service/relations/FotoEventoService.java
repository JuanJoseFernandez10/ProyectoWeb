package com.groovelink.service.relations;

import com.groovelink.entitys.relations.FotoEvento;
import com.groovelink.entitys.Evento;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.repository.EventoRepository;
import com.groovelink.repository.relations.FotoEventoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

@Service
public class FotoEventoService {

    @Value("${app.fotos-evento.base-dir}")
    private String baseDir;

    private final FotoEventoRepository fotoEventoRepository;
    private final EventoRepository eventoRepository;

    public FotoEventoService(FotoEventoRepository fotoEventoRepository, EventoRepository eventoRepository) {
        this.fotoEventoRepository = fotoEventoRepository;
        this.eventoRepository = eventoRepository;
    }

    public List<FotoEvento> findByEvento(Long eventoId) {
        return fotoEventoRepository.findByEvento_IdOrderByIdAsc(eventoId);
    }

    // Obtener la portada (cover photo) del evento
    @Transactional(readOnly = true)
    public Optional<FotoEvento> findPortadaByEvento(Long eventoId) {
        return fotoEventoRepository.findByEvento_IdAndEsPortadaTrue(eventoId);
    }

    // Obtener todas las fotos (sin portada) del evento
    @Transactional(readOnly = true)
    public List<FotoEvento> findFotosByEvento(Long eventoId) {
        return fotoEventoRepository.findByEvento_IdAndEsPortadaFalseOrderByIdAsc(eventoId);
    }

    @Transactional(readOnly = true)
    public Long countFotosNoPortada(Long eventoId) {
        return fotoEventoRepository.countByEvento_IdAndEsPortadaFalse(eventoId);
    }

    // Generar nombre de carpeta automáticamente: nombreEvento_idEvento
    @Transactional(readOnly = true)
    public String generarNombreCarpeta(Long eventoId) {
        return eventoRepository.findById(eventoId)
                .map(evento -> evento.getNombre().toLowerCase().replaceAll("\\s+", "") + "_" + eventoId)
                .orElseThrow(() -> new ResourceNotFoundException("Evento", eventoId));
    }

    // Obtener una foto por evento y nombre
    @Transactional(readOnly = true)
    public Optional<FotoEvento> findByEventoAndNombreFoto(Long eventoId, String nombreFoto) {
        return fotoEventoRepository.findByEvento_IdAndNombreFoto(eventoId, nombreFoto);
    }

    @Transactional(readOnly = true)
    public String generarNombreFotoBase(Long eventoId) {
        return eventoRepository.findById(eventoId)
                .map(evento -> evento.getNombre().toLowerCase().replaceAll("\\s+", ""))
                .orElseThrow(() -> new ResourceNotFoundException("Evento", eventoId));
    }

    @Transactional(readOnly = true)
    public String generarNombreFoto(Long eventoId, int numeroFoto) {
        return generarNombreFotoBase(eventoId) + numeroFoto;
    }

    @Transactional
    public FotoEvento agregarFoto(Long eventoId, MultipartFile archivo, boolean esPortada, String nombreFoto) {
        Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new ResourceNotFoundException("Evento", eventoId));

        try {
            Path eventoDir = crearDirectorioEvento(eventoId);
            String extension = obtenerExtensionArchivo(archivo);
            String nombreArchivo = nombreFoto + extension;
            Path rutaArchivo = eventoDir.resolve(nombreArchivo);

            Files.copy(archivo.getInputStream(), rutaArchivo, StandardCopyOption.REPLACE_EXISTING);

            FotoEvento fotoEvento = new FotoEvento();
            fotoEvento.setEvento(evento);
            fotoEvento.setEsPortada(esPortada);
            fotoEvento.setNombreFoto(nombreFoto);
            fotoEvento.setRutaArchivo(rutaArchivo.toString());
            return fotoEventoRepository.save(fotoEvento);
        } catch (IOException e) {
            throw new ResourceNotFoundException("No se pudo guardar la foto en disco", eventoId);
        }
    }

    // Eliminar una foto
    @Transactional
    public void eliminarFoto(Long fotoId) {
        FotoEvento fotoEvento = fotoEventoRepository.findById(fotoId)
                .orElseThrow(() -> new ResourceNotFoundException("FotoEvento", fotoId));

        try {
            if (fotoEvento.getRutaArchivo() != null) {
                Files.deleteIfExists(Paths.get(fotoEvento.getRutaArchivo()));
            }
        } catch (IOException e) {
            throw new ResourceNotFoundException("No se pudo eliminar la foto del disco", fotoId);
        }

        fotoEventoRepository.delete(fotoEvento);
    }

    @Transactional(readOnly = true)
    public Path obtenerRutaFoto(FotoEvento fotoEvento) {
        if (fotoEvento.getRutaArchivo() == null) {
            throw new ResourceNotFoundException("FotoEvento sin ruta en disco", fotoEvento.getId());
        }

        Path ruta = Paths.get(fotoEvento.getRutaArchivo());
        if (!Files.exists(ruta)) {
            throw new ResourceNotFoundException("FotoEvento no encontrada en disco", fotoEvento.getId());
        }

        return ruta;
    }

    private Path crearDirectorioEvento(Long eventoId) throws IOException {
        Path eventoDir = Paths.get(baseDir, generarNombreCarpeta(eventoId));
        Files.createDirectories(eventoDir);
        return eventoDir;
    }

    private String obtenerExtensionArchivo(MultipartFile archivo) {
        String originalFilename = archivo.getOriginalFilename();
        if (originalFilename != null) {
            int index = originalFilename.lastIndexOf('.');
            if (index >= 0) {
                return originalFilename.substring(index);
            }
        }

        String contentType = archivo.getContentType();
        if (contentType == null) {
            return ".jpg";
        }

        if (contentType.contains("png")) {
            return ".png";
        }
        if (contentType.contains("webp")) {
            return ".webp";
        }
        if (contentType.contains("gif")) {
            return ".gif";
        }
        return ".jpg";
    }
}