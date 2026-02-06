import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  // Still loading? (optional, you can add a spinner if you want)
  // if (user === undefined) return <div>Loading...</div>;

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only route
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 