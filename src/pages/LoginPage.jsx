import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css"

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      window.location.href = "/";
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials or try again later.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "1rem" }}>
      <h2>Login</h2>

      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

      <form onSubmit={submitHandler}>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "0.75rem",
            background: isLoading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <hr style={{ margin: "1.5rem 0" }} />

      <a
        href={`\( {import.meta.env.VITE_API_URL?.replace(/\/ \)/, "") || ""}/api/auth/google`}
        style={{ textDecoration: "none" }}
      >
        <button
          style={{
            width: "100%",
            padding: "0.75rem",
            background: "#4285F4",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login with Google
        </button>
      </a>
    </div>
  );
}

