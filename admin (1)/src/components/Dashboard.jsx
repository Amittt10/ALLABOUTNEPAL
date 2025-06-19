"use client"

import { useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"
import "./Dashboard.css"

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="dashboard">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-main">
        <Header onMenuClick={toggleSidebar} />

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && <div className="dashboard-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  )
}

export default Dashboard
