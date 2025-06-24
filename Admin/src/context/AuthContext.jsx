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
  const [loading, setLoading] = useState(true)  // loading while verifying token
  const [error, setError] = useState(null)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("adminToken")
      if (token) {
        setAuthToken(token)
        try {
          console.log("Verifying token...")
          const response = await api.verifyToken()
          console.log("Token verification succeeded:", response.data)
          setUser(response.data.user)
          setError(null)
        } catch (err) {
          console.error("Token verification failed:", err)
          localStorage.removeItem("adminToken")
          setAuthToken(null)
          setUser(null)
          setError("Session expired, please login again.")
        }
      } else {
        console.log("No token found in localStorage")
        setUser(null)
      }
      setLoading(false) // always set loading false when done
    }
    initAuth()
  }, [])

  const login = async (credentials) => {
    try {
      setError(null)
      const response = await api.login(credentials)
      const { token, user } = response.data

      localStorage.setItem("adminToken", token)
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
    localStorage.removeItem("adminToken")
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
