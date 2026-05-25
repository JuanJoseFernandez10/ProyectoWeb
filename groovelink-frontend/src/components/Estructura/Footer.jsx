import React from 'react'

function Footer() {
    return (
        <footer className="mt-12 border-t border-secondary/20 bg-accent/60 text-ink">
            <div className="mx-auto max-w-7xl px-4 py-10">
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
                    <section className="space-y-4">
                        <div className="space-y-2">
                            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-ink/75">GrooveLink</p>
                            <p className="text-base font-semibold leading-relaxed text-ink">
                                Conecta con gente, eventos y planes que encajen contigo.
                            </p>
                        </div>
                        <p className="text-sm leading-relaxed text-ink-soft">
                            Una comunidad para descubrir eventos, encontrar grupos y compartir la experiencia musical.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-ink/75">Contacto</p>
                        <div className="space-y-2 text-sm leading-relaxed">
                            <p className="text-ink-soft">
                                Correo:{' '}
                                <a href="mailto:fernandez.suarez.juan.jose@gmail.com" className="font-medium text-ink-soft transition-colors hover:text-secondary hover:underline">
                                    fernandez.suarez.juan.jose@gmail.com
                                </a>
                            </p>
                            <p className="text-ink-soft">Sobre Nosotros</p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-ink/75">Redes Sociales</p>
                        <div className="flex flex-wrap gap-2">
                            <a href="https://www.linkedin.com/in/juan-jose-fernandez-suarez/" className="inline-flex items-center rounded-full border border-secondary/25 bg-text-primary/40 px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:bg-text-primary/65 hover:text-secondary">
                                LinkedIn
                            </a>
                            <a href="https://github.com/JuanJoseFernandezSuarez" className="inline-flex items-center rounded-full border border-secondary/25 bg-text-primary/40 px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:bg-text-primary/65 hover:text-secondary">
                                GitHub
                            </a>
                            <a href="https://instagram.com/groovelink" className="inline-flex items-center rounded-full border border-secondary/25 bg-text-primary/40 px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:bg-text-primary/65 hover:text-secondary">
                                Instagram
                            </a>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-ink/75">Legal</p>
                        <div className="space-y-2 text-sm leading-relaxed text-ink-soft">
                            <p>Terminos de Privacidad</p>
                            <p>Politica de Privacidad</p>
                            <p>© 2024 GrooveLink. </p>
                            <p>Todos los derechos reservados.</p>
                        </div>
                    </section>
                </div>

                <div className="my-8 h-px bg-secondary/20" />

                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-ink-soft">
                        GrooveLink · Hecho para compartir música, eventos y experiencias.
                    </p>
                    <p className="text-sm text-ink-soft">
                        Diseño limpio, legible y preparado para crecer.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer