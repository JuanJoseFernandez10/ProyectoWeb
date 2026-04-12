import React, { useEffect, useMemo, useRef, useState } from 'react'

function UserProfileMenu({ user, onLogout, onGoHome }) {
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef(null)

    const profileImage =
        user?.profileImageUrl || user?.avatarUrl || user?.photoUrl || user?.imageUrl || null

    const displayName = user?.username || user?.name || user?.email || 'usuario'

    const rawRole =
        user?.role ||
        (Array.isArray(user?.roles) ? user.roles[0] : null) ||
        (Array.isArray(user?.authorities) ? user.authorities[0]?.authority || user.authorities[0] : null)

    const displayRole = useMemo(() => {
        if (!rawRole) return 'Sin rol'

        const normalized = String(rawRole).replace(/^ROLE_/, '')
        const roleMap = {
            USER: 'Usuario',
            EMPRESA: 'Organizador',
            ADMIN: 'Administrador',
        }

        return roleMap[normalized] || normalized.charAt(0) + normalized.slice(1).toLowerCase()
    }, [rawRole])

    const initials = useMemo(() => {
        const source = displayName.trim()
        if (!source) return 'U'
        const parts = source.split(/\s+/)
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }, [displayName])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false)
            }
        }

        const handleEsc = (event) => {
            if (event.key === 'Escape') setMenuOpen(false)
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEsc)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEsc)
        }
    }, [])

    const handleGoHome = () => {
        setMenuOpen(false)
        onGoHome()
    }

    const handleLogout = () => {
        setMenuOpen(false)
        onLogout()
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                type="button"
                className="btn-ghost py-1.5! px-2.5! rounded-xl gap-2 bg-text-primary/12! border-text-primary/30! hover:bg-text-primary/24! hover:border-text-primary/55!"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
            >
                {profileImage ? (
                    <img
                        src={profileImage}
                        alt={`Foto de ${displayName}`}
                        className="h-9 w-9 rounded-full object-cover border border-text-primary/50"
                    />
                ) : (
                    <span className="h-9 w-9 rounded-full bg-primary text-ink font-extrabold flex items-center justify-center border border-text-primary/40">
                        {initials}
                    </span>
                )}
                <span className="hidden lg:inline text-sm font-semibold text-text-primary/90">{displayName}</span>
            </button>

            {menuOpen ? (
                <div className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-secondary/30 bg-text-primary text-ink shadow-2xl shadow-ink/20 overflow-hidden">
                    <div className="px-4 py-3 border-b border-secondary/20 bg-background/60">
                        <p className="text-sm font-semibold">{displayName}</p>
                        <p className="text-xs text-ink-soft">{displayRole}</p>
                    </div>

                    <div className="p-2 flex flex-col gap-1">
                        <button
                            type="button"
                            className="btn-ghost w-full justify-start py-2! px-3! bg-transparent! border-transparent! shadow-none! text-ink! hover:bg-background! hover:border-secondary/25!"
                            onClick={handleGoHome}
                        >
                            Inicio
                        </button>
                        <button
                            type="button"
                            className="btn-ghost w-full justify-start py-2! px-3! bg-background/40! border-transparent! shadow-none! text-ink-soft! cursor-not-allowed"
                            disabled
                        >
                            Mi perfil (proximamente)
                        </button>
                        <button
                            type="button"
                            className="btn-ghost w-full justify-start py-2! px-3! bg-background/40! border-transparent! shadow-none! text-ink-soft! cursor-not-allowed"
                            disabled
                        >
                            Ajustes (proximamente)
                        </button>
                        <button
                            type="button"
                            className="btn-ghost w-full justify-start py-2! px-3! bg-transparent! border-transparent! shadow-none! text-red-700! hover:bg-red-50! hover:border-red-200!"
                            onClick={handleLogout}
                        >
                            Cerrar sesion
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default UserProfileMenu
