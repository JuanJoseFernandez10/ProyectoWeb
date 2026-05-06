import { API_URL } from './config'

async function requestJson(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
        method: options.method || 'GET',
        headers: {
            Accept: 'application/json',
            ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
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

export function likeEvent(eventId, token) {
    return requestJson(`/eventos/${eventId}/me-gusta`, {
        method: 'POST',
        token,
    })
}

export function unlikeEvent(eventId, token) {
    return requestJson(`/eventos/${eventId}/me-gusta`, {
        method: 'DELETE',
        token,
    })
}