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
    ...(options.body && !(options.body instanceof FormData) ? { body: JSON.stringify(options.body) } : {}),
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

export function solicitarAmistad(usuarioId) {
  return authFetch(`/amistad/solicitar/${usuarioId}`, { method: 'POST' })
}

export function responderSolicitud(solicitudId, aceptar) {
  return authFetch(`/amistad/responder/${solicitudId}?aceptar=${aceptar}`, { method: 'PUT' })
}

export function eliminarAmistad(amigoId) {
  return authFetch(`/amistad/eliminar/${amigoId}`, { method: 'DELETE' })
}

export function cancelarSolicitud(usuarioId) {
  return authFetch(`/amistad/cancelar/${usuarioId}`, { method: 'DELETE' })
}

export function obtenerAmigos() {
  return authFetch('/amistad/amigos')
}

export function obtenerSolicitudesRecibidas() {
  return authFetch('/amistad/solicitudes-recibidas')
}

export function obtenerEstadoAmistad(usuarioId) {
  return authFetch(`/amistad/estado/${usuarioId}`)
}

export function obtenerPerfilUsuario(id) {
  return authFetch(`/usuarios/${id}`)
}

export function buscarUsuarios(q) {
  return authFetch(`/usuarios/buscar?q=${encodeURIComponent(q)}`)
}

export function crearChatPrivado(usuarioId) {
  return authFetch(`/api/chats/privado/${usuarioId}`, { method: 'POST' })
}
