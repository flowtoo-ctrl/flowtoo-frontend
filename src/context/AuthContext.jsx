import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Optional: better dev experience — throw if used outside provider
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("flowtoo:user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (err) {
      console.warn("Failed to parse stored user:", err);
      localStorage.removeItem("flowtoo:user");
      return null;
    }
  });

  // Sync user → localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("flowtoo:user", JSON.stringify(user));
    } else {
      localStorage.removeItem("flowtoo:user");
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      setUser(data);
      return data;
    } catch (err) {
      console.error("Login failed:", err);
      throw err; // let the component handle the error
    }
  };

  const signup = async (name, email, password) => {
    try {
      const { data } = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });
      setUser(data);
      return data;
    } catch (err) {
      console.error("Signup failed:", err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    // Optional: also call backend logout if it exists
    // api.post("/api/auth/logout").catch(() => {});
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}