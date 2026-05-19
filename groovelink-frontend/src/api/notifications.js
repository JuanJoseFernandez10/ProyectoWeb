import { API_URL } from './config'
import { getAuthToken } from './authSession'

async function authFetch(path, options = {}) {
  const token = getAuthToken()
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  let data = null
  try { data = await response.json() } catch { data = null }

  if (!response.ok) {
    const message = data?.message || 'Error en la solicitud'
    const error = new Error(message)
    error.status = response.status
    throw error
  }

  return data
}

export function obtenerNotificaciones() {
  return authFetch('/notificaciones')
}

export function contarNoLeidas() {
  return authFetch('/notificaciones/no-leidas')
}

export function marcarComoLeida(id) {
  return authFetch(`/notificaciones/${id}/leer`, { method: 'PUT' })
}

export function marcarTodasComoLeidas() {
  return authFetch('/notificaciones/leer-todas', { method: 'PUT' })
}
