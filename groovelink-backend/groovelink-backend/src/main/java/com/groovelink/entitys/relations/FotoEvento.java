package com.groovelink.entitys.relations;

import com.groovelink.entitys.Evento;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class FotoEvento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "codigo_evento")
    private Evento evento;

	@Column(name = "ruta_archivo")
	private String rutaArchivo;

    // Si es portada (cover photo del evento)
    @Column(name = "es_portada")
    private Boolean esPortada = false;
    
    // Nombre del archivo: "portada", "purolatino1", "purolatino2", etc.
    @Column(name = "nombre_foto")
    private String nombreFoto;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Evento getEvento() {
		return evento;
	}

	public void setEvento(Evento evento) {
		this.evento = evento;
	}

	public String getRutaArchivo() {
		return rutaArchivo;
	}

	public void setRutaArchivo(String rutaArchivo) {
		this.rutaArchivo = rutaArchivo;
	}

	public Boolean getEsPortada() {
		return esPortada;
	}

	public void setEsPortada(Boolean esPortada) {
		this.esPortada = esPortada;
	}

	public String getNombreFoto() {
		return nombreFoto;
	}

	public void setNombreFoto(String nombreFoto) {
		this.nombreFoto = nombreFoto;
	}
}
