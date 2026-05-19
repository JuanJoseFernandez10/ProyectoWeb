import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../api/config'
import { getAuthToken } from '../api/authSession'
import { AuthContext } from '../context/AuthContext'
import { getMyJoinedEvents } from '../api/events'
import EventCarousel from '../components/EventCarousel'

function formatDate(value) {
    if (!value) return 'Próximamente'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'Próximamente'
    return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

function MisEventos() {
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    const [eventos, setEventos] = useState([])
    const [eventosUnidos, setEventosUnidos] = useState([])
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const rawRole = user?.role || ''
    const normalizedRole = String(rawRole).replace(/^ROLE_/, '')
    const isPremium = profile?.premium || false
    const isEmpresa = normalizedRole === 'EMPRESA'
    const isAdmin = normalizedRole === 'ADMIN'

    const canAccessFullFeatures = isEmpresa || isAdmin || isPremium
    const canCreateEvent = canAccessFullFeatures

    const renderEventCard = (evento, showEdit = false) => {
        const eventId = evento.codigo ?? evento.id
        return (
            <article key={eventId} className="overflow-hidden rounded-3xl border border-secondary/20 bg-background/80 shadow-sm">
                <div className="h-40 bg-gradient-to-br from-primary/35 via-secondary/25 to-background/80 flex items-end p-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">{formatDate(evento.fechaInicio)}</p>
                        <h2 className="mt-1 text-2xl font-black text-ink">{evento.nombre}</h2>
                    </div>
                </div>
                <div className="p-4">
                    <p className="text-sm text-ink-soft">{evento.ubicacion}</p>
                    <p className="mt-2 text-sm text-ink-soft">{evento.descripcion || 'Sin descripción'}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <button
                            type="button"
                            className="btn-primary px-4 py-2 text-sm"
                            onClick={() => navigate(`/event/${eventId}`)}
                        >
                            Ver
                        </button>
                        {showEdit && (
                            <button
                                type="button"
                                className="btn-ghost px-4 py-2 text-sm"
                                onClick={() => navigate(`/event/${eventId}/edit`)}
                            >
                                Editar
                            </button>
                        )}
                        {!showEdit && (
                            <button
                                type="button"
                                className="btn-ghost px-4 py-2 text-sm"
                                onClick={() => navigate(`/groups`)}
                            >
                                Chat grupal
                            </button>
                        )}
                    </div>
                </div>
            </article>
        )
    }

    const getApiErrorMessage = async (response, fallbackMessage) => {
        if (response.status === 401) {
            return 'Tu sesion ha caducado. Vuelve a iniciar sesion.'
        }
        if (response.status === 403) {
            return 'No tienes permisos para realizar esta accion.'
        }

        try {
            const data = await response.json()
            return data?.message || data?.fieldMessage || fallbackMessage
        } catch {
            return fallbackMessage
        }
    }

    useEffect(() => {
        let active = true

        async function cargar() {
            setLoading(true)
            setError('')

            try {
                const token = getAuthToken()
                if (!token) {
                    navigate('/login')
                    return
                }

                // Fetch profile to get premium status
                const profilePromise = fetch(`${API_URL}/usuarios/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                }).then(res => res.ok ? res.json() : null)

                // Fetch created events
                const eventsPromise = fetch(`${API_URL}/eventos/mis-eventos`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                })

                const [profileData, eventsResponse, joinedData] = await Promise.all([
                    profilePromise,
                    eventsPromise,
                    getMyJoinedEvents().catch(() => []),
                ])

                if (!eventsResponse.ok) {
                    const message = await getApiErrorMessage(eventsResponse, 'No se pudieron cargar tus eventos')
                    if (eventsResponse.status === 401) {
                        navigate('/login')
                    }
                    throw new Error(message)
                }

                const eventsData = await eventsResponse.json()
                if (active) {
                    setProfile(profileData)
                    setEventos(Array.isArray(eventsData) ? eventsData : [])
                    setEventosUnidos(Array.isArray(joinedData) ? joinedData : [])
                }
            } catch (requestError) {
                if (active) {
                    setError(requestError.message || 'No se pudieron cargar tus eventos')
                }
            } finally {
                if (active) {
                    setLoading(false)
                }
            }
        }

        cargar()

        return () => {
            active = false
        }
    }, [])

    return (
        <main className="page-surface min-h-screen px-4 py-8 md:px-6 md:py-10">
            <div className="mx-auto w-full max-w-7xl">
                <div className="mb-6 flex items-center justify-between gap-3">
                    <button type="button" className="btn-ghost px-4 py-2 text-sm" onClick={() => navigate('/home')}>
                        Volver al home
                    </button>
                    {canCreateEvent && (
                        <button type="button" className="btn-primary px-4 py-2 text-sm" onClick={() => navigate('/event/new')}>
                            Crear evento
                        </button>
                    )}
                </div>

                <section className="card-shell overflow-hidden p-5 md:p-7">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Tus eventos</p>
                            <h1 className="mt-2 text-3xl font-black text-ink">Mis Eventos</h1>
                        </div>
                        {canAccessFullFeatures && (
                            <span className="rounded-full border border-secondary/20 bg-text-primary/45 px-3 py-1 text-xs font-semibold text-ink-soft">
                                {eventos.length} eventos
                            </span>
                        )}
                    </div>

                    {error ? (
                        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                            {error}
                        </div>
                    ) : null}

                    {loading ? (
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="h-48 animate-pulse rounded-3xl bg-background/70" />
                            ))}
                        </div>
                    ) : canAccessFullFeatures ? (
                        <>
                            {/* Sección: Creados por ti */}
                            <div className="mt-8">
                                <h2 className="mb-4 text-xl font-bold text-ink">Creados por ti</h2>
                                {eventos.length === 0 ? (
                                    <div className="rounded-3xl border border-dashed border-secondary/30 bg-background/60 p-8 text-center">
                                        <p className="text-lg font-bold text-ink">Todavía no has creado eventos</p>
                                        <p className="mt-2 text-sm text-ink-soft">Crea el primero y aparecerá aquí con opciones de editar y eliminar.</p>
                                    </div>
                                ) : (
                                    <EventCarousel
                                        eventos={eventos}
                                        itemsPerPage={3}
                                        renderCard={(evento) => renderEventCard(evento, true)}
                                    />
                                )}
                            </div>

                            {/* Sección: A los que te has unido */}
                            <div className="mt-10">
                                <h2 className="mb-4 text-xl font-bold text-ink">A los que te has unido ({eventosUnidos.length})</h2>
                                {eventosUnidos.length === 0 ? (
                                    <div className="rounded-3xl border border-dashed border-secondary/30 bg-background/60 p-8 text-center">
                                        <p className="text-lg font-bold text-ink">Todavía no te has unido a ningún evento</p>
                                        <p className="mt-2 text-sm text-ink-soft">Explora eventos en el inicio y únete a ellos.</p>
                                    </div>
                                ) : (
                                    <EventCarousel
                                        eventos={eventosUnidos}
                                        itemsPerPage={3}
                                        renderCard={(evento) => renderEventCard(evento, false)}
                                    />
                                )}
                            </div>
                        </>
                    ) : (
                        /* No premium: igualmente muestra los unidos */
                        <>
                            <div className="mt-6">
                                <h2 className="mb-4 text-xl font-bold text-ink">A los que te has unido ({eventosUnidos.length})</h2>
                                {eventosUnidos.length === 0 ? (
                                    <div className="rounded-3xl border border-dashed border-secondary/30 bg-background/60 p-8 text-center">
                                        <p className="text-lg font-bold text-ink">Todavía no te has unido a ningún evento</p>
                                        <p className="mt-2 text-sm text-ink-soft">Explora eventos en el inicio y únete a ellos.</p>
                                    </div>
                                ) : (
                                    <EventCarousel
                                        eventos={eventosUnidos}
                                        itemsPerPage={3}
                                        renderCard={(evento) => renderEventCard(evento, false)}
                                    />
                                )}
                            </div>
                        </>
                    )}
                </section>
            </div>
        </main>
    )
}

export default MisEventos
