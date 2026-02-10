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
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored user", e);
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

      // Redirect based on admin status
      if (data.isAdmin === true) {
        navigate("/admin");
      } else {
        navigate("/");
      }

      return data;
    } catch (err) {
      console.error("Login error:", err);
      throw err.response?.data?.message || "Login failed. Please try again.";
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await API_AUTH.post("/register", { name, email, password });
      const data = res.data;

      localStorage.setItem("flowtoo:user", JSON.stringify(data));
      setUser(data);

      // Usually new users are not admin, but we check anyway
      if (data.isAdmin === true) {
        navigate("/admin");
      } else {
        navigate("/");
      }

      return data;
    } catch (err) {
      console.error("Signup error:", err);
      throw err.response?.data?.message || "Signup failed. Please try again.";
    }
  };

  const logout = () => {
    localStorage.removeItem("flowtoo:user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);