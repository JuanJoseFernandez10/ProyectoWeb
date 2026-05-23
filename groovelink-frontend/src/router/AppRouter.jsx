import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { lazy, Suspense } from "react"
import Header from "../components/Estrcutura/Header"
import Footer from "../components/Estrcutura/Footer"

const Index = lazy(() => import("../pages/index"))
const AccesPage = lazy(() => import("../pages/AccesPage"))
const Home = lazy(() => import("../pages/Home"))
const Event = lazy(() => import("../pages/Event"))
const EventsList = lazy(() => import("../pages/EventsList"))
const MiPerfil = lazy(() => import("../pages/MiPerfil"))
const EventEdicion = lazy(() => import("../pages/EventEdicion"))
const MisEventos = lazy(() => import("../pages/MisEventos"))
const Personalizacion = lazy(() => import("../pages/Personalizacion"))
const Chats = lazy(() => import("../pages/Chats"))
const Groups = lazy(() => import("../pages/Groups"))
const CreateGroup = lazy(() => import("../pages/CreateGroup"))
const PerfilUsuario = lazy(() => import("../pages/PerfilUsuario"))
const Amigos = lazy(() => import("../pages/Amigos"))
const Settings = lazy(() => import("../pages/Settings"))
const AdminLogin = lazy(() => import("../pages/AdminLogin"))
const AdminPanel = lazy(() => import("../pages/AdminPanel"))
const AdminUserDetail = lazy(() => import("../pages/AdminUserDetail"))
const AdminEventDetail = lazy(() => import("../pages/AdminEventDetail"))
const AdminReportDetail = lazy(() => import("../pages/AdminReportDetail"))
const AdminChats = lazy(() => import("../pages/AdminChats"))
const AdminChatDetail = lazy(() => import("../pages/AdminChatDetail"))
const Dashboard = lazy(() => import("../pages/Dashboard"))
const Premium = lazy(() => import("../pages/Premium"))

function NotFound() {
    return (
        <div className="page-surface flex flex-col items-center justify-center min-h-screen px-4">
            <h1 className="text-6xl font-black text-ink">404</h1>
            <p className="mt-4 text-lg text-ink-soft">Página no encontrada</p>
            <a href="/home" className="btn-primary mt-6 px-6 py-3">Volver al inicio</a>
        </div>
    )
}

function Loading() {
    return (
        <div className="page-surface flex min-h-screen items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
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
    const hideLayout = pathname === '/' || pathname === '/login' || pathname.startsWith('/groove-admin');

    return (
        <>
            {!hideLayout && <Header />}
            <Suspense fallback={<Loading />}>
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
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/premium" element={<Premium />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/groove-admin/login" element={<AdminLogin />} />
                    <Route path="/groove-admin" element={<AdminPanel />} />
                    <Route path="/groove-admin/usuarios/:id" element={<AdminUserDetail />} />
                    <Route path="/groove-admin/eventos/:id" element={<AdminEventDetail />} />
                    <Route path="/groove-admin/reportes/:id" element={<AdminReportDetail />} />
                    <Route path="/groove-admin/chats" element={<AdminChats />} />
                    <Route path="/groove-admin/chats/:id" element={<AdminChatDetail />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
            {!hideLayout && <Footer />}
        </>
    )
}
