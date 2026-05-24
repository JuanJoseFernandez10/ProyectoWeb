package com.groovelink.service.relations;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.groovelink.entitys.relations.FotoEvento;
import com.groovelink.entitys.Evento;
import com.groovelink.exception.ResourceNotFoundException;
import com.groovelink.repository.EventoRepository;
import com.groovelink.repository.relations.FotoEventoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class FotoEventoService {

    private final Cloudinary cloudinary;
    private final String folder;
    private final FotoEventoRepository fotoEventoRepository;
    private final EventoRepository eventoRepository;

    public FotoEventoService(Cloudinary cloudinary,
                             @Value("${app.cloudinary.folder}") String folder,
                             FotoEventoRepository fotoEventoRepository,
                             EventoRepository eventoRepository) {
        this.cloudinary = cloudinary;
        this.folder = folder;
        this.fotoEventoRepository = fotoEventoRepository;
        this.eventoRepository = eventoRepository;
    }

    public List<FotoEvento> findByEvento(Long eventoId) {
        return fotoEventoRepository.findByEvento_IdOrderByIdAsc(eventoId);
    }

    @Transactional(readOnly = true)
    public Optional<FotoEvento> findById(Long fotoId) {
        return fotoEventoRepository.findById(fotoId);
    }

    @Transactional(readOnly = true)
    public Optional<FotoEvento> findPortadaByEvento(Long eventoId) {
        return fotoEventoRepository.findByEvento_IdAndEsPortadaTrue(eventoId);
    }

    @Transactional(readOnly = true)
    public List<FotoEvento> findFotosByEvento(Long eventoId) {
        return fotoEventoRepository.findByEvento_IdAndEsPortadaFalseOrderByIdAsc(eventoId);
    }

    @Transactional(readOnly = true)
    public Long countFotosNoPortada(Long eventoId) {
        return fotoEventoRepository.countByEvento_IdAndEsPortadaFalse(eventoId);
    }

    @Transactional(readOnly = true)
    public String generarNombreCarpeta(Long eventoId) {
        return eventoRepository.findById(eventoId)
                .map(evento -> evento.getNombre() + "_" + eventoId)
                .orElseThrow(() -> new ResourceNotFoundException("Evento", eventoId));
    }

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
            String publicId = folder + "/" + generarNombreCarpeta(eventoId) + "/" + nombreFoto;

            Map<?, ?> uploadResult = cloudinary.uploader().upload(archivo.getBytes(),
                ObjectUtils.asMap(
                    "public_id", publicId,
                    "overwrite", true,
                    "resource_type", "image"
                ));

            String url = (String) uploadResult.get("secure_url");

            FotoEvento fotoEvento = new FotoEvento();
            fotoEvento.setEvento(evento);
            fotoEvento.setEsPortada(esPortada);
            fotoEvento.setNombreFoto(nombreFoto);
            fotoEvento.setRutaArchivo(url);
            return fotoEventoRepository.save(fotoEvento);
        } catch (Exception e) {
            throw new RuntimeException("No se pudo subir la foto a Cloudinary: " + e.getMessage());
        }
    }

    @Transactional
    public void eliminarFoto(Long fotoId) {
        FotoEvento fotoEvento = fotoEventoRepository.findById(fotoId)
                .orElseThrow(() -> new ResourceNotFoundException("FotoEvento", fotoId));

        try {
            String publicId = extraerPublicId(fotoEvento.getRutaArchivo());
            if (publicId != null) {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            }
        } catch (Exception e) {
            throw new RuntimeException("No se pudo eliminar la foto de Cloudinary: " + e.getMessage());
        }

        fotoEventoRepository.delete(fotoEvento);
    }

    public String obtenerUrlFoto(FotoEvento fotoEvento) {
        if (fotoEvento.getRutaArchivo() == null) {
            throw new ResourceNotFoundException("FotoEvento sin URL en Cloudinary", fotoEvento.getId());
        }
        return fotoEvento.getRutaArchivo();
    }

    private String extraerPublicId(String url) {
        if (url == null || !url.contains(folder)) return null;

        try {
            int folderIndex = url.indexOf(folder);
            int extensionIndex = url.lastIndexOf('.');
            if (extensionIndex < 0) extensionIndex = url.length();
            return url.substring(folderIndex, extensionIndex);
        } catch (Exception e) {
            return null;
        }
    }
}
