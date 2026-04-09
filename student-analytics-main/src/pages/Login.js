import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (role) => {
    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Invalid credentials");
        return;
      }

      if (result.user.role !== role) {
        alert(`Please login using the ${result.user.role} option`);
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(result.user));

      if (role === "student") navigate("/student");
      else navigate("/admin");
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to login, please try again.");
    }
  };

  return (
    <div style={{
      height: "100vh",
      background: "linear-gradient(to right, #0f766e, #115e59)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        background: "white",
        padding: "40px",
        borderRadius: "12px",
        width: "400px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
      }}>
        <h2 style={{ textAlign: "center" }}>Student Analytics</h2>

        <input
          type="email"
          placeholder="Email"
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          style={btnStyle("#0f766e")}
          onClick={() => handleLogin("student")}
        >
          Login as Student
        </button>

        <button
          style={btnStyle("#111827")}
          onClick={() => handleLogin("teacher")}
        >
          Login as Teacher
        </button>

        <button
          style={btnStyle("#e5e7eb", "black")}
          onClick={() => navigate("/signup")}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}

const btnStyle = (bg, color = "white") => ({
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  background: bg,
  color: color,
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
});

export default Login;