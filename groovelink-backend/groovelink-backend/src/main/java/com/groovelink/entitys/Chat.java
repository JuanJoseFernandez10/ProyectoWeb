package com.groovelink.entitys;

import java.time.LocalDateTime;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;

@Entity
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private boolean esGrupal;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Column(name = "ultimo_mensaje")
    private LocalDateTime ultimoMensaje;

    @ManyToMany
    @JoinTable(
        name = "usuario_participa_chat",
        joinColumns = @JoinColumn(name = "id_chat"),
        inverseJoinColumns = @JoinColumn(name = "id_usuario")
    )
    private java.util.List<Usuario> participantes;

    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL)
    private java.util.List<Mensaje> mensajes;

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

	public boolean isEsGrupal() {
		return esGrupal;
	}

	public void setEsGrupal(boolean esGrupal) {
		this.esGrupal = esGrupal;
	}

	public LocalDateTime getFechaCreacion() {
		return fechaCreacion;
	}

	public void setFechaCreacion(LocalDateTime fechaCreacion) {
		this.fechaCreacion = fechaCreacion;
	}

	public LocalDateTime getUltimoMensaje() {
		return ultimoMensaje;
	}

	public void setUltimoMensaje(LocalDateTime ultimoMensaje) {
		this.ultimoMensaje = ultimoMensaje;
	}

	public java.util.List<Usuario> getParticipantes() {
		return participantes;
	}

	public void setParticipantes(java.util.List<Usuario> participantes) {
		this.participantes = participantes;
	}

	public java.util.List<Mensaje> getMensajes() {
		return mensajes;
	}

	public void setMensajes(java.util.List<Mensaje> mensajes) {
		this.mensajes = mensajes;
	}
    
    
}
