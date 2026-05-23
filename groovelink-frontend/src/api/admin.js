import { API_URL } from "./config";
import { getAuthToken } from "./authSession";

async function adminRequest(url, method, body) {
    const token = getAuthToken()
    const response = await fetch(`${API_URL}/api/admin${url}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : "",
        },
        body: body ? JSON.stringify(body) : undefined,
    })
    let data = null
    try { data = await response.json() } catch { data = null }
    if (!response.ok) {
        throw new Error(data?.message || `Error en la solicitud`)
    }
    return data
}

// ─── USUARIOS ────────────────────────────────────────────────────────────────

export async function adminFetchUsuarios(page = 0, size = 20) {
    const data = await adminRequest(`/usuarios?page=${page}&size=${size}`, "GET")
    return {
        items: data.content || data || [],
        total: data.totalElements || 0,
        totalPages: data.totalPages || 0,
    }
}

export async function adminFetchUsuario(id) {
    return adminRequest(`/usuarios/${id}`, "GET")
}

export async function adminUpdateUsuario(id, body) {
    return adminRequest(`/usuarios/${id}`, "PUT", body)
}

export async function adminFetchUsuarioDetalle(id) {
    return adminRequest(`/usuarios/${id}/detalle`, "GET")
}

export function adminEliminarUsuario(id) {
    return adminRequest(`/usuarios/${id}`, "DELETE")
}

// ─── EVENTOS ─────────────────────────────────────────────────────────────────

export async function adminFetchEventos(page = 0, size = 20) {
    const data = await adminRequest(`/eventos?page=${page}&size=${size}`, "GET")
    return {
        items: data.content || data || [],
        total: data.totalElements || 0,
        totalPages: data.totalPages || 0,
    }
}

export async function adminFetchEvento(id) {
    return adminRequest(`/eventos/${id}`, "GET")
}

export async function adminFetchEventoDetalle(id) {
    return adminRequest(`/eventos/${id}/detalle`, "GET")
}

export function adminEliminarEvento(id) {
    return adminRequest(`/eventos/${id}`, "DELETE")
}

// ─── REPORTES ────────────────────────────────────────────────────────────────

export async function adminFetchReportes(page = 0, size = 20) {
    const data = await adminRequest(`/reportes?page=${page}&size=${size}`, "GET")
    return {
        items: data.content || data || [],
        total: data.totalElements || 0,
        totalPages: data.totalPages || 0,
    }
}

export async function adminFetchReporte(id) {
    return adminRequest(`/reportes/${id}`, "GET")
}

export function adminResolverReporte(id, estado) {
    return adminRequest(`/reportes/${id}`, "PUT", { estado })
}

// ─── CHATS ───────────────────────────────────────────────────────────────────

export async function adminFetchChats() {
    return adminRequest(`/chats`, "GET")
}

export async function adminFetchUsuarioChats(usuarioId) {
    return adminRequest(`/usuarios/${usuarioId}/chats`, "GET")
}

export async function adminFetchChatMessages(chatId, page = 0, size = 50) {
    const data = await adminRequest(`/chats/${chatId}/messages?page=${page}&size=${size}`, "GET")
    return {
        items: data.content || data || [],
        total: data.totalElements || 0,
        totalPages: data.totalPages || 0,
    }
}
