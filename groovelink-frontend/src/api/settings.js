import { API_URL } from "./config";
import { getAuthToken } from "./authSession";

async function requestSettings(url, method, body) {
    const token = getAuthToken()
    const response = await fetch(`${API_URL}${url}`, {
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

export function cambiarEmail(nuevoEmail) {
    return requestSettings("/usuarios/me/email", "PUT", { email: nuevoEmail })
}

export function cambiarPassword(passwordActual, nuevaPassword) {
    return requestSettings("/usuarios/me/password", "PUT", { passwordActual, nuevaPassword })
}

export function eliminarCuenta() {
    return requestSettings("/usuarios/me", "DELETE")
}
