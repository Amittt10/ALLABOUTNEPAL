import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

        // Clear invalid token
        setToken(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
