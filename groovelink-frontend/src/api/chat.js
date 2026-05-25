import api from './client'

export function fetchMyChats() {
    return api.get('/api/chats', { auth: true })
}

export function fetchChatMessages(chatId) {
    return api.get(`/api/chats/${chatId}/messages`, { auth: true })
}

export function fetchChatParticipantes(chatId) {
    return api.get(`/api/chats/${chatId}/participantes`, { auth: true })
}

export function createGroupChat({ nombre, descripcion, participantesIds }) {
    return api.post('/api/chats', { body: { nombre, descripcion: descripcion || '', esGrupal: true, participantesIds }, auth: true })
}
