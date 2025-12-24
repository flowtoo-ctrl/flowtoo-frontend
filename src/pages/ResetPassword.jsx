// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/users/reset/${token}`, { password });
      alert("Password reset successful. Please log in.");
      navigate("/login");
    } catch (err) {
      alert("Reset failed or token expired.");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 20 }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Set new password</button>
      </form>
    </div>
  );
}
