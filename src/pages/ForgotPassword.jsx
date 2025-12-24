// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users/forgot", { email });
      setSent(true);
    } catch (err) {
      alert("Error sending reset link");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 20 }}>
      <h2>Forgot Password</h2>
      {!sent ? (
        <form onSubmit={handleSubmit}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" required />
          <button type="submit">Send reset link</button>
        </form>
      ) : (
        <p>If that email exists, a reset link has been sent.</p>
      )}
    </div>
  );
}

