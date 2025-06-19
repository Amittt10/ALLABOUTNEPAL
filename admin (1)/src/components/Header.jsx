"use client"
import { useAuth } from "../context/AuthContext"
import "./Header.css"

const Header = ({ onMenuClick }) => {
  const { logout } = useAuth()

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-button" onClick={onMenuClick} aria-label="Open menu">
          <span className="menu-icon">☰</span>
        </button>
        <h1 className="header-title">Admin Dashboard</h1>
      </div>

      <div className="header-right">
        <button className="logout-button" onClick={logout} title="Logout">
          <span>🚪</span>
        </button>
      </div>
    </header>
  )
}

export default Header
