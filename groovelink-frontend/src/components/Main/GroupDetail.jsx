import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../api/config'
import { fetchChatParticipantes } from '../../api/chat'
import { AuthContext } from '../../context/AuthContext'

function GroupDetail({ chat, onClose }) {
    const navigate = useNavigate()
    const { token } = useContext(AuthContext)
    const [participantes, setParticipantes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!chat?.id || !token) return
        setLoading(true)
        fetchChatParticipantes(chat.id)
            .then(setParticipantes)
            .catch(() => setParticipantes([]))
            .finally(() => setLoading(false))
    }, [chat?.id, token])

    if (!chat) return null

    const chatName = chat.nombre || 'Chat'
    const chatImage = chat.imagen ? `${API_URL}${chat.imagen}` : null
    const descripcion = chat.descripcion || ''

    return (
        <aside className="card-shell h-full overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-ink">Info del grupo</h2>
                <button
                    type="button"
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary/10 text-ink-soft"
                    aria-label="Cerrar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="flex flex-col items-center text-center mb-6">
                {chatImage ? (
                    <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-secondary/20">
                        <img src={chatImage} alt={chatName} className="h-full w-full object-cover" />
                    </div>
                ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 text-3xl font-black text-ink">
                        {chatName.slice(0, 2).toUpperCase()}
                    </div>
                )}
                <h3 className="mt-3 text-xl font-black text-ink">{chatName}</h3>
                {descripcion && (
                    <p className="mt-2 text-sm text-ink-soft max-w-xs">{descripcion}</p>
                )}
            </div>

            <div>
                <h4 className="text-sm font-bold uppercase tracking-[0.15em] text-ink-soft mb-3">
                    Participantes ({participantes.length})
                </h4>
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="h-9 w-9 animate-pulse rounded-full bg-background/70" />
                                <div className="h-4 w-24 animate-pulse rounded bg-background/70" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-1">
                        {participantes.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => navigate(`/user/${p.id}`)}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/5 cursor-pointer transition-colors"
                            >
                                {p.fotoPerfilUrl ? (
                                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full">
                                        <img src={`${API_URL}${p.fotoPerfilUrl}`} alt={p.username} className="h-full w-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-xs font-black text-secondary">
                                        {(p.username || '?').slice(0, 1).toUpperCase()}
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-ink truncate">@{p.username}</p>
                                    <p className="text-xs text-ink-soft truncate">{p.rol}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    )
}

export default GroupDetail
