import React, { useContext, useEffect, useState, useMemo } from 'react'
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
        eventos: [],
        total: 0,
        page: 0,
        size: 6,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
    })
    const [currentPage, setCurrentPage] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [likedEventIds, setLikedEventIds] = useState(() => new Set())
    const [likingEventId, setLikingEventId] = useState(null)

    useEffect(() => {
        setCurrentPage(0)
    }, [searchQuery])

    useEffect(() => {
        let active = true

        async function load() {
            setLoading(true)
            setError('')

            try {
                const data = searchQuery
                    ? await searchEvents({ q: searchQuery, page: currentPage, size: 6 })
                    : await getHomeEvents({ page: currentPage, size: 6 })
                if (active) {
                    setHomeData(data)
                }
            } catch (requestError) {
                if (active) {
                    setError(requestError.message || 'No se pudieron cargar los eventos')
                }
            } finally {
                if (active) {
                    setLoading(false)
                }
            }
        }

        load()

        return () => {
            active = false
        }
    }, [currentPage, searchQuery])

    useEffect(() => {
        if (homeData.eventos.length > 0) {
            setLikedEventIds((current) => {
                const next = new Set(current)
                homeData.eventos.forEach(event => {
                    if (event.likedByMe) {
                        next.add(event.codigo)
                    }
                })
                return next
            })
        }
    }, [homeData])

    const formatEventDate = (value) => {
        if (!value) return 'Próximamente'
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) return 'Próximamente'
        return new Intl.DateTimeFormat('es-ES', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
        }).format(date).replaceAll('.', '').toUpperCase()
    }

    const formatEventTime = (value) => {
        if (!value) return 'Sin hora'
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) return 'Sin hora'
        return new Intl.DateTimeFormat('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
        }).format(date)
    }

    const mapEvent = (event) => ({
        id: event.codigo,
        title: event.nombre,
        image: event.imagen ? `${API_URL}${event.imagen}` : '/assets/logo-header.png',
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
        if (!token) {
            navigate('/login')
            return
        }
        if (likedEventIds.has(eventId) || likingEventId === eventId) {
            return
        }
        setLikingEventId(eventId)
        setError('')
        try {
            await likeEvent(eventId)
            setLikedEventIds((current) => {
                const next = new Set(current)
                next.add(eventId)
                return next
            })
            setHomeData((current) => ({
                ...current,
                eventos: current.eventos.map((ev) =>
                    ev.codigo === eventId
                        ? { ...ev, numeroMeGustas: (ev.numeroMeGustas ?? 0) + 1, likedByMe: true }
                        : ev,
                ),
            }))
        } catch (requestError) {
            setError(requestError.message || 'No se pudo guardar el me gusta')
        } finally {
            setLikingEventId(null)
        }
    }

    const handleUnlikeEvent = async (eventId) => {
        if (!token) {
            navigate('/login')
            return
        }
        if (!likedEventIds.has(eventId) || likingEventId === eventId) {
            return
        }
        setLikingEventId(eventId)
        setError('')
        try {
            await unlikeEvent(eventId)
            setLikedEventIds((current) => {
                const next = new Set(current)
                next.delete(eventId)
                return next
            })
            setHomeData((current) => ({
                ...current,
                eventos: current.eventos.map((ev) =>
                    ev.codigo === eventId
                        ? { ...ev, numeroMeGustas: Math.max(0, (ev.numeroMeGustas ?? 0) - 1), likedByMe: false }
                        : ev,
                ),
            }))
        } catch (requestError) {
            setError(requestError.message || 'No se pudo quitar el me gusta')
        } finally {
            setLikingEventId(null)
        }
    }

    const isSearch = !!searchQuery

    return (
        <main className="page-surface min-h-screen py-5 sm:py-7 md:py-10">
            <div className="mx-auto w-full max-w-5xl px-3 sm:px-4">
                {isSearch && (
                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={() => navigate('/events')}
                            className="btn-ghost px-4 py-2 text-sm"
                        >
                            ← Ver todos los eventos
                        </button>
                    </div>
                )}
                <EventsSection
                    featuredEvent={isSearch ? null : featuredEvent}
                    events={events}
                    totalEvents={homeData.total}
                    title={isSearch ? `Resultados para "${searchQuery}"` : undefined}
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