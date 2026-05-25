import api from './client'

export function uploadEventCover(eventId, file) {
    const formData = new FormData()
    formData.append('foto', file)
    return api.upload(`/fotos-evento/${eventId}/portada`, formData, { auth: true })
}

export function uploadEventPhotos(eventId, files) {
    const formData = new FormData()
    files.forEach((file) => formData.append('fotos', file))
    return api.upload(`/fotos-evento/${eventId}/otras`, formData, { auth: true })
}
