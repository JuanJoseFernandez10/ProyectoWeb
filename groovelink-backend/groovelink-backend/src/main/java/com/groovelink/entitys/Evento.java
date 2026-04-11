package com.groovelink.entitys;

import java.time.LocalDateTime;
import java.util.List;

import com.groovelink.entitys.relations.EventoAptitud;
import com.groovelink.entitys.relations.EventoGenero;
import com.groovelink.entitys.relations.FotoEvento;
import com.groovelink.entitys.relations.PersonaUneEvento;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String ubicacion;
    private String descripcion;

    @Column(name = "fecha_inicio")
    private java.time.LocalDate fechaInicio;

    @Column(name = "fecha_final")
    private java.time.LocalDate fechaFinal;

    @ManyToOne
    @JoinColumn(name = "publicado")
    private Usuario publicado;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PersonaUneEvento> personaUneEventos;
    
    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL)
    private java.util.List<FotoEvento> fotos;

    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL)
    private java.util.List<EventoAptitud> aptitudes;

    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL)
    private java.util.List<EventoGenero> generos;

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

	public String getUbicacion() {
		return ubicacion;
	}

	public void setUbicacion(String ubicacion) {
		this.ubicacion = ubicacion;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public java.time.LocalDate getFechaInicio() {
		return fechaInicio;
	}

	public void setFechaInicio(java.time.LocalDate fechaInicio) {
		this.fechaInicio = fechaInicio;
	}

	public java.time.LocalDate getFechaFinal() {
		return fechaFinal;
	}

	public void setFechaFinal(java.time.LocalDate fechaFinal) {
		this.fechaFinal = fechaFinal;
	}

	public Usuario getPublicado() {
		return publicado;
	}

	public void setPublicado(Usuario publicado) {
		this.publicado = publicado;
	}

	public LocalDateTime getFechaCreacion() {
		return fechaCreacion;
	}

	public void setFechaCreacion(LocalDateTime fechaCreacion) {
		this.fechaCreacion = fechaCreacion;
	}

	public java.util.List<FotoEvento> getFotos() {
		return fotos;
	}

	public void setFotos(java.util.List<FotoEvento> fotos) {
		this.fotos = fotos;
	}

	public java.util.List<EventoAptitud> getAptitudes() {
		return aptitudes;
	}

	public void setAptitudes(java.util.List<EventoAptitud> aptitudes) {
		this.aptitudes = aptitudes;
	}

	public java.util.List<EventoGenero> getGeneros() {
		return generos;
	}

	public void setGeneros(java.util.List<EventoGenero> generos) {
		this.generos = generos;
	}

	public List<PersonaUneEvento> getPersonaUneEventos() {
		return personaUneEventos;
	}

	public void setPersonaUneEventos(List<PersonaUneEvento> personaUneEventos) {
		this.personaUneEventos = personaUneEventos;
	}
    
    
    
    
}
