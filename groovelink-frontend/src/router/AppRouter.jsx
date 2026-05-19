import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Index from "../pages/index"
import AccesPage from "../pages/AccesPage"
import Home from "../pages/Home"
import Event from "../pages/Event"
import EventsList from "../pages/EventsList"
import MiPerfil from "../pages/MiPerfil"
import EventEdicion from "../pages/EventEdicion"
import MisEventos from "../pages/MisEventos"
import Personalizacion from "../pages/Personalizacion"
import Chats from "../pages/Chats"
import Groups from "../pages/Groups"
import CreateGroup from "../pages/CreateGroup"
import PerfilUsuario from "../pages/PerfilUsuario"
import Amigos from "../pages/Amigos"
import Header from "../components/Estrcutura/Header"
import Footer from "../components/Estrcutura/Footer"

function NotFound() {
    return (
        <div className="page-surface flex flex-col items-center justify-center min-h-screen px-4">
            <h1 className="text-6xl font-black text-ink">404</h1>
            <p className="mt-4 text-lg text-ink-soft">Página no encontrada</p>
            <a href="/home" className="btn-primary mt-6 px-6 py-3">Volver al inicio</a>
        </div>
    )
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Layout />
        </BrowserRouter>
    )
}

function Layout() {
    const { pathname } = useLocation();
    const hideLayout = pathname === '/' || pathname === '/login';

    return (
        <>
            {!hideLayout && <Header />}
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<AccesPage />} />
                <Route path="/home" element={<Home />} />
                <Route path="/events" element={<EventsList />} />
                <Route path="/event/:id" element={<Event />} />
                <Route path="/event/new" element={<EventEdicion />} />
                <Route path="/event/:id/edit" element={<EventEdicion />} />
                <Route path="/profile" element={<MiPerfil />} />
                <Route path="/my-events" element={<MisEventos />} />
                <Route path="/chats" element={<Chats />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/groups/create" element={<CreateGroup />} />
                <Route path="/personalize" element={<Personalizacion />} />
                <Route path="/user/:id" element={<PerfilUsuario />} />
                <Route path="/friends" element={<Amigos />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            {!hideLayout && <Footer />}
        </>
    )
}
