import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../Signup.css"

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/users/register", { name, email, password });
      alert("Account created successfully!");
      navigate("/login");
    } catch (error) {
      alert("Error creating account");
    }
  };

  return (
    <div className="container-box">
      <h1 className="page-title">Create Account</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="btn-primary">Sign Up</button>
      </form>

      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Already have an account? <Link to="/login" className="text-link">Login</Link>
      </p>
    </div>
  );
}