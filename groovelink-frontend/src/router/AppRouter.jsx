import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import AccesPage from "../pages/AccesPage"

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Login" element={<AccesPage />} />
            </Routes>
        </BrowserRouter>
    )
}
