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
    console.log("Checking localStorage on mount:", stored ? "found" : "not found");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log("Parsed stored user:", parsed);
        setUser(parsed);
      } catch (e) {
        console.error("Invalid stored user data:", e);
        localStorage.removeItem("flowtoo:user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Sending login request...");
      const res = await API_AUTH.post("/login", { email, password });
      console.log("Login response received:", res.status, res.data);

      const data = res.data;
      console.log("Storing user data:", data);
      localStorage.setItem("flowtoo:user", JSON.stringify(data));
      setUser(data);

      // IMPORTANT: Check data.user.isAdmin (not data.isAdmin)
      const isAdmin = data.user?.isAdmin === true;
      console.log("isAdmin value:", isAdmin);

      if (isAdmin) {
        console.log("ADMIN LOGIN → navigating to /admin");
        navigate("/admin", { replace: true });
      } else {
        console.log("NORMAL LOGIN → navigating to /");
        navigate("/", { replace: true });
      }

      return data;
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      throw err.response?.data?.message || "Login failed";
    }
  };

  const logout = () => {
    console.log("Logging out...");
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