import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_AUTH from "../services/apiAuth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("flowtoo:user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log("Loaded user from localStorage on mount:", parsed);
        setUser(parsed);
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem("flowtoo:user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API_AUTH.post("/login", { email, password });
      console.log("LOGIN RESPONSE FROM BACKEND:", res.data);

      const data = res.data;
      localStorage.setItem("flowtoo:user", JSON.stringify(data));
      setUser(data);

      // Admin redirect
      if (data.isAdmin === true) {
        console.log("ADMIN DETECTED → redirecting to /admin");
        navigate("/admin");
      } else {
        console.log("Regular user → redirecting to /");
        navigate("/");
      }

      return data;
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      throw err.response?.data?.message || "Login failed";
    }
  };

  const logout = () => {
    localStorage.removeItem("flowtoo:user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);