package com.groovelink.dto.response;

public class EventoStatsDTO {

    private Long id;
    private String nombre;
    private String fechaInicio;
    private String ubicacion;
    private long numAsistentes;
    private long numMeGustas;
    private long numComentarios;
    private String imagen;

    public EventoStatsDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(String fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public long getNumAsistentes() {
        return numAsistentes;
    }

    public void setNumAsistentes(long numAsistentes) {
        this.numAsistentes = numAsistentes;
    }

    public long getNumMeGustas() {
        return numMeGustas;
    }

    public void setNumMeGustas(long numMeGustas) {
        this.numMeGustas = numMeGustas;
    }

    public long getNumComentarios() {
        return numComentarios;
    }

    public void setNumComentarios(long numComentarios) {
        this.numComentarios = numComentarios;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }
}
