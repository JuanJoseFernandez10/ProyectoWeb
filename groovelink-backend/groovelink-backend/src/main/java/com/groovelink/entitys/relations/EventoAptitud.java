package com.groovelink.entitys.relations;

import com.groovelink.entitys.Aptitud;
import com.groovelink.entitys.Evento;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "evento_aptitudes")
public class EventoAptitud {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    @ManyToOne
    @JoinColumn(name = "id_evento", nullable = false)
    private Evento evento;

    @ManyToOne
    @JoinColumn(name = "id_aptitud", nullable = false)
    private Aptitud aptitud;

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

	public Aptitud getAptitud() {
		return aptitud;
	}

	public void setAptitud(Aptitud aptitud) {
		this.aptitud = aptitud;
	}
}
