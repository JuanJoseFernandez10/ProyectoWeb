import { API_URL } from './config'
import { getAuthToken } from './authSession'

async function requestFormData(path, formData, method = 'POST') {
    const token = getAuthToken()
    const response = await fetch(`${API_URL}${path}`, {
        method,
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
    })

    let data = null
    try {
        data = await response.json()
    } catch {
        data = null
    }

    if (!response.ok) {
        const message = data?.message || 'Error gestionando fotos del evento'
        const error = new Error(message)
        error.status = response.status
        throw error
    }

    return data
}

export function uploadEventCover(eventId, file) {
    const formData = new FormData()
    formData.append('foto', file)

    return requestFormData(`/fotos-evento/${eventId}/portada`, formData)
}

export function uploadEventPhotos(eventId, files) {
    const formData = new FormData()
    files.forEach((file) => formData.append('fotos', file))

    return requestFormData(`/fotos-evento/${eventId}/otras`, formData)
}
