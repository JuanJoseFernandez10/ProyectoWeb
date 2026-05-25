import api from './client'

const ADMIN_PREFIX = '/api/admin'

export async function adminFetchUsuarios(page = 0, size = 20) {
    const data = await api.get(`${ADMIN_PREFIX}/usuarios?page=${page}&size=${size}`, { auth: true })
    return { items: data.content || data || [], total: data.totalElements || 0, totalPages: data.totalPages || 0 }
}

export async function adminFetchUsuario(id) {
    return api.get(`${ADMIN_PREFIX}/usuarios/${id}`, { auth: true })
}

export async function adminUpdateUsuario(id, body) {
    return api.put(`${ADMIN_PREFIX}/usuarios/${id}`, { body, auth: true })
}

export async function adminFetchUsuarioDetalle(id) {
    return api.get(`${ADMIN_PREFIX}/usuarios/${id}/detalle`, { auth: true })
}

export function adminEliminarUsuario(id) {
    return api.del(`${ADMIN_PREFIX}/usuarios/${id}`, { auth: true })
}

export async function adminFetchEventos(page = 0, size = 20) {
    const data = await api.get(`${ADMIN_PREFIX}/eventos?page=${page}&size=${size}`, { auth: true })
    return { items: data.content || data || [], total: data.totalElements || 0, totalPages: data.totalPages || 0 }
}

export async function adminFetchEvento(id) {
    return api.get(`${ADMIN_PREFIX}/eventos/${id}`, { auth: true })
}

export async function adminFetchEventoDetalle(id) {
    return api.get(`${ADMIN_PREFIX}/eventos/${id}/detalle`, { auth: true })
}

export function adminEliminarEvento(id) {
    return api.del(`${ADMIN_PREFIX}/eventos/${id}`, { auth: true })
}

export async function adminFetchReportes(page = 0, size = 20) {
    const data = await api.get(`${ADMIN_PREFIX}/reportes?page=${page}&size=${size}`, { auth: true })
    return { items: data.content || data || [], total: data.totalElements || 0, totalPages: data.totalPages || 0 }
}

export async function adminFetchReporte(id) {
    return api.get(`${ADMIN_PREFIX}/reportes/${id}`, { auth: true })
}

export function adminResolverReporte(id, estado) {
    return api.put(`${ADMIN_PREFIX}/reportes/${id}`, { body: { estado }, auth: true })
}

export async function adminFetchChats() {
    return api.get(`${ADMIN_PREFIX}/chats`, { auth: true })
}

export async function adminFetchUsuarioChats(usuarioId) {
    return api.get(`${ADMIN_PREFIX}/usuarios/${usuarioId}/chats`, { auth: true })
}

export async function adminFetchChatMessages(chatId, page = 0, size = 50) {
    const data = await api.get(`${ADMIN_PREFIX}/chats/${chatId}/messages?page=${page}&size=${size}`, { auth: true })
    return { items: data.content || data || [], total: data.totalElements || 0, totalPages: data.totalPages || 0 }
}
