import api from './client'

export function solicitarAmistad(usuarioId) {
    return api.post(`/amistad/solicitar/${usuarioId}`, { auth: true })
}

export function responderSolicitud(solicitudId, aceptar) {
    return api.put(`/amistad/responder/${solicitudId}?aceptar=${aceptar}`, { auth: true })
}

export function eliminarAmistad(amigoId) {
    return api.del(`/amistad/eliminar/${amigoId}`, { auth: true })
}

export function cancelarSolicitud(usuarioId) {
    return api.del(`/amistad/cancelar/${usuarioId}`, { auth: true })
}

export function obtenerAmigos() {
    return api.get('/amistad/amigos', { auth: true })
}

export function obtenerSolicitudesRecibidas() {
    return api.get('/amistad/solicitudes-recibidas', { auth: true })
}

export function obtenerEstadoAmistad(usuarioId) {
    return api.get(`/amistad/estado/${usuarioId}`, { auth: true })
}

export function obtenerPerfilUsuario(id) {
    return api.get(`/usuarios/${id}`, { auth: true })
}

export function buscarUsuarios(q) {
    return api.get(`/usuarios/buscar?q=${encodeURIComponent(q)}`, { auth: true })
}

export function crearChatPrivado(usuarioId) {
    return api.post(`/api/chats/privado/${usuarioId}`, { auth: true })
}
