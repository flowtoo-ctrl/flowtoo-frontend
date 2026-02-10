import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // or <div>Loading...</div> or a spinner component
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Fixed: user.isAdmin instead of user.user?.isAdmin
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}