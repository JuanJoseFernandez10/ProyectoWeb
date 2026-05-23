import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { adminFetchReporte, adminResolverReporte } from '../api/admin'

export default function AdminReportDetail() {
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()
    const { id } = useParams()

    const [reporte, setReporte] = useState(null)
    const [loading, setLoading] = useState(true)
    const [msg, setMsg] = useState('')

    useEffect(() => {
        if (!user || user.role !== 'ROLE_ADMIN') { navigate('/groove-admin/login'); return }
        cargar()
    }, [id])

    const cargar = async () => {
        setLoading(true)
        try {
            const data = await adminFetchReporte(id)
            setReporte(data)
        } catch (err) {
            setMsg(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleResolver = async (estado) => {
        try {
            const updated = await adminResolverReporte(id, estado)
            setReporte(updated)
            setMsg('Reporte actualizado a: ' + estado)
        } catch (err) {
            setMsg(err.message)
        }
    }

    if (loading) {
        return (
            <div className="page-surface min-h-screen flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        )
    }

    if (!reporte) return null

    const isResuelto = reporte.estado === 'RESUELTO'

    return (
        <div className="page-surface min-h-screen">
            <header className="sticky top-0 z-40 border-b border-secondary/20 bg-text-primary/60 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/groove-admin')} className="btn-ghost px-3 py-1.5 text-xs flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            Volver
                        </button>
                        <h1 className="text-lg font-black text-ink">Reporte #{reporte.id}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-ink-soft">{user?.username}</span>
                        <button onClick={() => { logout(); navigate('/groove-admin/login') }} className="rounded-lg border border-red-400/40 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500/15 transition-all">Salir</button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
                {msg && (
                    <p className={`px-4 py-2 rounded-lg text-sm font-semibold ${msg.includes('Error') || msg.includes('error') ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'}`}>
                        {msg}
                    </p>
                )}

                {/* Status badge */}
                <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${isResuelto ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-yellow-100 text-yellow-700 border border-yellow-300'}`}>
                        {reporte.estado || 'PENDIENTE'}
                    </span>
                    {!isResuelto && (
                        <div className="flex gap-2">
                            <button onClick={() => handleResolver('RESUELTO')}
                                className="rounded-lg border border-green-400/50 bg-green-500/20 px-4 py-1.5 text-xs font-bold text-green-700 hover:bg-green-500/30 transition-all">
                                Marcar como resuelto
                            </button>
                            <button onClick={() => handleResolver('RECHAZADO')}
                                className="rounded-lg border border-red-400/50 bg-red-500/20 px-4 py-1.5 text-xs font-bold text-red-700 hover:bg-red-500/30 transition-all">
                                Rechazar reporte
                            </button>
                        </div>
                    )}
                </div>

                {/* Report details */}
                <div className="card-shell p-6">
                    <h2 className="text-base font-black text-ink uppercase tracking-wider mb-4">Detalles del reporte</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-lg bg-secondary/10 p-3">
                            <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">ID</p>
                            <p className="text-sm font-bold text-ink">{reporte.id}</p>
                        </div>
                        <div className="rounded-lg bg-secondary/10 p-3">
                            <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Reportado por</p>
                            <p className="text-sm font-semibold text-ink">{reporte.reporteroUsername || '—'}</p>
                        </div>
                        <div className="rounded-lg bg-secondary/10 p-3">
                            <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Tipo de contenido</p>
                            <p className="text-sm text-ink">{reporte.tipoContenido || '—'}</p>
                        </div>
                        <div className="rounded-lg bg-secondary/10 p-3">
                            <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">ID del contenido</p>
                            <p className="text-sm text-ink">{reporte.idContenido || '—'}</p>
                        </div>
                        <div className="rounded-lg bg-secondary/10 p-3 sm:col-span-2">
                            <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Motivo</p>
                            <p className="text-sm font-bold text-ink">{reporte.motivo || '—'}</p>
                        </div>
                        <div className="rounded-lg bg-secondary/10 p-3 sm:col-span-2">
                            <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Descripción adicional</p>
                            <p className="text-sm text-ink whitespace-pre-wrap">{reporte.detalleAdicional || '—'}</p>
                        </div>
                        <div className="rounded-lg bg-secondary/10 p-3">
                            <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Fecha del reporte</p>
                            <p className="text-sm text-ink">{reporte.fechaReporte ? new Date(reporte.fechaReporte).toLocaleString() : '—'}</p>
                        </div>
                        <div className="rounded-lg bg-secondary/10 p-3">
                            <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Revisado por</p>
                            <p className="text-sm text-ink">{reporte.revisadoPorUsername || '—'}</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}