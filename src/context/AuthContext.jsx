import { createContext, useContext, useEffect, useState } from "react";
import API_AUTH from "../services/apiAuth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("flowtoo:user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error("Invalid user data in localStorage", e);
        localStorage.removeItem("flowtoo:user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API_AUTH.post("/login", { email, password });
      const data = res.data;
      localStorage.setItem("flowtoo:user", JSON.stringify(data));
      setUser(data);
      return data;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await API_AUTH.post("/register", { name, email, password });
      const data = res.data;
      localStorage.setItem("flowtoo:user", JSON.stringify(data));
      setUser(data);
      return data;
    } catch (err) {
      console.error("Signup failed:", err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("flowtoo:user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

