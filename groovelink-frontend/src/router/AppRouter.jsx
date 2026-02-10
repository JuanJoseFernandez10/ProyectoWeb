import { BrowserRouter, Routes, Route } from "react-router-dom"
import Index from "../pages/index"
import AccesPage from "../pages/AccesPage"
import Home from "../pages/Home"

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<AccesPage />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </BrowserRouter>
    )
}
