import api from './client'

async function request(path, payload) {
    try {
        return await api.post(path, { body: payload })
    } catch (error) {
        const data = error.data
        const message = data?.fieldMessage || data?.message || "Error de autenticacion"
        const enhanced = new Error(message)
        enhanced.status = data?.status || error.status
        enhanced.errorCode = data?.errorCode || null
        enhanced.field = data?.field || null
        enhanced.fieldLabel = data?.fieldLabel || null
        enhanced.fieldMessage = data?.fieldMessage || null
        enhanced.errors = data?.errors || {}
        enhanced.errorLabels = data?.errorLabels || {}
        throw enhanced
    }
}

export function loginRequest({ username, password }) {
    return request("/auth/login", { username, password })
}

export function registerRequest({ username, email, password, role }) {
    return request("/auth/register", { username, email, password, role })
}
