import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import UserProfileMenu from './UserProfileMenu'
import NotificationsPanel from '../Main/NotificationsPanel'
import { contarNoLeidas } from '../../api/notifications'

function Header() {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, isAuthenticated, logout } = useContext(AuthContext)
    const { dark, toggleTheme } = useTheme()
    const [searchText, setSearchText] = useState('')
    const [showNotifs, setShowNotifs] = useState(false)
    const [noLeidas, setNoLeidas] = useState(0)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        if (!isAuthenticated) {
            setNoLeidas(0)
            return
        }
        const interval = setInterval(() => {
            contarNoLeidas()
                .then((data) => setNoLeidas(data?.count ?? 0))
                .catch(() => {})
        }, 15000)
        contarNoLeidas()
            .then((data) => setNoLeidas(data?.count ?? 0))
            .catch(() => {})
        return () => clearInterval(interval)
    }, [isAuthenticated])

    const navItems = [
        { label: 'Inicio', path: '/home' },
        { label: 'Eventos', path: '/events' },
        { label: 'Grupos', path: '/groups' },
        { label: 'Chats', path: '/chats' },
        { label: 'Amigos', path: '/friends' },
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
                        <img src="/assets/logo-header.png" alt="Logo" className="h-16 sm:h-20 md:h-30 w-auto max-w-none object-contain drop-shadow-sm" />
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

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden flex items-center justify-center h-11 w-11 rounded-xl text-text-primary/80 hover:text-text-primary hover:bg-text-primary/15 transition-colors"
                        aria-label="Menú"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>

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

                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="flex h-11 w-11 md:h-9 md:w-9 items-center justify-center rounded-full text-text-primary/80 hover:text-text-primary hover:bg-text-primary/15 transition-colors"
                            aria-label={dark ? 'Modo claro' : 'Modo oscuro'}
                        >
                            {dark ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        {isAuthenticated && (
                            <div className="relative">
                                <button
                        type="button"
                        onClick={() => setShowNotifs((v) => !v)}
                        className="relative flex h-11 w-11 md:h-9 md:w-9 items-center justify-center rounded-full text-text-primary/80 hover:text-text-primary hover:bg-text-primary/15 transition-colors"
                        aria-label="Notificaciones"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {noLeidas > 0 && (
                                        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                            {noLeidas > 99 ? '99+' : noLeidas}
                                        </span>
                                    )}
                                </button>
                                {showNotifs && (
                                    <NotificationsPanel onClose={() => setShowNotifs(false)} />
                                )}
                            </div>
                        )}

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

                {mobileMenuOpen && (
                    <div className="mt-2 md:hidden flex flex-col items-stretch gap-1 rounded-2xl border border-text-primary/25 bg-text-primary/10 p-2">
                        {navItems.map((item) => (
                            <button
                                key={item.path}
                                type="button"
                                className={`rounded-xl px-4 py-3 text-sm font-bold transition-all text-left ${
                                    isActive(item.path)
                                        ? 'bg-text-primary/90 text-ink shadow-sm'
                                        : 'text-text-primary/90 hover:text-text-primary hover:bg-text-primary/20'
                                }`}
                                onClick={() => { navigate(item.path); setMobileMenuOpen(false) }}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header