import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { obtenerAmigos } from '../api/friends'
import { createGroupChat } from '../api/chat'
import { API_URL } from '../api/config'

function CreateGroup() {
    const navigate = useNavigate()
    const { token } = useContext(AuthContext)
    const [amigos, setAmigos] = useState([])
    const [selectedIds, setSelectedIds] = useState([])
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }
        obtenerAmigos()
            .then((data) => setAmigos(Array.isArray(data) ? data : []))
            .catch(() => setAmigos([]))
            .finally(() => setLoading(false))
    }, [token, navigate])

    const toggleAmigo = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        )
    }

    const handleCreate = async () => {
        if (!nombre.trim()) {
            setError('El grupo necesita un nombre')
            return
        }
        if (selectedIds.length < 1) {
            setError('Selecciona al menos un amigo para crear el grupo')
            return
        }
        setCreating(true)
        setError('')
        try {
            const chat = await createGroupChat({
                nombre: nombre.trim(),
                descripcion: descripcion.trim(),
                participantesIds: selectedIds,
            })
            navigate(`/chats?chatId=${chat.id}`)
        } catch (err) {
            setError(err.message || 'Error al crear el grupo')
        } finally {
            setCreating(false)
        }
    }

    return (
        <main className="page-surface min-h-screen px-4 py-8 md:px-6 md:py-10">
            <div className="mx-auto w-full max-w-2xl">
                <div className="mb-6">
                    <button type="button" className="btn-ghost px-4 py-2 text-sm" onClick={() => navigate('/groups')}>
                        Volver a grupos
                    </button>
                </div>

                <section className="card-shell p-5 md:p-7">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Nuevo grupo</p>
                    <h1 className="mt-2 text-3xl font-black text-ink">Crear grupo</h1>

                    <div className="mt-6 space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-ink mb-1">Nombre del grupo</label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ej: Mi grupo musical"
                                className="w-full rounded-xl border border-secondary/25 bg-text-primary px-4 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus:border-secondary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-ink mb-1">Descripción (opcional)</label>
                            <textarea
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                placeholder="Describe de qué va el grupo..."
                                rows={3}
                                className="w-full rounded-xl border border-secondary/25 bg-text-primary px-4 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus:border-secondary resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-ink mb-3">
                                Añadir amigos ({selectedIds.length} seleccionados)
                            </label>
                            {loading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="h-9 w-9 animate-pulse rounded-full bg-background/70" />
                                            <div className="h-4 w-28 animate-pulse rounded bg-background/70" />
                                        </div>
                                    ))}
                                </div>
                            ) : amigos.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-secondary/30 bg-background/60 p-6 text-center">
                                    <p className="text-sm font-semibold text-ink-soft">No tienes amigos aún</p>
                                    <p className="mt-1 text-xs text-ink-soft/70">Agrega amigos desde la página de amigos para crear un grupo.</p>
                                </div>
                            ) : (
                                <div className="max-h-72 overflow-y-auto rounded-xl border border-secondary/20">
                                    {amigos.map((amigo) => {
                                        const isSelected = selectedIds.includes(amigo.id)
                                        return (
                                            <div
                                                key={amigo.id}
                                                onClick={() => toggleAmigo(amigo.id)}
                                                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                                                    isSelected ? 'bg-primary/15' : 'hover:bg-secondary/5'
                                                } border-b border-secondary/10 last:border-b-0`}
                                            >
                                                {amigo.fotoPerfilUrl ? (
                                                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full">
                                                        <img src={`${API_URL}${amigo.fotoPerfilUrl}`} alt={amigo.username} loading="lazy" className="h-full w-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-xs font-black text-secondary">
                                                        {(amigo.username || '?').slice(0, 1).toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="flex-1 text-sm font-semibold text-ink">@{amigo.username}</span>
                                                <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                                                    isSelected
                                                        ? 'border-secondary bg-secondary text-text-primary'
                                                        : 'border-secondary/30'
                                                }`}>
                                                    {isSelected && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                {error}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleCreate}
                            disabled={creating || !nombre.trim() || selectedIds.length < 1}
                            className="btn-primary w-full py-3 text-sm font-bold disabled:opacity-50"
                        >
                            {creating ? 'Creando grupo...' : 'Crear grupo'}
                        </button>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default CreateGroup
