import React, { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import UserProfileMenu from './UserProfileMenu'

function Header() {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, isAuthenticated, logout } = useContext(AuthContext)
    const [searchText, setSearchText] = useState('')

    const navItems = [
        { label: 'Inicio', path: '/home' },
        { label: 'Eventos', path: '/events' },
        { label: 'Grupos', path: '/groups' },
    ]

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const handleGoHome = () => {
        navigate('/home')
    }

    const handleGoLogin = () => {
        navigate('/login')
    }

    const handleSearchSubmit = (event) => {
        event.preventDefault()
        const query = searchText.trim()
        if (!query) {
            navigate('/events')
            return
        }
        navigate(`/events?q=${encodeURIComponent(query)}`)
    }

    const isActive = (path) => location.pathname === path

    return (
        <header className="bg-secondary/95 text-text-primary px-3 pb-2.5 shadow-md shadow-secondary/20">
            <div className="mx-auto max-w-7xl">
                <div className="flex items-center justify-between gap-3 md:gap-4">
                    <div onClick={() => navigate('/home')} className="cursor-pointer flex items-center flex-none shrink-0">
                        <img src="/assets/logo-header.png" alt="Logo" className="h-24 md:h-30 w-auto max-w-none object-contain drop-shadow-sm" />
                    </div>

                    <div className="hidden md:flex items-center rounded-2xl border border-text-primary/25 bg-text-primary/10 p-1 gap-1">
                        {navItems.map((item) => (
                            <button
                                key={item.path}
                                type="button"
                                className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                                    isActive(item.path)
                                        ? 'bg-text-primary/90 text-ink shadow-sm'
                                        : 'text-text-primary/90 hover:text-text-primary hover:bg-text-primary/20'
                                }`}
                                onClick={() => navigate(item.path)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        <form onSubmit={handleSearchSubmit} className="hidden md:block w-72">
                            <input
                                type="search"
                                value={searchText}
                                onChange={(event) => setSearchText(event.target.value)}
                                placeholder="Buscar eventos o grupos"
                                className="w-full rounded-xl border border-text-primary/35 bg-text-primary/14 px-3 py-2 text-sm text-text-primary placeholder:text-text-primary/70 focus:outline-none focus:border-text-primary/70 focus:bg-text-primary/20"
                            />
                        </form>

                        {isAuthenticated ? (
                            <UserProfileMenu user={user} onLogout={handleLogout} onGoHome={handleGoHome} />
                        ) : (
                            <button
                                type="button"
                                className="btn-ghost py-2! px-3!"
                                onClick={handleGoLogin}
                            >
                                Iniciar sesion
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-2 md:hidden flex items-center gap-2">
                    <form onSubmit={handleSearchSubmit} className="w-full">
                        <input
                            type="search"
                            value={searchText}
                            onChange={(event) => setSearchText(event.target.value)}
                            placeholder="Buscar eventos o grupos"
                            className="w-full rounded-xl border border-text-primary/35 bg-text-primary/14 px-3 py-2 text-sm text-text-primary placeholder:text-text-primary/70 focus:outline-none focus:border-text-primary/70 focus:bg-text-primary/20"
                        />
                    </form>
                </div>

                <div className="mt-2 md:hidden flex items-center justify-center gap-2">
                    {navItems.map((item) => (
                        <button
                            key={item.path}
                            type="button"
                            className={`rounded-xl px-3 py-2 text-sm font-bold transition-all border ${
                                isActive(item.path)
                                    ? 'bg-text-primary/90 text-ink border-text-primary/80'
                                    : 'bg-text-primary/8 text-text-primary border-text-primary/20 hover:bg-text-primary/24 hover:border-text-primary/50'
                            }`}
                            onClick={() => navigate(item.path)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    )
}

export default Header