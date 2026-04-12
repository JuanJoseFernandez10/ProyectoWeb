import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Index() {
    const [introVisible, setIntroVisible] = useState(false)

    useEffect(() => {
        const frame = requestAnimationFrame(() => setIntroVisible(true))
        return () => cancelAnimationFrame(frame)
    }, [])

    const introClass = (delayClass = '') =>
        `transition-all duration-700 ease-out will-change-transform ${delayClass} ${
            introVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`

    return (
        <div className="page-surface min-h-screen px-4 py-10 md:py-14">
            <section className="mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <div className={`card-shell p-6 md:p-10 ${introClass()}`}>
                    <div className={`inline-flex items-center rounded-full border border-secondary/25 bg-primary/30 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-ink-soft ${introClass('delay-100')}`}>
                        Plataforma social musical
                    </div>

                    <h1 className={`mt-5 text-4xl font-black leading-tight text-ink md:text-6xl ${introClass('delay-150')}`}>
                        Encuentra tu siguiente plan con gente que vibra como tu.
                    </h1>

                    <div className={`mt-6 space-y-3 text-base leading-relaxed text-ink-soft md:text-lg ${introClass('delay-200')}`}>
                        <p>
                            Descubre eventos recomendados, conecta con grupos activos y organiza salidas de forma sencilla desde un solo lugar.
                        </p>
                        <p>
                            Si no tienes con quien ir a un concierto, aqui puedes conocer personas con tus mismos gustos.
                        </p>
                    </div>

                    <div className={`mt-8 flex flex-col gap-3 sm:flex-row ${introClass('delay-300')}`}>
                        <Link to="/login" className="btn-primary">
                            Crear cuenta o entrar
                        </Link>
                        <Link to="/home" className="btn-ghost">
                            Explorar la web
                        </Link>
                    </div>

                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                        <article className={`rounded-2xl border border-secondary/20 bg-text-primary/45 p-4 ${introClass('delay-300')}`}>
                            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-ink-soft">Eventos</p>
                            <p className="mt-1 text-sm text-ink">Recomendaciones para ti</p>
                        </article>
                        <article className={`rounded-2xl border border-secondary/20 bg-text-primary/45 p-4 ${introClass('delay-500')}`}>
                            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-ink-soft">Grupos</p>
                            <p className="mt-1 text-sm text-ink">Planes con gente afín</p>
                        </article>
                        <article className={`rounded-2xl border border-secondary/20 bg-text-primary/45 p-4 ${introClass('delay-700')}`}>
                            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-ink-soft">Chats</p>
                            <p className="mt-1 text-sm text-ink">Habla antes de quedar</p>
                        </article>
                    </div>
                </div>

                <div className={`card-shell p-5 md:p-7 ${introClass('delay-200')}`}>
                    <div className="overflow-hidden rounded-2xl border border-secondary/25 bg-background/70">
                        <img src="/assets/logo.png" alt="Logo de GrooveLink" className="h-full w-full object-cover" />
                    </div>

                    <div className="mt-5 rounded-2xl border border-secondary/20 bg-primary/20 p-4">
                        <p className="text-sm font-bold text-ink">Empieza en menos de 1 minuto</p>
                        <p className="mt-1 text-sm text-ink-soft">
                            Crea tu perfil, elige tus gustos musicales y recibe eventos pensados para ti.
                        </p>
                    </div>
                </div>
            </section>

            <div className={`mx-auto mt-6 w-full max-w-7xl text-center ${introClass('delay-500')}`}>
                <p className="text-sm text-ink-soft">GrooveLink te ayuda a pasar de "quiero ir" a "ya tengo plan".</p>
            </div>
        </div>
    )
}