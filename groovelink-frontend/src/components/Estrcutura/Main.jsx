import React from 'react'
import EventsSection from '../Main/EventsSection'
import GroupsPanel from '../Main/GroupsPanel'
import ChatsPanel from '../Main/ChatsPanel'

function Main() {
    const featuredEvent = {
        id: 1,
        title: 'Noches de Indie en Vivo',
        image: '/assets/logo-header.png',
        date: 'SAB 24 MAY',
        time: '21:30',
        place: 'Sala Central, Madrid',
        category: 'Indie / Live Session',
        attendees: 128,
        description: 'Una noche pensada para descubrir bandas nuevas, conectar con gente y compartir el plan perfecto para el fin de semana.',
        actionLabel: 'Guardar evento',
    }

    const events = [
        {
            id: 2,
            title: 'Electro Sunset Session',
            image: '/assets/logo-header.png',
            date: 'VIE 18 ABR',
            time: '19:00',
            place: 'Rooftop Wave, Valencia',
            category: 'Electrónica',
            attendees: 84,
            description: 'Sesión al atardecer con DJs invitados y ambiente abierto para conocer gente con tu mismo plan.',
            actionLabel: 'Ver detalles',
        },
        {
            id: 3,
            title: 'Rock & Friends Night',
            image: '/assets/logo-header.png',
            date: 'DOM 27 ABR',
            time: '20:15',
            place: 'La Trastienda, Sevilla',
            category: 'Rock',
            attendees: 156,
            description: 'Concierto íntimo con zona para grupos, ideal para ir acompañado y descubrir nuevas amistades.',
            actionLabel: 'Guardar evento',
        },
        {
            id: 4,
            title: 'Urban Beats Meetup',
            image: '/assets/logo-header.png',
            date: 'SAB 03 MAY',
            time: '22:00',
            place: 'District Club, Barcelona',
            category: 'Urban / Hip hop',
            attendees: 203,
            description: 'Encuentro para fans del género con espacios para grupos y recomendaciones de asistentes.',
            actionLabel: 'Ir al evento',
        },
    ]

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
                    <EventsSection featuredEvent={featuredEvent} events={events} />

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