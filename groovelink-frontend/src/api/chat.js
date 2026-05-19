import { API_URL } from './config'
import { getAuthToken } from './authSession'

async function requestJson(path, options = {}) {
    const token = getAuthToken()
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
        const message = data?.message || 'Error en la solicitud'
        const error = new Error(message)
        error.status = response.status
        throw error
    }

    return data
}

export function fetchMyChats() {
    return requestJson('/api/chats')
}

export function fetchChatMessages(chatId) {
    return requestJson(`/api/chats/${chatId}/messages`)
}

export function fetchChatParticipantes(chatId) {
    return requestJson(`/api/chats/${chatId}/participantes`)
}

export function createGroupChat({ nombre, descripcion, participantesIds }) {
    return requestJson('/api/chats', {
        method: 'POST',
        body: { nombre, descripcion: descripcion || '', esGrupal: true, participantesIds },
    })
}
