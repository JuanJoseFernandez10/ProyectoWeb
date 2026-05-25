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

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class FotoEventoService {

    private final Cloudinary cloudinary;
    private final String cloudinaryFolder;
    private final String localBaseDir;
    private final FotoEventoRepository fotoEventoRepository;
    private final EventoRepository eventoRepository;

    public FotoEventoService(Optional<Cloudinary> cloudinary,
                             @Value("${app.cloudinary.folder}") String cloudinaryFolder,
                             @Value("${app.fotos-evento.base-dir}") String localBaseDir,
                             FotoEventoRepository fotoEventoRepository,
                             EventoRepository eventoRepository) {
        this.cloudinary = cloudinary.orElse(null);
        this.cloudinaryFolder = cloudinaryFolder;
        this.localBaseDir = localBaseDir;
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
        return fotoEventoRepository.findFirstByEvento_IdAndEsPortadaTrue(eventoId);
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

        // Si es portada, quitar la portada anterior para evitar duplicados
        if (esPortada) {
            fotoEventoRepository.findFirstByEvento_IdAndEsPortadaTrue(eventoId)
                .ifPresent(portadaAnterior -> {
                    portadaAnterior.setEsPortada(false);
                    fotoEventoRepository.save(portadaAnterior);
                });
        }

        try {
            String url = subirArchivo(eventoId, archivo, nombreFoto);

            FotoEvento fotoEvento = new FotoEvento();
            fotoEvento.setEvento(evento);
            fotoEvento.setEsPortada(esPortada);
            fotoEvento.setNombreFoto(nombreFoto);
            fotoEvento.setRutaArchivo(url);
            return fotoEventoRepository.save(fotoEvento);
        } catch (Exception e) {
            throw new RuntimeException("No se pudo subir la foto: " + e.getMessage());
        }
    }

    private String subirArchivo(Long eventoId, MultipartFile archivo, String nombreFoto) throws IOException {
        if (cloudinary != null) {
            return subirACloudinary(eventoId, archivo, nombreFoto);
        }
        return guardarLocal(eventoId, archivo, nombreFoto);
    }

    private String subirACloudinary(Long eventoId, MultipartFile archivo, String nombreFoto) throws IOException {
        String publicId = cloudinaryFolder + "/" + generarNombreCarpeta(eventoId) + "/" + nombreFoto;

        Map<?, ?> uploadResult = cloudinary.uploader().upload(archivo.getBytes(),
            ObjectUtils.asMap(
                "public_id", publicId,
                "overwrite", true,
                "resource_type", "image"
            ));

        return (String) uploadResult.get("secure_url");
    }

    private String guardarLocal(Long eventoId, MultipartFile archivo, String nombreFoto) throws IOException {
        String nombreCarpeta = generarNombreCarpeta(eventoId);
        Path rutaDirectorio = Paths.get(localBaseDir, nombreCarpeta);
        Files.createDirectories(rutaDirectorio);

        String extension = "";
        String originalFilename = archivo.getOriginalFilename();
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        Path rutaArchivo = rutaDirectorio.resolve(nombreFoto + extension);
        Files.copy(archivo.getInputStream(), rutaArchivo, StandardCopyOption.REPLACE_EXISTING);

        return rutaArchivo.toString();
    }

    @Transactional
    public void eliminarFoto(Long fotoId) {
        FotoEvento fotoEvento = fotoEventoRepository.findById(fotoId)
                .orElseThrow(() -> new ResourceNotFoundException("FotoEvento", fotoId));

        eliminarArchivo(fotoEvento.getRutaArchivo());

        fotoEventoRepository.delete(fotoEvento);
    }

    private void eliminarArchivo(String rutaArchivo) {
        if (rutaArchivo == null) return;

        if (rutaArchivo.contains(cloudinaryFolder)) {
            eliminarDeCloudinary(rutaArchivo);
        } else {
            eliminarLocal(rutaArchivo);
        }
    }

    private void eliminarDeCloudinary(String rutaArchivo) {
        if (cloudinary == null) return;

        try {
            String publicId = extraerPublicId(rutaArchivo);
            if (publicId != null) {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            }
        } catch (Exception e) {
            throw new RuntimeException("No se pudo eliminar la foto de Cloudinary: " + e.getMessage());
        }
    }

    private void eliminarLocal(String rutaArchivo) {
        try {
            Files.deleteIfExists(Paths.get(rutaArchivo));
        } catch (IOException e) {
            throw new RuntimeException("No se pudo eliminar el archivo local: " + e.getMessage());
        }
    }

    public String obtenerUrlFoto(FotoEvento fotoEvento) {
        if (fotoEvento.getRutaArchivo() == null) {
            throw new ResourceNotFoundException("FotoEvento sin URL", fotoEvento.getId());
        }
        return fotoEvento.getRutaArchivo();
    }

    private String extraerPublicId(String url) {
        if (url == null || !url.contains(cloudinaryFolder)) return null;

        try {
            int folderIndex = url.indexOf(cloudinaryFolder);
            int extensionIndex = url.lastIndexOf('.');
            if (extensionIndex < 0) extensionIndex = url.length();
            return url.substring(folderIndex, extensionIndex);
        } catch (Exception e) {
            return null;
        }
    }
}