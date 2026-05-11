import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Index from "../pages/index"
import AccesPage from "../pages/AccesPage"
import Home from "../pages/Home"
import Event from "../pages/Event"
import Header from "../components/Estrcutura/Header"
import Footer from "../components/Estrcutura/Footer"

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
                <Route path="/event/:id" element={<Event />} />
            </Routes>
            {!hideLayout && <Footer />}
        </>
    )
}
