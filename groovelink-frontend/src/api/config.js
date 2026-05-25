export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export function resolveImage(path) {
    if (!path) return null
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`
}
