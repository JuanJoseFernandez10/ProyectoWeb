import api from './client'

export function obtenerNotificaciones() {
    return api.get('/notificaciones', { auth: true })
}

export function contarNoLeidas() {
    return api.get('/notificaciones/no-leidas', { auth: true })
}

export function marcarComoLeida(id) {
    return api.put(`/notificaciones/${id}/leer`, { auth: true })
}

export function marcarTodasComoLeidas() {
    return api.put('/notificaciones/leer-todas', { auth: true })
}
