import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { obtenerNotificaciones, contarNoLeidas, marcarComoLeida, marcarTodasComoLeidas } from '../../api/notifications'

function NotificationsPanel({ onClose }) {
    const navigate = useNavigate()
    const [notificaciones, setNotificaciones] = useState([])
    const [noLeidas, setNoLeidas] = useState(0)
    const [loading, setLoading] = useState(true)
    const panelRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(e) {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                onClose()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [onClose])

    useEffect(() => {
        setLoading(true)
        Promise.all([
            obtenerNotificaciones(),
            contarNoLeidas(),
        ])
            .then(([notifs, countData]) => {
                const all = notifs?.content || notifs || []
                setNotificaciones(all.filter((n) => !n.leida))
                setNoLeidas(countData?.count ?? 0)
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    const handleClick = async (notif) => {
        if (!notif.leida) {
            try {
                await marcarComoLeida(notif.id)
                setNoLeidas((prev) => Math.max(0, prev - 1))
                setNotificaciones((prev) =>
                    prev.map((n) => (n.id === notif.id ? { ...n, leida: true } : n))
                )
            } catch {}
        }

        if (notif.tipo === 'SOLICITUD_AMISTAD' || notif.tipo === 'SOLICITUD_ACEPTADA') {
            if (notif.referenciaId) {
                navigate(`/user/${notif.referenciaId}`)
                onClose()
            }
        } else if (notif.tipo === 'NUEVO_COMENTARIO' || notif.tipo === 'USUARIO_SE_UNIO') {
            if (notif.referenciaId) {
                navigate(`/event/${notif.referenciaId}`)
                onClose()
            }
        }
    }

    const handleDismiss = async (e, id) => {
        e.stopPropagation()
        try {
            await marcarComoLeida(id)
            setNoLeidas((prev) => Math.max(0, prev - 1))
            setNotificaciones((prev) => prev.filter((n) => n.id !== id))
        } catch {}
    }

    const handleMarkAllRead = async () => {
        try {
            await marcarTodasComoLeidas()
            setNoLeidas(0)
            setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })))
        } catch {}
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
        return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' }).format(date)
    }

    return (
        <div
            ref={panelRef}
            className="absolute right-0 sm:right-0 top-full z-50 mt-2 w-72 sm:w-80 md:w-96 rounded-2xl border border-secondary/20 bg-text-primary shadow-xl shadow-ink/10"
        >
            <div className="flex items-center justify-between border-b border-secondary/20 px-4 py-3">
                <h3 className="text-sm font-bold text-ink">
                    Notificaciones
                    {noLeidas > 0 && (
                        <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                            {noLeidas}
                        </span>
                    )}
                </h3>
                {noLeidas > 0 && (
                    <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="text-xs font-semibold text-secondary hover:text-secondary/80"
                    >
                        Marcar todo leído
                    </button>
                )}
            </div>

            <div className="max-h-80 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
                    </div>
                ) : notificaciones.length === 0 ? (
                    <p className="py-8 text-center text-sm text-ink-soft">No tienes notificaciones</p>
                ) : (
                    notificaciones.map((notif) => (
                        <div
                            key={notif.id}
                            onClick={() => handleClick(notif)}
                            className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-secondary/10 last:border-b-0 ${
                                notif.leida ? 'hover:bg-secondary/5' : 'bg-primary/10 hover:bg-primary/20'
                            }`}
                        >
                            <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                notif.leida ? 'bg-secondary/10' : 'bg-secondary/20'
                            }`}>
                                {notif.tipo === 'SOLICITUD_AMISTAD' || notif.tipo === 'SOLICITUD_ACEPTADA' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className={`text-sm leading-relaxed ${notif.leida ? 'text-ink-soft' : 'text-ink font-semibold'}`}>
                                    {notif.mensaje}
                                </p>
                                <p className="mt-0.5 text-xs text-ink-soft/70">{formatDate(notif.fechaCreacion)}</p>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                                <button
                                    type="button"
                                    onClick={(e) => handleDismiss(e, notif.id)}
                                    className="flex h-5 w-5 items-center justify-center rounded-full text-ink-soft/50 hover:bg-secondary/10 hover:text-ink-soft"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                {!notif.leida && (
                                    <div className="h-2 w-2 shrink-0 rounded-full bg-secondary" />
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default NotificationsPanel
