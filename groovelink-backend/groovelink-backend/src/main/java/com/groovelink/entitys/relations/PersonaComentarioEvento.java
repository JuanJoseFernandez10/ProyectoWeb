package com.groovelink.entitys.relations;

import java.time.LocalDateTime;

import com.groovelink.entitys.Evento;
import com.groovelink.entitys.Persona;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "persona_comentario_evento")
public class PersonaComentarioEvento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Persona usuario;

    @ManyToOne
    @JoinColumn(name = "codigo_evento", nullable = false)
    private Evento evento;

    private String texto;
    private Integer megustas = 0;

    @Column(name = "fecha")
    private LocalDateTime fecha = LocalDateTime.now();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Persona getUsuario() {
		return usuario;
	}

	public void setUsuario(Persona usuario) {
		this.usuario = usuario;
	}

	public Evento getEvento() {
		return evento;
	}

	public void setEvento(Evento evento) {
		this.evento = evento;
	}

	public String getTexto() {
		return texto;
	}

	public void setTexto(String texto) {
		this.texto = texto;
	}

	public Integer getMegustas() {
		return megustas;
	}

	public void setMegustas(Integer megustas) {
		this.megustas = megustas;
	}

	public LocalDateTime getFecha() {
		return fecha;
	}

	public void setFecha(LocalDateTime fecha) {
		this.fecha = fecha;
	}
}
