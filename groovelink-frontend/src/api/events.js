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

export function getHomeEvents({ page = 0, size = 5 } = {}) {
    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
    })

    return requestJson(`/home?${params.toString()}`)
}

export async function getEventById(eventId) {
    try {
        return await requestJson(`/eventos/${eventId}`)
    } catch {
        const homePage = await getHomeEvents({ page: 0, size: 100 })
        const event = (homePage?.eventos ?? []).find((item) => String(item?.codigo ?? item?.id) === String(eventId))

        if (event) {
            return event
        }

        throw new Error('No se pudo cargar el detalle del evento')
    }
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