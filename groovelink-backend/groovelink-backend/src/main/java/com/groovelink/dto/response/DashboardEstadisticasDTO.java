package com.groovelink.dto.response;

public class DashboardEstadisticasDTO {

    private long totalEventos;
    private long totalAsistentes;
    private long totalMeGustas;
    private long totalComentarios;

    public DashboardEstadisticasDTO() {}

    public DashboardEstadisticasDTO(long totalEventos, long totalAsistentes, long totalMeGustas, long totalComentarios) {
        this.totalEventos = totalEventos;
        this.totalAsistentes = totalAsistentes;
        this.totalMeGustas = totalMeGustas;
        this.totalComentarios = totalComentarios;
    }

    public long getTotalEventos() {
        return totalEventos;
    }

    public void setTotalEventos(long totalEventos) {
        this.totalEventos = totalEventos;
    }

    public long getTotalAsistentes() {
        return totalAsistentes;
    }

    public void setTotalAsistentes(long totalAsistentes) {
        this.totalAsistentes = totalAsistentes;
    }

    public long getTotalMeGustas() {
        return totalMeGustas;
    }

    public void setTotalMeGustas(long totalMeGustas) {
        this.totalMeGustas = totalMeGustas;
    }

    public long getTotalComentarios() {
        return totalComentarios;
    }

    public void setTotalComentarios(long totalComentarios) {
        this.totalComentarios = totalComentarios;
    }
}
