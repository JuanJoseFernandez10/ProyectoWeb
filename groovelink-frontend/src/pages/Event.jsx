import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { API_URL } from '../api/config'
import { AuthContext } from '../context/AuthContext'
import { getEventById, getRelatedEvents, likeEvent, unlikeEvent, joinEvent, leaveEvent, getMyJoinedEvents } from '../api/events'
import EventComments from '../components/Main/EventComments'

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
        aptitudes: Array.isArray(event.aptitudes) ? event.aptitudes : [],
        generos: Array.isArray(event.generos) ? event.generos : [],
        image: event.portada?.fotoUrl ? event.portada.fotoUrl : event.imagen?.startsWith('http') ? event.imagen : event.imagen ? `${API_URL}${event.imagen}` : '/assets/logo.png',
        portada: event.portada ?? null,
        fotos: Array.isArray(event.fotos) ? event.fotos : [],
        rutaPortada: event.rutaPortada,
        rutaFotos: event.rutaFotos,
        participantes: Array.isArray(event.participantes) ? event.participantes : [],
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
    const [joined, setJoined] = useState(false)
    const [joining, setJoining] = useState(false)
    const [joinCheckDone, setJoinCheckDone] = useState(false)
    const [participantPage, setParticipantPage] = useState(0)
    const PARTICIPANTS_PER_PAGE = 5

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

    useEffect(() => {
        if (!token) {
            return
        }

        let active = true

        async function checkJoined() {
            try {
                const unidos = await getMyJoinedEvents()
                const unidosArr = Array.isArray(unidos) ? unidos : unidos?.eventos ?? []
                const isJoined = unidosArr.some(
                    (e) => String(e.codigo ?? e.id) === String(id),
                )
                if (active) {
                    setJoined(isJoined)
                }
            } catch {
                // ignore
            } finally {
                if (active) {
                    setJoinCheckDone(true)
                }
            }
        }

        checkJoined()

        return () => {
            active = false
        }
    }, [token, id])

    const handleToggleJoin = async () => {
        if (!token) {
            navigate('/login')
            return
        }

        if (!event || joining) {
            return
        }

        setJoining(true)
        setActionError('')

        try {
            const eventId = event.id
            if (joined) {
                await leaveEvent(eventId)
                setJoined(false)
            } else {
                await joinEvent(eventId)
                setJoined(true)
            }
        } catch (requestError) {
            setActionError(requestError.message || 'No se pudo actualizar la inscripción')
        } finally {
            setJoining(false)
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
            <main className="page-surface min-h-screen overflow-x-hidden px-4 py-8 md:px-6 md:py-10">
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

                                        <EventComments eventoId={id} />

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
                                <h2 className="text-xl font-black text-ink">Participación</h2>
                                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                                    Únete al evento para acceder al chat grupal con todos los asistentes.
                                </p>
                                <div className="mt-4 flex flex-col gap-3">
                                    <button
                                        type="button"
                                        onClick={handleToggleLike}
                                        disabled={liking}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 ${
                                            event?.likedByMe
                                                ? 'bg-red-50 border-2 border-red-300 text-red-600 hover:bg-red-100'
                                                : 'btn-primary'
                                        }`}
                                        title={event?.likedByMe ? 'Quitar me gusta' : 'Me gusta'}
                                    >
                                        {liking ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                                                Procesando...
                                            </span>
                                        ) : (
                                            <>
                                                <span className="text-2xl">{event?.likedByMe ? '❤️' : '🤍'}</span>
                                                <span>{event?.likedByMe ? 'Quitar me gusta' : 'Me gusta'}</span>
                                                {event?.likes > 0 && (
                                                    <span className="ml-1 text-sm opacity-75">({event.likes})</span>
                                                )}
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleToggleJoin}
                                        disabled={joining || !token}
                                        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 ${
                                            joined
                                                ? 'bg-amber-50 border-2 border-amber-300 text-amber-700 hover:bg-amber-100'
                                                : 'btn-primary'
                                        }`}
                                    >
                                        {joining ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                                                Procesando...
                                            </span>
                                        ) : (
                                            <>
                                                <span className="text-2xl">{joined ? '🚪' : '✋'}</span>
                                                <span>{joined ? 'Salir del evento' : 'Unirse al evento'}</span>
                                            </>
                                        )}
                                    </button>
                                    {actionError ? (
                                        <p className="text-sm font-medium text-red-700">{actionError}</p>
                                    ) : null}
                                </div>
                            </section>

                            <section className="card-shell p-5">
                                <h2 className="text-xl font-black text-ink">Asistentes ({event?.participantes?.length || 0})</h2>
                                <div className="mt-4 space-y-3">
                                    {event?.participantes?.length > 0 ? (
                                        <>
                                            {event.participantes
                                                .slice(participantPage * PARTICIPANTS_PER_PAGE, (participantPage + 1) * PARTICIPANTS_PER_PAGE)
                                                .map((p) => (
                                                    <div
                                                        key={p.id}
                                                        onClick={() => navigate(`/user/${p.id}`)}
                                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/5 cursor-pointer transition-colors"
                                                    >
                                                        {p.fotoPerfilUrl ? (
                                                            <div className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 overflow-hidden rounded-full">
                                                                <img src={`${API_URL}${p.fotoPerfilUrl}`} alt={p.username} loading="lazy" className="h-full w-full object-cover" />
                                                            </div>
                                                        ) : (
                                                            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-xs font-black text-secondary">
                                                                {(p.username || '?').slice(0, 1).toUpperCase()}
                                                            </div>
                                                        )}
                                                        <span className="text-sm font-semibold text-ink">@{p.username}</span>
                                                    </div>
                                                ))}
                                            {event.participantes.length > PARTICIPANTS_PER_PAGE && (
                                                <div className="flex items-center justify-center gap-2 pt-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setParticipantPage((p) => Math.max(0, p - 1))}
                                                        disabled={participantPage === 0}
                                                        className="btn-ghost px-3 py-1 text-xs disabled:opacity-30"
                                                    >
                                                        Anterior
                                                    </button>
                                                    <span className="text-xs text-ink-soft">
                                                        {participantPage + 1} / {Math.ceil(event.participantes.length / PARTICIPANTS_PER_PAGE)}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setParticipantPage((p) => p + 1)}
                                                        disabled={(participantPage + 1) * PARTICIPANTS_PER_PAGE >= event.participantes.length}
                                                        className="btn-ghost px-3 py-1 text-xs disabled:opacity-30"
                                                    >
                                                        Siguiente
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-sm text-ink-soft">No hay asistentes aún. ¡Sé el primero!</p>
                                    )}
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