import React from 'react'

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="page-surface flex min-h-screen flex-col items-center justify-center px-4">
                    <h1 className="text-4xl font-black text-ink">Algo salió mal</h1>
                    <p className="mt-2 text-ink-soft">Ocurrió un error inesperado. Recarga la página o vuelve al inicio.</p>
                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-primary px-6 py-3"
                        >
                            Recargar página
                        </button>
                        <a href="/home" className="btn-ghost px-6 py-3">Volver al inicio</a>
                    </div>
                </div>
            )
        }
        return this.props.children
    }
}
