import { createContext, useContext, useEffect, useState } from "react";
import API_AUTH from "../services/apiAuth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("flowtoo:user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await API_AUTH.post("/login", { email, password });
    localStorage.setItem("flowtoo:user", JSON.stringify(res.data));
    setUser(res.data);
  };

  const signup = async (name, email, password) => {
    const res = await API_AUTH.post("/register", {
      name,
      email,
      password,
    });
    localStorage.setItem("flowtoo:user", JSON.stringify(res.data));
    setUser(res.data);
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

