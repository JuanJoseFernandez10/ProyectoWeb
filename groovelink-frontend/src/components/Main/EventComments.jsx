import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../api/config'
import { AuthContext } from '../../context/AuthContext'
import { getAuthToken } from '../../api/authSession'

function EventComments({ eventoId }) {
    const navigate = useNavigate()
    const { user, token } = useContext(AuthContext)
    const [comentarios, setComentarios] = useState([])
    const [texto, setTexto] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!eventoId) return
        setLoading(true)
        fetch(`${API_URL}/eventos/${eventoId}/comentarios`, {
            headers: {
                Accept: 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })
            .then((res) => (res.ok ? res.json() : []))
            .then(setComentarios)
            .catch(() => setComentarios([]))
            .finally(() => setLoading(false))
    }, [eventoId, token])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!texto.trim() || sending) return
        setSending(true)
        setError('')
        try {
            const authToken = getAuthToken()
            const res = await fetch(`${API_URL}/eventos/${eventoId}/comentarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
                },
                body: JSON.stringify({ eventoId, texto: texto.trim() }),
            })
            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data?.message || 'Error al publicar comentario')
            }
            const nuevo = await res.json()
            setComentarios((prev) => [nuevo, ...prev])
            setTexto('')
        } catch (err) {
            setError(err.message)
        } finally {
            setSending(false)
        }
    }

    const formatDate = (value) => {
        if (!value) return ''
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) return ''
        const now = new Date()
        const diffMs = now - date
        const diffMin = Math.floor(diffMs / 60000)
        if (diffMin < 1) return 'Ahora'
        if (diffMin < 60) return `Hace ${diffMin} min`
        const diffHrs = Math.floor(diffMin / 60)
        if (diffHrs < 24) return `Hace ${diffHrs}h`
        if (diffHrs < 48) return 'Ayer'
        return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' }).format(date)
    }

    return (
        <section className="card-shell p-5">
            <h2 className="text-xl font-black text-ink">
                Comentarios ({comentarios.length})
            </h2>

            {user ? (
                <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                    <input
                        type="text"
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        placeholder="Escribe un comentario..."
                        className="flex-1 rounded-xl border border-secondary/25 bg-text-primary px-4 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus:border-secondary"
                    />
                    <button
                        type="submit"
                        disabled={sending || !texto.trim()}
                        className="rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-text-primary transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        {sending ? '...' : 'Enviar'}
                    </button>
                </form>
            ) : (
                <p className="mt-4 text-sm text-ink-soft">
                    <button type="button" onClick={() => navigate('/login')} className="font-semibold text-secondary hover:underline">
                        Inicia sesión
                    </button> para comentar.
                </p>
            )}

            {error && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
                    {error}
                </div>
            )}

            <div className="mt-4 space-y-3">
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex gap-3">
                                <div className="h-8 w-8 animate-pulse rounded-full bg-background/70" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-24 animate-pulse rounded bg-background/70" />
                                    <div className="h-8 w-full animate-pulse rounded bg-background/70" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : comentarios.length === 0 ? (
                    <p className="py-4 text-center text-sm text-ink-soft">No hay comentarios aún. ¡Sé el primero!</p>
                ) : (
                    comentarios.map((c) => (
                        <div key={c.id} className="flex gap-3 rounded-xl bg-background/50 p-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-xs font-black text-secondary">
                                {(c.usuarioUsername || '?').slice(0, 1).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-ink">@{c.usuarioUsername}</span>
                                    <span className="text-xs text-ink-soft/60">{formatDate(c.fecha)}</span>
                                </div>
                                <p className="mt-1 text-sm text-ink-soft">{c.texto}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    )
}

export default EventComments
