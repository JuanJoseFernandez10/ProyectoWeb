export const AUTH_STORAGE_KEY = 'groovelink_auth'

export function readAuthSession() {
    if (typeof window === 'undefined') {
        return { user: null, token: null }
    }

    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) {
        return { user: null, token: null }
    }

    try {
        const parsed = JSON.parse(raw)
        return {
            user: parsed.user ?? null,
            token: parsed.token ?? null,
        }
    } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY)
        return { user: null, token: null }
    }
}

export function saveAuthSession(user, token) {
    if (typeof window === 'undefined') {
        return
    }

    localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ user, token }),
    )
}

export function clearAuthSession() {
    if (typeof window === 'undefined') {
        return
    }

    localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function getAuthToken() {
    return readAuthSession().token
}

export function dispatchTokenExpired() {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:token-expired'))
    }
}