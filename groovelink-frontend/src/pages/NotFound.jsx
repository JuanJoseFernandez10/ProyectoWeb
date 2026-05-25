import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className="page-surface flex flex-col items-center justify-center min-h-screen px-4">
            <h1 className="text-6xl font-black text-ink">404</h1>
            <p className="mt-4 text-lg text-ink-soft">Página no encontrada</p>
            <Link to="/home" className="btn-primary mt-6 px-6 py-3">Volver al inicio</Link>
        </div>
    )
}
