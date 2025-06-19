"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { api, setAuthToken } from "../api/axiosConfig"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("adminToken")
      if (token) {
        try {
          setAuthToken(token)
          const response = await api.verifyToken()
          setUser(response.data.user)
        } catch (err) {
          console.error("Token verification failed:", err)
          localStorage.removeItem("adminToken")
          setAuthToken(null)
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (credentials) => {
    try {
      setError(null)
      const response = await api.login(credentials)
      const { token, user } = response.data

      setAuthToken(token)
      setUser(user)

      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || "Login failed"
      setError(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    setAuthToken(null)
    setUser(null)
    setError(null)
  }

  const value = {
    user,
    login,
    logout,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
