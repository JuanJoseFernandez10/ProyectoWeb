import api from './client'

export async function activarPremium() {
    return api.post('/usuarios/me/premium', { auth: true })
}
