import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import UserSignup from "./pages/UserSignup"
import UserLogin from "./pages/UserLogin"
import Header from "./Component/Header/Header"
import Home from "./pages/Home/Home"
import Footer from "./Component/Footer/Footer"
import Layout from "./Component/Layout/Layout"
import App from "./App"

import CulturalHeritage from "./pages/CulturalHeritage"
import Festivals from "./pages/Festivals"
import Events from "./pages/Events"
import Quiz from "./pages/Quiz"

const rootElement = document.getElementById("root")
const root = createRoot(rootElement)

root.render(
  <BrowserRouter>
    <Routes>
      {/* initial routes */}
      <Route path="/register" element={<UserSignup />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/home" element={<Home />} />
      <Route path="/header" element={<Header />} />
      <Route path="/footer" element={<Footer />} />
      <Route path="/layout" element={<Layout />} />

      {/* new pages */}
      <Route path="/cultural-heritage" element={<CulturalHeritage />} />
      <Route path="/festivals" element={<Festivals />} />
      <Route path="/events" element={<Events />} />
      <Route path="/quiz" element={<Quiz />} />

      {/* default or root route */}
      <Route path="/" element={<App />} />
    </Routes>
  </BrowserRouter>,
)
