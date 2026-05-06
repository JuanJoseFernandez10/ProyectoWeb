package com.groovelink.entitys;

import com.groovelink.entitys.relations.PersonaAptitud;
import com.groovelink.entitys.relations.PersonaComentarioEvento;
import com.groovelink.entitys.relations.PersonaGenero;
import com.groovelink.entitys.relations.PersonaMeGustaEvento;
import com.groovelink.entitys.relations.PersonaUneEvento;

import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;

@Entity
@PrimaryKeyJoinColumn(name = "id")
public class Persona extends Usuario {

    private boolean premium = false;

    // relaciones
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private java.util.List<PersonaAptitud> aptitudes;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private java.util.List<PersonaGenero> generos;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private java.util.List<PersonaComentarioEvento> comentarios;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private java.util.List<PersonaUneEvento> asistencias;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private java.util.List<PersonaMeGustaEvento> meGustasEventos;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL)
    private Perfil perfil;

	public boolean isPremium() {
		return premium;
	}

	public void setPremium(boolean premium) {
		this.premium = premium;
	}

	public java.util.List<PersonaAptitud> getAptitudes() {
		return aptitudes;
	}

	public void setAptitudes(java.util.List<PersonaAptitud> aptitudes) {
		this.aptitudes = aptitudes;
	}

	public java.util.List<PersonaGenero> getGeneros() {
		return generos;
	}

	public void setGeneros(java.util.List<PersonaGenero> generos) {
		this.generos = generos;
	}

	public java.util.List<PersonaComentarioEvento> getComentarios() {
		return comentarios;
	}

	public void setComentarios(java.util.List<PersonaComentarioEvento> comentarios) {
		this.comentarios = comentarios;
	}

	public java.util.List<PersonaUneEvento> getAsistencias() {
		return asistencias;
	}

	public void setAsistencias(java.util.List<PersonaUneEvento> asistencias) {
		this.asistencias = asistencias;
	}

	public java.util.List<PersonaMeGustaEvento> getMeGustasEventos() {
		return meGustasEventos;
	}

	public void setMeGustasEventos(java.util.List<PersonaMeGustaEvento> meGustasEventos) {
		this.meGustasEventos = meGustasEventos;
	}

	public Perfil getPerfil() {
		return perfil;
	}

	public void setPerfil(Perfil perfil) {
		this.perfil = perfil;
	}
}
