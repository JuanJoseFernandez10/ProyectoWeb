import api from './client'

export function getEstadisticas() {
    return api.get('/api/dashboard/estadisticas', { auth: true })
}

export function getEventosStats() {
    return api.get('/api/dashboard/eventos', { auth: true })
}
