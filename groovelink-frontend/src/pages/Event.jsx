import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import EventPhotosPanel from '../components/Main/EventPhotosPanel'
import { API_URL } from '../api/config'
import { AuthContext } from '../context/AuthContext'
import { getEventById, getRelatedEvents, likeEvent, unlikeEvent } from '../api/events'

function formatDate(value) {
    if (!value) {
        return 'Próximamente'
    }

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
        return 'Próximamente'
    }

    return new Intl.DateTimeFormat('es-ES', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
    })
        .format(date)
        .replaceAll('.', '')
        .toUpperCase()
}

function formatTime(value) {
    if (!value) {
        return 'Sin hora'
    }

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
        return 'Sin hora'
    }

    return new Intl.DateTimeFormat('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(date)
}

function mapEvent(event) {
    if (!event) {
        return null
    }

    return {
        id: event.codigo ?? event.id,
        title: event.nombre,
        description: event.descripcion,
        place: event.ubicacion,
        date: formatDate(event.fechaInicio),
        time: formatTime(event.fechaInicio),
        category: event.generos?.[0] || event.aptitudes?.[0] || 'Evento',
        attendees: event.numeroAsistentes ?? 0,
        likes: event.numeroMeGustas ?? 0,
        organizer: event.publicadoPorUsername,
        likedByMe: Boolean(event.likedByMe),
        image: event.portada?.fotoUrl ? `${API_URL}${event.portada.fotoUrl}` : event.imagen ? `${API_URL}${event.imagen}` : '/assets/logo.png',
        portada: event.portada ?? null,
        fotos: Array.isArray(event.fotos) ? event.fotos : [],
        rutaPortada: event.rutaPortada,
        rutaFotos: event.rutaFotos,
    }
}

function Event() {
    const navigate = useNavigate()
    const { token } = useContext(AuthContext)
    const { id } = useParams()
    const [event, setEvent] = useState(null)
    const [relatedEvents, setRelatedEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [relatedLoading, setRelatedLoading] = useState(true)
    const [error, setError] = useState('')
    const [relatedError, setRelatedError] = useState('')
    const [actionError, setActionError] = useState('')
    const [liking, setLiking] = useState(false)

    useEffect(() => {
        let active = true

        async function loadEvent() {
            setLoading(true)
            setRelatedLoading(true)
            setError('')
            setRelatedError('')
            setActionError('')

            try {
                const [eventData, relatedData] = await Promise.allSettled([
                    getEventById(id),
                    getRelatedEvents({ eventId: id, size: 5 }),
                ])

                if (!active) {
                    return
                }

                if (eventData.status === 'fulfilled') {
                    setEvent(mapEvent(eventData.value))
                } else {
                    setError(eventData.reason?.message || 'No se pudo cargar el evento')
                    setEvent(null)
                }

                if (relatedData.status === 'fulfilled') {
                    setRelatedEvents((relatedData.value ?? []).map(mapEvent).filter(Boolean))
                } else {
                    setRelatedError(relatedData.reason?.message || 'No se pudieron cargar eventos relacionados')
                    setRelatedEvents([])
                }
            } catch (requestError) {
                if (active) {
                    setError(requestError.message || 'No se pudo cargar el evento')
                }
            } finally {
                if (active) {
                    setLoading(false)
                    setRelatedLoading(false)
                }
            }
        }

        loadEvent()

        return () => {
            active = false
        }
    }, [id])

    const refreshEvent = async () => {
        setLoading(true)
        setError('')

        try {
            const eventData = await getEventById(id)
            setEvent(mapEvent(eventData))
        } catch (requestError) {
            setError(requestError.message || 'No se pudo recargar el evento')
        } finally {
            setLoading(false)
        }
    }

    const handleToggleLike = async () => {
        if (!token) {
            navigate('/login')
            return
        }

        if (!event || liking) {
            return
        }

        setLiking(true)
        setActionError('')

        try {
            const willLike = !event.likedByMe
            if (willLike) {
                await likeEvent(event.id)
            } else {
                await unlikeEvent(event.id)
            }

            setEvent((current) =>
                current
                    ? {
                          ...current,
                          likedByMe: willLike,
                          likes: Math.max(0, current.likes + (willLike ? 1 : -1)),
                      }
                    : current,
            )
        } catch (requestError) {
            setActionError(requestError.message || 'No se pudo actualizar el me gusta')
        } finally {
            setLiking(false)
        }
    }

    return (
        <>
            <main className="page-surface min-h-screen px-4 py-8 md:px-6 md:py-10">
                <div className="mx-auto w-full max-w-7xl">
                    <div className="mb-6 flex items-center justify-between gap-3">
                        <Link to="/home" className="btn-ghost px-4 py-2 text-sm">
                            Volver al home
                        </Link>
                        <span className="rounded-full border border-secondary/20 bg-text-primary/45 px-3 py-1 text-xs font-semibold text-ink-soft">
                            Evento #{id}
                        </span>
                    </div>

                    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.85fr)]">
                        <article className="card-shell overflow-hidden">
                            {loading ? (
                                <div className="flex min-h-90 items-center justify-center px-6 py-10 text-sm font-medium text-ink-soft">
                                    Cargando evento...
                                </div>
                            ) : error ? (
                                <div className="px-6 py-10 text-sm font-medium text-red-700">
                                    {error}
                                </div>
                            ) : event ? (
                                <>
                                    <div className="relative h-64 bg-cover bg-center sm:h-80" style={{ backgroundImage: `url(${event.image})` }}>
                                        <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/35 to-transparent" />
                                        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                                            <span className="rounded-full bg-text-primary/90 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-ink">
                                                {event.category}
                                            </span>
                                            <span className="rounded-full bg-primary/80 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-text-primary">
                                                {event.organizer || 'GrooveLink'}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-4 left-4 right-4 text-text-primary">
                                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-text-primary/80">Detalle del evento</p>
                                            <h1 className="mt-2 text-3xl font-black leading-tight sm:text-5xl">{event.title}</h1>
                                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-primary/90 sm:text-base">
                                                {event.place} · {event.date} · {event.time}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-t border-secondary/15 bg-text-primary/20 p-5 sm:p-6">
                                        <EventPhotosPanel
                                            eventId={id}
                                            portada={event.portada}
                                            fotos={event.fotos}
                                            onUploaded={refreshEvent}
                                        />
                                    </div>

                                    <div className="space-y-6 p-5 sm:p-6">
                                        <div className="grid gap-3 sm:grid-cols-3">
                                            <div className="rounded-2xl border border-secondary/20 bg-primary/20 p-4">
                                                <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink-soft">Asistentes</p>
                                                <p className="mt-1 text-2xl font-black text-ink">{event.attendees}</p>
                                            </div>
                                            <div className="rounded-2xl border border-secondary/20 bg-primary/20 p-4">
                                                <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink-soft">Me gusta</p>
                                                <p className="mt-1 text-2xl font-black text-ink">{event.likes}</p>
                                            </div>
                                            <div className="rounded-2xl border border-secondary/20 bg-primary/20 p-4">
                                                <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink-soft">Organiza</p>
                                                <p className="mt-1 text-lg font-black text-ink">{event.organizer || 'GrooveLink'}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h2 className="text-2xl font-black tracking-tight text-ink">Sobre el evento</h2>
                                            <p className="max-w-3xl text-sm leading-relaxed text-ink-soft sm:text-base">
                                                {event.description || 'Todavía no hay descripción para este evento.'}
                                            </p>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="rounded-2xl border border-secondary/20 bg-text-primary/40 p-4">
                                                <h3 className="text-lg font-black text-ink">Aptitudes</h3>
                                                <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                                                    {(event.aptitudes ?? []).length > 0 ? (
                                                        event.aptitudes.map((aptitud) => <li key={aptitud}>• {aptitud}</li>)
                                                    ) : (
                                                        <li>• Sin aptitudes cargadas todavía</li>
                                                    )}
                                                </ul>
                                            </div>
                                            <div className="rounded-2xl border border-secondary/20 bg-text-primary/40 p-4">
                                                <h3 className="text-lg font-black text-ink">Géneros</h3>
                                                <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                                                    {(event.generos ?? []).length > 0 ? (
                                                        event.generos.map((genero) => <li key={genero}>• {genero}</li>)
                                                    ) : (
                                                        <li>• Sin géneros cargados todavía</li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="px-6 py-10 text-sm font-medium text-ink-soft">
                                    No se encontró el evento.
                                </div>
                            )}
                        </article>

                        <aside className="space-y-6">
                            <section className="card-shell p-5">
                                <h2 className="text-xl font-black text-ink">Reserva / interés</h2>
                                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                                    Esto luego irá conectado al backend para apuntarse, guardar me gusta y cargar el detalle real.
                                </p>
                                <div className="mt-4 flex flex-col gap-3">
                                    <button
                                        type="button"
                                        className="btn-primary w-full px-4 py-2.5 text-sm"
                                        onClick={handleToggleLike}
                                        disabled={liking}
                                    >
                                        {liking
                                            ? 'Procesando...'
                                            : event?.likedByMe
                                                ? 'Quitar me gusta'
                                                : 'Me interesa'}
                                    </button>
                                    <button type="button" className="btn-ghost w-full px-4 py-2.5 text-sm">
                                        Compartir evento
                                    </button>
                                    {actionError ? (
                                        <p className="text-sm font-medium text-red-700">{actionError}</p>
                                    ) : null}
                                </div>
                            </section>

                            <section className="card-shell p-5">
                                <h2 className="text-xl font-black text-ink">Eventos relacionados</h2>
                                {relatedLoading ? (
                                    <p className="mt-3 text-sm text-ink-soft">Cargando relacionados...</p>
                                ) : relatedError ? (
                                    <p className="mt-3 text-sm text-red-700">{relatedError}</p>
                                ) : relatedEvents.length > 0 ? (
                                    <div className="mt-4 overflow-x-auto pb-2">
                                        <div className="flex gap-3 min-w-max">
                                            {relatedEvents.map((relatedEvent) => (
                                                <Link
                                                    key={relatedEvent.id}
                                                    to={`/event/${relatedEvent.id}`}
                                                    className="w-56 shrink-0 rounded-2xl border border-secondary/20 bg-text-primary/40 p-4 transition-colors hover:bg-text-primary/60"
                                                >
                                                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-secondary">Relacionado</p>
                                                    <h3 className="mt-1 text-base font-black text-ink">{relatedEvent.title}</h3>
                                                    <p className="mt-1 text-sm text-ink-soft">{relatedEvent.place}</p>
                                                    <p className="mt-1 text-xs text-ink-soft">{relatedEvent.date}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="mt-3 text-sm text-ink-soft">No hay eventos relacionados por ahora.</p>
                                )}
                            </section>
                        </aside>
                    </section>
                </div>
            </main>
        </>
    )
}

export default Event