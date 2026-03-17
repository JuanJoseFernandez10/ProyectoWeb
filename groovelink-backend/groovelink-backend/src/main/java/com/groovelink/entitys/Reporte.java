package com.groovelink.entitys;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Reporte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_reportero")
    private Usuario reportero;

    private String tipoContenido;
    private Long idContenido;
    private String motivo;
    private String detalleAdicional;

    @Column(name = "fecha_reporte")
    private LocalDateTime fechaReporte = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "revisado_por")
    private Administrador revisadoPor;

    private String estado = "pendiente";

    @Column(name = "fecha_revision")
    private LocalDateTime fechaRevision;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Usuario getReportero() {
		return reportero;
	}

	public void setReportero(Usuario reportero) {
		this.reportero = reportero;
	}

	public String getTipoContenido() {
		return tipoContenido;
	}

	public void setTipoContenido(String tipoContenido) {
		this.tipoContenido = tipoContenido;
	}

	public Long getIdContenido() {
		return idContenido;
	}

	public void setIdContenido(Long idContenido) {
		this.idContenido = idContenido;
	}

	public String getMotivo() {
		return motivo;
	}

	public void setMotivo(String motivo) {
		this.motivo = motivo;
	}

	public String getDetalleAdicional() {
		return detalleAdicional;
	}

	public void setDetalleAdicional(String detalleAdicional) {
		this.detalleAdicional = detalleAdicional;
	}

	public LocalDateTime getFechaReporte() {
		return fechaReporte;
	}

	public void setFechaReporte(LocalDateTime fechaReporte) {
		this.fechaReporte = fechaReporte;
	}

	public Administrador getRevisadoPor() {
		return revisadoPor;
	}

	public void setRevisadoPor(Administrador revisadoPor) {
		this.revisadoPor = revisadoPor;
	}

	public String getEstado() {
		return estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
	}

	public LocalDateTime getFechaRevision() {
		return fechaRevision;
	}

	public void setFechaRevision(LocalDateTime fechaRevision) {
		this.fechaRevision = fechaRevision;
	}
}
