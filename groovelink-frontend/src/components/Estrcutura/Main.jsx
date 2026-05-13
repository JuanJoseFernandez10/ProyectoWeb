import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EventsSection from '../Main/EventsSection'
import GroupsPanel from '../Main/GroupsPanel'
import ChatsPanel from '../Main/ChatsPanel'
import { getHomeEvents, likeEvent, unlikeEvent } from '../../api/events'
import { AuthContext } from '../../context/AuthContext'

function Main() {
    const navigate = useNavigate()
    const { token } = useContext(AuthContext)
    const [homeData, setHomeData] = useState({
        eventos: [],
        total: 0,
        page: 0,
        size: 5,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
    })
    const [currentPage, setCurrentPage] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [refreshTick, setRefreshTick] = useState(0)
    const [likedEventIds, setLikedEventIds] = useState(() => new Set())
    const [likingEventId, setLikingEventId] = useState(null)

    useEffect(() => {
        let active = true

        async function loadEvents() {
            setLoading(true)
            setError('')

            try {
                const data = await getHomeEvents({ page: currentPage, size: 5 })
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

        loadEvents()

        return () => {
            active = false
        }
    }, [currentPage, refreshTick])

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
        }).format(date).replaceAll('.', '').toUpperCase()
    }

    const formatEventTime = (value) => {
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

    const mapEvent = (event) => ({
        id: event.codigo,
        title: event.nombre,
        image: '/assets/logo-header.png',
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
        } catch (requestError) {
            setError(requestError.message || 'No se pudo quitar el me gusta')
        } finally {
            setLikingEventId(null)
        }
    }

    const groups = [
        {
            id: 1,
            name: 'Grupo Indie Madrid',
            members: 24,
            nextEvent: 'Próximo evento mañana',
            status: 'Activo',
        },
        {
            id: 2,
            name: 'Fans Electrónica',
            members: 18,
            nextEvent: 'Nueva quedada este viernes',
            status: 'Buscando gente',
        },
    ]

    const chats = [
        {
            id: 1,
            name: 'Laura',
            message: '¿Te apuntas al evento del sábado?',
            time: '2 min',
            online: true,
        },
        {
            id: 2,
            name: 'Carlos',
            message: 'He encontrado dos entradas para el concierto.',
            time: '18 min',
            online: false,
        },
    ]

    return (
        <main className="page-surface min-h-screen py-5 max-[500px]:py-3 sm:py-7 md:py-10">
            <div className="mx-auto w-full max-w-7xl px-3 max-[500px]:px-2 sm:px-4">
                <div className="grid gap-4 max-[500px]:gap-3 md:gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
                    <EventsSection
                        featuredEvent={featuredEvent}
                        events={gridEvents}
                        totalEvents={homeData.total}
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

                    <aside className="grid gap-4 max-[500px]:gap-3 md:gap-6 lg:grid-rows-2">
                        <GroupsPanel groups={groups} />
                        <ChatsPanel chats={chats} />
                    </aside>
                </div>
            </div>
        </main>
    )
}

export default Main