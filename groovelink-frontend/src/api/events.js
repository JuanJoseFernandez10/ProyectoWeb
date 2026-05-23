import { API_URL } from './config'
import { getAuthToken } from './authSession'

async function requestJson(path, options = {}) {
    const token = options.token ?? (options.auth ? getAuthToken() : null)
    const response = await fetch(`${API_URL}${path}`, {
        method: options.method || 'GET',
        headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    })

    let data = null
    try {
        data = await response.json()
    } catch {
        data = null
    }

    if (!response.ok) {
        const message = data?.message || 'Error cargando eventos'
        const error = new Error(message)
        error.status = response.status
        throw error
    }

    return data
}

export function getHomeEvents({ page = 0, size = 5, recomendados = false, generoId, aptitudId, ubicacion } = {}) {
    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
        recomendados: String(recomendados),
    })
    if (generoId != null) params.set('generoId', String(generoId))
    if (aptitudId != null) params.set('aptitudId', String(aptitudId))
    if (ubicacion) params.set('ubicacion', ubicacion)

    return requestJson(`/home?${params.toString()}`, {
        auth: true,
    })
}

export async function getEventById(eventId) {
    return await requestJson(`/eventos/${eventId}`, {
        auth: true,
    })
}

export async function getRelatedEvents({ eventId, size = 5 } = {}) {
    const homePage = await getHomeEvents({ page: 0, size })

    return (homePage?.eventos ?? [])
        .filter((event) => String(event?.codigo ?? event?.id) !== String(eventId))
        .slice(0, size)
}

export function likeEvent(eventId) {
    return requestJson(`/eventos/${eventId}/me-gusta`, {
        method: 'POST',
        auth: true,
    })
}

export function unlikeEvent(eventId) {
    return requestJson(`/eventos/${eventId}/me-gusta`, {
        method: 'DELETE',
        auth: true,
    })
}

export function getEventForEdit(eventId) {
    return requestJson(`/eventos/${eventId}/edicion`, {
        auth: true,
    })
}

export function joinEvent(eventId) {
    return requestJson(`/eventos/${eventId}/unirse`, {
        method: 'POST',
        auth: true,
    })
}

export function leaveEvent(eventId) {
    return requestJson(`/eventos/${eventId}/unirse`, {
        method: 'DELETE',
        auth: true,
    })
}

export function getMyJoinedEvents() {
    return requestJson('/eventos/unidos', {
        auth: true,
    })
}

export function searchEvents({ q, page = 0, size = 6 }) {
    const params = new URLSearchParams({
        q: String(q),
        page: String(page),
        size: String(size),
    })

    return requestJson(`/eventos/buscar?${params.toString()}`, {
        auth: true,
    })
}
