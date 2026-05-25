import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { API_URL } from '../api/config'
import { getHomeEvents, searchEvents, likeEvent, unlikeEvent } from '../api/events'
import EventsSection from '../components/Main/EventsSection'

function EventsList() {
    const navigate = useNavigate()
    const { token } = useContext(AuthContext)
    const [searchParams] = useSearchParams()
    const searchQuery = searchParams.get('q') || ''

    const [homeData, setHomeData] = useState({
        eventos: [], total: 0, page: 0, size: 6, totalPages: 0, hasNext: false, hasPrevious: false,
    })
    const [currentPage, setCurrentPage] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [likedEventIds, setLikedEventIds] = useState(() => new Set())
    const [likingEventId, setLikingEventId] = useState(null)

    const [generos, setGeneros] = useState([])
    const [aptitudes, setAptitudes] = useState([])
    const [filtroGenero, setFiltroGenero] = useState('')
    const [filtroAptitud, setFiltroAptitud] = useState('')
    const [filtroUbicacion, setFiltroUbicacion] = useState('')

    useEffect(() => {
        fetch(`${API_URL}/generos`).then(r => r.ok ? r.json() : []).then(setGeneros).catch(() => {})
        fetch(`${API_URL}/aptitudes`).then(r => r.ok ? r.json() : []).then(setAptitudes).catch(() => {})
    }, [])

    const filtersActive = filtroGenero || filtroAptitud || filtroUbicacion

    useEffect(() => {
        setCurrentPage(0)
    }, [searchQuery, filtroGenero, filtroAptitud, filtroUbicacion])

    useEffect(() => {
        let active = true
        async function load() {
            setLoading(true)
            setError('')
            try {
                const data = searchQuery
                    ? await searchEvents({ q: searchQuery, page: currentPage, size: 6 })
                    : await getHomeEvents({
                        page: currentPage, size: 6,
                        generoId: filtroGenero || undefined,
                        aptitudId: filtroAptitud || undefined,
                        ubicacion: filtroUbicacion || undefined,
                      })
                if (active) setHomeData(data)
            } catch (requestError) {
                if (active) setError(requestError.message || 'No se pudieron cargar los eventos')
            } finally {
                if (active) setLoading(false)
            }
        }
        load()
        return () => { active = false }
    }, [currentPage, searchQuery, filtroGenero, filtroAptitud, filtroUbicacion])

    useEffect(() => {
        if (homeData.eventos.length > 0) {
            setLikedEventIds((current) => {
                const next = new Set(current)
                homeData.eventos.forEach(event => { if (event.likedByMe) next.add(event.codigo) })
                return next
            })
        }
    }, [homeData])

    const formatEventDate = (value) => {
        if (!value) return 'Próximamente'
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) return 'Próximamente'
        return new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: '2-digit', month: 'short' })
            .format(date).replaceAll('.', '').toUpperCase()
    }

    const formatEventTime = (value) => {
        if (!value) return 'Sin hora'
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) return 'Sin hora'
        return new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(date)
    }

    const mapEvent = (event) => ({
        id: event.codigo,
        title: event.nombre,
        image: event.portada?.fotoUrl ? event.portada.fotoUrl : event.imagen ? `${API_URL}${event.imagen}` : '/assets/logo-header.png',
        date: formatEventDate(event.fechaInicio),
        time: formatEventTime(event.fechaInicio),
        place: event.ubicacion,
        category: event.generos?.[0] || event.aptitudes?.[0] || 'Evento',
        attendees: event.numeroAsistentes ?? 0,
        likes: event.numeroMeGustas ?? 0,
        description: event.descripcion,
        actionLabel: 'Ver detalles',
        organizer: event.publicadoPorUsername,
    })

    const events = homeData.eventos.map((event) => ({
        ...mapEvent(event),
        likedByMe: likedEventIds.has(event.codigo),
    }))
    const featuredEvent = events[0] ?? null
    const gridEvents = events.slice(1)

    const handleLikeEvent = async (eventId) => {
        if (!token) { navigate('/login'); return }
        if (likedEventIds.has(eventId) || likingEventId === eventId) return
        setLikingEventId(eventId)
        setError('')
        try {
            await likeEvent(eventId)
            setLikedEventIds((current) => { const next = new Set(current); next.add(eventId); return next })
            setHomeData((current) => ({
                ...current,
                eventos: current.eventos.map((ev) =>
                    ev.codigo === eventId ? { ...ev, numeroMeGustas: (ev.numeroMeGustas ?? 0) + 1, likedByMe: true } : ev
                ),
            }))
        } catch (requestError) { setError(requestError.message || 'No se pudo guardar el me gusta')
        } finally { setLikingEventId(null) }
    }

    const handleUnlikeEvent = async (eventId) => {
        if (!token) { navigate('/login'); return }
        if (!likedEventIds.has(eventId) || likingEventId === eventId) return
        setLikingEventId(eventId)
        setError('')
        try {
            await unlikeEvent(eventId)
            setLikedEventIds((current) => { const next = new Set(current); next.delete(eventId); return next })
            setHomeData((current) => ({
                ...current,
                eventos: current.eventos.map((ev) =>
                    ev.codigo === eventId ? { ...ev, numeroMeGustas: Math.max(0, (ev.numeroMeGustas ?? 0) - 1), likedByMe: false } : ev
                ),
            }))
        } catch (requestError) { setError(requestError.message || 'No se pudo quitar el me gusta')
        } finally { setLikingEventId(null) }
    }

    const limpiarFiltros = () => {
        setFiltroGenero('')
        setFiltroAptitud('')
        setFiltroUbicacion('')
    }

    const isSearch = !!searchQuery
    const pageTitle = isSearch ? `Resultados para "${searchQuery}"`
        : filtersActive ? 'Eventos filtrados' : undefined

    return (
        <main className="page-surface min-h-screen py-5 max-[500px]:py-3 max-[360px]:py-2 sm:py-7 md:py-10">
            <div className="mx-auto w-full max-w-5xl px-3 max-[500px]:px-2 max-[360px]:px-1.5 sm:px-4">
                {isSearch && (
                    <div className="mb-4">
                        <button type="button" onClick={() => navigate('/events')} className="btn-ghost px-4 py-2 text-sm">
                            ← Ver todos los eventos
                        </button>
                    </div>
                )}

                {!isSearch && (
                    <div className="mb-4 flex flex-col md:flex-row md:flex-wrap md:items-end gap-3 rounded-2xl border border-secondary/20 bg-text-primary/50 p-4">
                        <div className="flex flex-col gap-1 w-full md:w-auto">
                            <label className="text-xs font-semibold text-ink-soft">Género</label>
                            <select
                                value={filtroGenero}
                                onChange={(e) => setFiltroGenero(e.target.value)}
                                className="rounded-xl border border-secondary/25 bg-text-primary px-3 py-2 text-sm text-ink outline-none focus:border-secondary w-full md:w-auto"
                            >
                                <option value="">Todos</option>
                                {generos.map((g) => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1 w-full md:w-auto">
                            <label className="text-xs font-semibold text-ink-soft">Aptitud</label>
                            <select
                                value={filtroAptitud}
                                onChange={(e) => setFiltroAptitud(e.target.value)}
                                className="rounded-xl border border-secondary/25 bg-text-primary px-3 py-2 text-sm text-ink outline-none focus:border-secondary w-full md:w-auto"
                            >
                                <option value="">Todas</option>
                                {aptitudes.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1 w-full md:w-auto">
                            <label className="text-xs font-semibold text-ink-soft">Ubicación</label>
                            <input
                                type="text"
                                value={filtroUbicacion}
                                onChange={(e) => setFiltroUbicacion(e.target.value)}
                                placeholder="Ciudad..."
                                className="rounded-xl border border-secondary/25 bg-text-primary px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus:border-secondary w-full md:w-48"
                            />
                        </div>
                        {filtersActive && (
                            <button type="button" onClick={limpiarFiltros}
                                className="btn-ghost px-4 py-2 text-sm">
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                )}

                <EventsSection
                    featuredEvent={isSearch ? null : featuredEvent}
                    events={events}
                    totalEvents={homeData.total}
                    title={pageTitle}
                    pagination={{
                        page: homeData.page,
                        totalPages: homeData.totalPages,
                        hasNext: homeData.hasNext,
                        hasPrevious: homeData.hasPrevious,
                    }}
                    loading={loading}
                    error={error}
                    onNextPage={() => setCurrentPage((value) => value + 1)}
                    onPreviousPage={() => setCurrentPage((value) => Math.max(value - 1, 0))}
                    onLikeEvent={handleLikeEvent}
                    onUnlikeEvent={handleUnlikeEvent}
                    likingEventId={likingEventId}
                />
            </div>
        </main>
    )
}

export default EventsList
