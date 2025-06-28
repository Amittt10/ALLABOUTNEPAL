// src/context/AuthContext.jsx
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
        const res = await axios.get("http://localhost:3000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        setUser(null);
        setError("Unauthorized or failed to fetch profile");
        setToken(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  // login method performs API call, stores token, fetches profile
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const loginRes = await axios.post("http://localhost:3000/api/login", {
        email,
        password,
      });
      const token = loginRes.data.token;
      if (!token) throw new Error("No token received");

      localStorage.setItem("token", token);
      setToken(token);

      // fetch profile right after login
      const profileRes = await axios.get("http://localhost:3000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(profileRes.data);

      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
      return false;
    }
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
