import React from 'react'
import { Link } from 'react-router-dom'

function EventCard({ event, featured = false, onLikeEvent, onUnlikeEvent, isLiking = false }) {

    return (
        <article className={`event-card min-w-0 max-w-full w-full overflow-hidden rounded-2xl border border-secondary/20 bg-text-primary/55 shadow-lg shadow-secondary/10 max-[500px]:rounded-xl max-[500px]:backdrop-blur-none sm:rounded-3xl sm:shadow-xl ${
            featured ? 'lg:grid lg:grid-cols-[220px_minmax(0,1fr)]' : ''
        }`}>
            <div className={`h-32 sm:h-44 ${featured ? 'min-h-36 max-[500px]:min-h-28 sm:min-h-50' : ''}`}>
                <div className={`relative h-full w-full overflow-hidden ${featured ? 'lg:rounded-l-3xl' : 'rounded-t-2xl max-[500px]:rounded-t-xl sm:rounded-t-3xl'}`}>
                    <img
                        src={event.image}
                        alt={event.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-ink/15 to-transparent" />
                    <div className="event-card-category absolute left-2.5 top-2.5 max-w-[calc(100%-1.25rem)] truncate rounded-full bg-text-primary/90 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-ink shadow max-[500px]:left-2 max-[500px]:top-2 max-[500px]:px-2 max-[500px]:py-0.5 max-[500px]:text-[9px] max-[500px]:tracking-[0.04em] sm:left-4 sm:top-4 sm:px-3 sm:text-xs sm:tracking-[0.16em]">
                        {event.category}
                    </div>
                    <div className="event-card-date absolute bottom-2.5 left-2.5 rounded-xl bg-ink/80 px-2.5 py-1.5 text-text-primary shadow-md backdrop-blur-sm max-[500px]:bottom-2 max-[500px]:left-2 max-[500px]:rounded-lg max-[500px]:px-2 max-[500px]:py-1 sm:bottom-4 sm:left-4 sm:rounded-2xl sm:px-3 sm:py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-primary/80 max-[500px]:text-[9px] max-[500px]:tracking-[0.08em] sm:text-xs sm:tracking-[0.18em]">Fecha</p>
                        <p className="text-sm font-black leading-none max-[500px]:text-xs sm:text-lg">{event.date}</p>
                        <p className="text-xs font-medium text-text-primary/85 max-[500px]:text-[10px]">{event.time}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2 p-3 max-[500px]:gap-1.5 max-[500px]:p-2 sm:gap-4 sm:p-5 md:p-6">
                <div className="space-y-1 max-[500px]:space-y-0.5 sm:space-y-2">
                    <div className="flex flex-wrap items-center gap-1 text-[11px] font-semibold text-ink-soft max-[500px]:text-[10px] sm:gap-2 sm:text-xs">
                        <span className="max-w-[8rem] truncate rounded-full border border-secondary/25 bg-primary/30 px-1.5 py-0.5 max-[500px]:px-1.5 max-[500px]:py-0 sm:px-3 sm:py-1">{event.place}</span>
                        <span className="rounded-full border border-secondary/25 bg-primary/30 px-1.5 py-0.5 max-[500px]:px-1.5 max-[500px]:py-0 sm:px-3 sm:py-1">{event.attendees} asistentes</span>
                        {event.organizer ? (
                            <span className="hidden sm:inline rounded-full border border-secondary/25 bg-primary/30 px-1.5 py-0.5 max-[500px]:px-1.5 max-[500px]:py-0 sm:px-3 sm:py-1">{event.organizer}</span>
                        ) : null}
                    </div>
                    <h3 className="event-card-title break-words text-lg font-black tracking-tight text-ink max-[500px]:text-base max-[500px]:leading-tight sm:text-2xl">{event.title}</h3>
                    <p className="event-card-description break-words text-[15px] leading-relaxed text-ink-soft line-clamp-2 max-[500px]:text-[12px] max-[500px]:leading-snug sm:line-clamp-3 sm:text-sm">{event.description}</p>
                </div>

                <div className="flex items-center justify-between gap-2 pt-0.5">
                    <button
                        type="button"
                        onClick={() => (event.likedByMe ? onUnlikeEvent?.(event.id) : onLikeEvent?.(event.id))}
                        disabled={isLiking}
                        className="flex items-center gap-1 text-sm font-semibold transition-all duration-200 hover:scale-110 max-[360px]:text-xs"
                        title={event.likedByMe ? 'Quitar me gusta' : 'Me gusta'}
                    >
                        <span className="text-lg leading-none max-[360px]:text-base">
                            {event.likedByMe ? '❤️' : '🤍'}
                        </span>
                        <span className="text-ink-soft">
                            {event.likes ?? 0}
                        </span>
                    </button>
                    <Link
                        to={`/event/${event.id}`}
                        className="btn-ghost px-3 py-1.5 text-sm max-[500px]:px-2.5 max-[500px]:py-1 max-[500px]:text-[12px] max-[360px]:px-2 max-[360px]:py-1 max-[360px]:text-[11px] sm:px-5 sm:py-2.5"
                    >
                        Ver mas
                    </Link>
                </div>
            </div>
        </article>
    )
}

export default React.memo(EventCard)
