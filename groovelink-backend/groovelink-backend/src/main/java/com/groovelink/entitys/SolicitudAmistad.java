package com.groovelink.entitys;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitud_amistad", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"id_solicitante", "id_solicitado"})
})
public class SolicitudAmistad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_solicitante", nullable = false)
    private Usuario solicitante;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_solicitado", nullable = false)
    private Usuario solicitado;

    @Column(length = 20, nullable = false)
    private String estado = "PENDIENTE";

    @Column(name = "fecha_solicitud")
    private LocalDateTime fechaSolicitud = LocalDateTime.now();

    public SolicitudAmistad() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getSolicitante() { return solicitante; }
    public void setSolicitante(Usuario solicitante) { this.solicitante = solicitante; }

    public Usuario getSolicitado() { return solicitado; }
    public void setSolicitado(Usuario solicitado) { this.solicitado = solicitado; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public LocalDateTime getFechaSolicitud() { return fechaSolicitud; }
    public void setFechaSolicitud(LocalDateTime fechaSolicitud) { this.fechaSolicitud = fechaSolicitud; }
}
