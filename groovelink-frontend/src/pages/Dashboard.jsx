import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { getEstadisticas, getEventosStats } from '../api/dashboard'

export default function Dashboard() {
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    const [estadisticas, setEstadisticas] = useState(null)
    const [eventos, setEventos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return
        let active = true
        async function cargar() {
            try {
                const [est, evts] = await Promise.all([
                    getEstadisticas(),
                    getEventosStats(),
                ])
                if (active) {
                    setEstadisticas(est)
                    setEventos(evts)
                }
            } catch {
                if (active) navigate('/login')
            } finally {
                if (active) setLoading(false)
            }
        }
        cargar()
        return () => { active = false }
    }, [user])

    if (loading) {
        return (
            <main className="page-surface flex min-h-screen items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </main>
        )
    }

    const stats = [
        { label: 'Total Eventos', value: estadisticas?.totalEventos ?? 0, color: 'from-blue-500 to-blue-600' },
        { label: 'Total Asistentes', value: estadisticas?.totalAsistentes ?? 0, color: 'from-green-500 to-green-600' },
        { label: 'Total Me Gustas', value: estadisticas?.totalMeGustas ?? 0, color: 'from-pink-500 to-pink-600' },
        { label: 'Total Comentarios', value: estadisticas?.totalComentarios ?? 0, color: 'from-purple-500 to-purple-600' },
    ]

    return (
        <main className="page-surface min-h-screen px-4 py-8 md:px-6 md:py-10">
            <div className="mx-auto w-full max-w-7xl">
                <div className="mb-6 flex items-center justify-between gap-3">
                    <button type="button" className="btn-ghost px-4 py-2 text-sm" onClick={() => navigate('/home')}>
                        Volver al inicio
                    </button>
                    <h1 className="text-2xl font-black text-ink">Dashboard</h1>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {stats.map((s) => (
                        <div key={s.label} className="card-shell overflow-hidden p-0">
                            <div className={`bg-gradient-to-br ${s.color} px-4 py-6 text-center`}>
                                <p className="text-3xl font-black text-white">{s.value}</p>
                            </div>
                            <div className="px-4 py-3">
                                <p className="text-center text-sm font-bold text-ink">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card-shell mt-8 overflow-hidden p-5 md:p-7">
                    <h2 className="mb-4 text-xl font-bold text-ink">Eventos</h2>
                    {eventos.length === 0 ? (
                        <p className="text-sm text-ink-soft">No tienes eventos creados.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-secondary/20 text-xs font-bold uppercase tracking-wider text-ink-soft">
                                        <th className="pb-3 pr-4">Nombre</th>
                                        <th className="pb-3 pr-4">Fecha</th>
                                        <th className="pb-3 pr-4">Ubicación</th>
                                        <th className="pb-3 pr-4 text-center">Asistentes</th>
                                        <th className="pb-3 pr-4 text-center">Me gustas</th>
                                        <th className="pb-3 text-center">Comentarios</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {eventos.map((e) => (
                                        <tr key={e.id} className="border-b border-secondary/10 hover:bg-background/50">
                                            <td className="py-3 pr-4 font-semibold text-ink">{e.nombre}</td>
                                            <td className="py-3 pr-4 text-ink-soft">{e.fechaInicio || '-'}</td>
                                            <td className="py-3 pr-4 text-ink-soft">{e.ubicacion || '-'}</td>
                                            <td className="py-3 pr-4 text-center text-ink">{e.numAsistentes}</td>
                                            <td className="py-3 pr-4 text-center text-ink">{e.numMeGustas}</td>
                                            <td className="py-3 text-center text-ink">{e.numComentarios}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
