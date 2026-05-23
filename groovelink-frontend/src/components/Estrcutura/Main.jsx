import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EventsSection from '../Main/EventsSection'
import GroupsPanel from '../Main/GroupsPanel'
import ChatsPanel from '../Main/ChatsPanel'
import { getHomeEvents, likeEvent, unlikeEvent, getMyJoinedEvents } from '../../api/events'
import { AuthContext } from '../../context/AuthContext'
import { API_URL } from '../../api/config'
import { useChat } from '../../hooks/useChat'

function Main() {
    const navigate = useNavigate()
    const { user, token } = useContext(AuthContext)
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
    const [joinedEvents, setJoinedEvents] = useState([])
    const [likedEventIds, setLikedEventIds] = useState(() => new Set())
    const [likingEventId, setLikingEventId] = useState(null)

    const {
        chats,
        activeChat,
        messages,
        openChat,
        closeChat,
        sendMessage,
        getActiveChatName,
        getActiveChatImage,
    } = useChat()

    useEffect(() => {
        let active = true

        async function load() {
            setLoading(true)
            setError('')

            try {
                const [data, joined] = await Promise.allSettled([
                    getHomeEvents({ page: currentPage, size: 5, recomendados: !!token }),
                    token ? getMyJoinedEvents() : Promise.resolve([]),
                ])

                if (!active) {
                    return
                }

                if (data.status === 'fulfilled') {
                    setHomeData(data.value)
                } else {
                    setError(data.reason?.message || 'No se pudieron cargar los eventos')
                }

                if (joined.status === 'fulfilled') {
                    const unidos = Array.isArray(joined.value) ? joined.value : joined.value?.eventos ?? []
                    setJoinedEvents(unidos)
                } else {
                    setJoinedEvents([])
                }
            } catch (requestError) {
                if (active) {
                    setError(requestError.message || 'No se pudieron cargar los datos')
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
    }, [currentPage, token])

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

                    <aside className="grid gap-4 max-[500px]:gap-3 md:gap-6 lg:grid-rows-[auto_auto_1fr]">
                        <GroupsPanel events={joinedEvents} />
                        <PremiumBanner />
                        <ChatsPanel
                            chats={chats}
                            activeChatId={activeChat}
                            activeChatName={getActiveChatName()}
                            activeChatImage={getActiveChatImage()}
                            messages={messages}
                            onOpenChat={openChat}
                            onCloseChat={closeChat}
                            onSendMessage={sendMessage}
                        />
                    </aside>
                </div>
            </div>
        </main>
    )
}

function PremiumBanner() {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    if (!user) return null

    const rawRole = user?.role || ''
    const normalizedRole = String(rawRole).replace(/^ROLE_/, '')
    const isPremium = user?.premium || false
    const isEmpresa = normalizedRole === 'EMPRESA'
    const isAdmin = normalizedRole === 'ADMIN'

    if (isPremium || isEmpresa || isAdmin) return null

    return (
        <div className="rounded-2xl border border-amber-300/30 bg-gradient-to-br from-amber-50 to-amber-100/20 p-4 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 mb-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-ink" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            </div>
            <h4 className="text-sm font-extrabold text-ink mb-1">Crea tus eventos</h4>
            <p className="text-xs text-ink-soft mb-3">Activa Premium gratis y organiza tus propios eventos.</p>
            <button
                type="button"
                onClick={() => navigate('/premium')}
                className="bg-gradient-to-r from-amber-400 to-amber-500 text-ink font-extrabold text-xs px-4 py-2 rounded-lg shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all"
            >
                Hazte Premium
            </button>
        </div>
    )
}

export default Main