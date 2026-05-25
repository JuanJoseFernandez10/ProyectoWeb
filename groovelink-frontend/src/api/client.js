import { API_URL } from './config'
import { getAuthToken } from './authSession'

async function request(path, { method = 'GET', body, auth = false, formData = false } = {}) {
    const token = auth ? getAuthToken() : null
    const headers = { Accept: 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    if (body && !formData) headers['Content-Type'] = 'application/json'

    const response = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: formData ? body : body ? JSON.stringify(body) : undefined,
    })

    let data = null
    try { data = await response.json() } catch { data = null }

    if (!response.ok) {
        const message = data?.message || `Error ${response.status}`
        const error = new Error(message)
        error.status = response.status
        error.data = data
        throw error
    }

    return data ?? null
}

export const api = {
    get: (path, opts) => request(path, { ...opts, method: 'GET' }),
    post: (path, opts) => request(path, { ...opts, method: 'POST' }),
    put: (path, opts) => request(path, { ...opts, method: 'PUT' }),
    del: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
    upload: (path, formData, opts) => request(path, { ...opts, method: 'POST', body: formData, formData: true }),
}

export default api
