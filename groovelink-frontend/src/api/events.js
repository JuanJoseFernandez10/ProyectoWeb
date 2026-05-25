import api from './client'

export function getHomeEvents({ page = 0, size = 5, recomendados = false, generoId, aptitudId, ubicacion } = {}) {
    const params = new URLSearchParams({ page: String(page), size: String(size), recomendados: String(recomendados) })
    if (generoId != null) params.set('generoId', String(generoId))
    if (aptitudId != null) params.set('aptitudId', String(aptitudId))
    if (ubicacion) params.set('ubicacion', ubicacion)
    return api.get(`/home?${params.toString()}`, { auth: true })
}

export function getEventById(eventId) {
    return api.get(`/eventos/${eventId}`, { auth: true })
}

export async function getRelatedEvents({ eventId, size = 5 } = {}) {
    const homePage = await getHomeEvents({ page: 0, size })
    return (homePage?.eventos ?? []).filter((event) => String(event?.codigo ?? event?.id) !== String(eventId)).slice(0, size)
}

export function likeEvent(eventId) {
    return api.post(`/eventos/${eventId}/me-gusta`, { auth: true })
}

export function unlikeEvent(eventId) {
    return api.del(`/eventos/${eventId}/me-gusta`, { auth: true })
}

export function getEventForEdit(eventId) {
    return api.get(`/eventos/${eventId}/edicion`, { auth: true })
}

export function joinEvent(eventId) {
    return api.post(`/eventos/${eventId}/unirse`, { auth: true })
}

export function leaveEvent(eventId) {
    return api.del(`/eventos/${eventId}/unirse`, { auth: true })
}

export function getMyJoinedEvents() {
    return api.get('/eventos/unidos', { auth: true })
}

export function getAptitudes() {
    return api.get('/aptitudes')
}

export function getGeneros() {
    return api.get('/generos')
}

export function searchEvents({ q, page = 0, size = 6 }) {
    const params = new URLSearchParams({ q: String(q), page: String(page), size: String(size) })
    return api.get(`/eventos/buscar?${params.toString()}`, { auth: true })
}
