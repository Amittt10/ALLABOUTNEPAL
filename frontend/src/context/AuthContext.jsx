import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Track user info
  const [user, setUser] = useState(null);

  // Track auth token from localStorage and in state for reactivity
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // Loading and error states for profile fetching
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Effect to fetch user profile when token changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setUser(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log("Fetching profile with token:", token);
        const res = await axios.get("http://localhost:3000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Profile fetch failed:", err);
        setUser(null);
        setError("Unauthorized or failed to fetch profile");

        // Optionally clear invalid token
        setToken(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // Login function sets user and token
  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("token", token);
  };

  // Logout function clears user and token
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
