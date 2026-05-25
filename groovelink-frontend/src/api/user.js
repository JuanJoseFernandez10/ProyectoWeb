import api from './client'

export async function fetchAptitudes() {
    return api.get('/aptitudes')
}

export async function fetchGeneros() {
    return api.get('/generos')
}

export async function personalizarPerfil({ aptitudesIds, generosIds, descripcion, ubicacion }) {
    return api.put('/usuarios/me/personalizar', {
        body: { aptitudesIds: aptitudesIds || [], generosIds: generosIds || [], descripcion: descripcion || "", ubicacion: ubicacion || "" },
        auth: true,
    })
}

export async function subirFotoPerfil(fotoFile) {
    const formData = new FormData()
    formData.append("foto", fotoFile)
    return api.upload('/usuarios/me/foto-perfil', formData, { auth: true })
}
