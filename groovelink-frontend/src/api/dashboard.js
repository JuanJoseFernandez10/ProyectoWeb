import { API_URL } from './config'
import { getAuthToken } from './authSession'

async function request(url) {
    const token = getAuthToken()
    const res = await fetch(`${API_URL}${url}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (!res.ok) throw new Error('Error al cargar datos del dashboard')
    return res.json()
}

export function getEstadisticas() {
    return request('/api/dashboard/estadisticas')
}

export function getEventosStats() {
    return request('/api/dashboard/eventos')
}
