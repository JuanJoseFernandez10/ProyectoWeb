import api from './client'

export function cambiarEmail(nuevoEmail) {
    return api.put('/usuarios/me/email', { body: { email: nuevoEmail }, auth: true })
}

export function cambiarPassword(passwordActual, nuevaPassword) {
    return api.put('/usuarios/me/password', { body: { passwordActual, nuevaPassword }, auth: true })
}

export function eliminarCuenta() {
    return api.del('/usuarios/me', { auth: true })
}
