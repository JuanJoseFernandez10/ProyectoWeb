import React, { useMemo, useRef, useState } from 'react'
import { API_URL } from '../../api/config'
import { uploadEventCover, uploadEventPhotos } from '../../api/eventPhotos'

function EventPhotosPanel({ eventId, portada, fotos = [], onUploaded, canManage = false }) {
    const [coverFile, setCoverFile] = useState(null)
    const [otherFiles, setOtherFiles] = useState([])
    const [coverLoading, setCoverLoading] = useState(false)
    const [otherLoading, setOtherLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const coverInputRef = useRef(null)
    const otherInputRef = useRef(null)

    const sortedFotos = useMemo(() => fotos.filter(Boolean), [fotos])

    const resetInputs = () => {
        setCoverFile(null)
        setOtherFiles([])
        if (coverInputRef.current) {
            coverInputRef.current.value = ''
        }
        if (otherInputRef.current) {
            otherInputRef.current.value = ''
        }
    }

    const handleCoverSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setMessage('')

        if (!coverFile) {
            setError('Selecciona una portada')
            return
        }

        setCoverLoading(true)
        try {
            await uploadEventCover(eventId, coverFile)
            setMessage('Portada subida correctamente')
            resetInputs()
            await onUploaded?.()
        } catch (requestError) {
            setError(requestError.message || 'No se pudo subir la portada')
        } finally {
            setCoverLoading(false)
        }
    }

    const handlePhotosSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setMessage('')

        if (!otherFiles.length) {
            setError('Selecciona al menos una foto')
            return
        }

        if (otherFiles.length > 5) {
            setError('Sube como máximo 5 fotos a la vez')
            return
        }

        setOtherLoading(true)
        try {
            await uploadEventPhotos(eventId, otherFiles)
            setMessage('Fotos subidas correctamente')
            resetInputs()
            await onUploaded?.()
        } catch (requestError) {
            setError(requestError.message || 'No se pudieron subir las fotos')
        } finally {
            setOtherLoading(false)
        }
    }

    if (!eventId) {
        return null
    }

    return (
        <section className="card-shell p-5 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-ink">Fotos del evento</h2>
                    <p className="mt-1 text-sm text-ink-soft">
                        Aquí sale la portada y el resto de fotos del evento.
                    </p>
                </div>
                {canManage ? (
                    <div className="rounded-full border border-secondary/20 bg-primary/20 px-3 py-1 text-xs font-semibold text-ink-soft">
                        Carpeta automática: nombreEvento_id
                    </div>
                ) : null}
            </div>

            {portada?.fotoUrl ? (
                <div className="mt-5 overflow-hidden rounded-3xl border border-secondary/20 bg-ink shadow-lg shadow-secondary/10">
                    <div className="relative aspect-video min-h-56">
                        <img
                            src={`${API_URL}${portada.fotoUrl}`}
                            alt={portada.nombreFoto || 'Portada del evento'}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-text-primary">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-primary/75">Portada</p>
                            <h3 className="mt-1 text-2xl font-black">{portada.nombreFoto || 'portada'}</h3>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-5 rounded-3xl border border-dashed border-secondary/30 bg-text-primary/35 px-4 py-8 text-center text-sm text-ink-soft">
                    Aún no hay portada subida.
                </div>
            )}

            {sortedFotos.length > 0 ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {sortedFotos.map((foto) => (
                        <article key={foto.id} className="overflow-hidden rounded-2xl border border-secondary/20 bg-text-primary/40 shadow-sm">
                            <div className="aspect-4/3 bg-primary/10">
                                {foto.fotoUrl ? (
                                    <img
                                        src={`${API_URL}${foto.fotoUrl}`}
                                        alt={foto.nombreFoto || 'Foto del evento'}
                                        className="h-full w-full object-cover"
                                    />
                                ) : null}
                            </div>
                            <div className="flex items-center justify-between gap-2 px-4 py-3">
                                <span className="text-sm font-bold text-ink">{foto.nombreFoto || 'foto'}</span>
                                {foto.esPortada ? (
                                    <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-text-primary">
                                        Portada
                                    </span>
                                ) : null}
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <p className="mt-5 text-sm text-ink-soft">No hay más fotos todavía.</p>
            )}

            {canManage ? (
                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    <form onSubmit={handleCoverSubmit} className="rounded-3xl border border-secondary/20 bg-primary/15 p-4 sm:p-5">
                        <h3 className="text-lg font-black text-ink">Subir portada</h3>
                        <p className="mt-1 text-sm text-ink-soft">Una sola imagen para la portada del evento.</p>
                        <input
                            ref={coverInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(event) => setCoverFile(event.target.files?.[0] || null)}
                            className="mt-4 block w-full text-sm text-ink-soft file:mr-4 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-bold file:text-text-primary hover:file:bg-secondary/90"
                        />
                        <button
                            type="submit"
                            disabled={coverLoading}
                            className="btn-primary mt-4 w-full px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {coverLoading ? 'Subiendo portada...' : 'Subir portada'}
                        </button>
                    </form>

                    <form onSubmit={handlePhotosSubmit} className="rounded-3xl border border-secondary/20 bg-primary/15 p-4 sm:p-5">
                        <h3 className="text-lg font-black text-ink">Subir fotos</h3>
                        <p className="mt-1 text-sm text-ink-soft">Selecciona entre 1 y 5 fotos normales para subirlas juntas.</p>
                        <input
                            ref={otherInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(event) => setOtherFiles(Array.from(event.target.files || []))}
                            className="mt-4 block w-full text-sm text-ink-soft file:mr-4 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-bold file:text-text-primary hover:file:bg-secondary/90"
                        />
                        <button
                            type="submit"
                            disabled={otherLoading}
                            className="btn-primary mt-4 w-full px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {otherLoading ? 'Subiendo fotos...' : 'Subir fotos'}
                        </button>
                    </form>
                </div>
            ) : null}

            {message ? <p className="mt-4 text-sm font-semibold text-emerald-700">{message}</p> : null}
            {error ? <p className="mt-2 text-sm font-semibold text-red-700">{error}</p> : null}
        </section>
    )
}

export default EventPhotosPanel
