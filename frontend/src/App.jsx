import { Outlet } from "react-router-dom"
import "./App.css"
import Header from "./Component/Header/Header"
import Home from "./pages/Home/Home"
import Footer from "./Component/Footer/Footer"
import Layout from "./Component/Layout/Layout"


export default function App() {
  return (
    <>
      <Header />
      <Home />
      <Footer />
      <Layout />
      <Outlet />
    </>
  )
}
