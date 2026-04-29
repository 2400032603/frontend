import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SimpleCaptcha from "../components/SimpleCaptcha";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const demoCredentials = {
    student: {
      email: "sindhu@gmail.com",
      password: "Ss@123456"
    },
    teacher: {
      email: "sneha@gmail.com",
      password: "Ss@12345"
    }
  };

  const handleFillDemo = (role) => {
    setEmail(demoCredentials[role].email);
    setPassword(demoCredentials[role].password);
  };

  const handleLogin = async (role) => {
    // Check if account is locked
    if (isLocked) {
      alert("Too many failed attempts. Please try again later.");
      return;
    }

    // Validate CAPTCHA
    if (!isCaptchaValid) {
      alert("Please verify the CAPTCHA before logging in.");
      return;
    }

    // Validate email and password
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

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
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        if (newAttempts >= 5) {
          setIsLocked(true);
          alert("Account locked due to multiple failed attempts. Please try again later.");
        } else {
          alert(`${result.error || "Invalid credentials"} (Attempt ${newAttempts}/5)`);
        }
        return;
      }

      if (result.user.role !== role) {
        alert(`Please login using the ${result.user.role} option`);
        return;
      }

      // Reset on successful login
      setLoginAttempts(0);
      setIsLocked(false);
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
      minHeight: "100vh",
      background: "linear-gradient(to right, #0f766e, #115e59)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "10px",
      overflow: "hidden"
    }}>
      <div style={{
        background: "white",
        padding: "22px 22px 18px 22px",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        maxHeight: "calc(100vh - 24px)",
        overflowY: "auto"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#0f766e" }}>
          🔐 Student Analytics
        </h2>

        {isLocked && (
          <div style={{
            background: "#fee2e2",
            border: "2px solid #dc2626",
            color: "#991b1b",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "14px",
            fontWeight: "500"
          }}>
            ⛔ Account locked due to multiple failed login attempts. Please try again later.
          </div>
        )}

        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLocked}
            style={{
              ...inputStyle,
              opacity: isLocked ? 0.6 : 1
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLocked}
            style={{
              ...inputStyle,
              opacity: isLocked ? 0.6 : 1
            }}
          />
        </div>

        <SimpleCaptcha
          onCaptchaChange={setIsCaptchaValid}
          onRefresh={() => setIsCaptchaValid(false)}
        />

        <button
          style={{
            ...btnStyle("#0f766e"),
            opacity: isCaptchaValid && !isLocked ? 1 : 0.6,
            cursor: isCaptchaValid && !isLocked ? "pointer" : "not-allowed",
            marginTop: "15px"
          }}
          onClick={() => handleLogin("student")}
          disabled={!isCaptchaValid || isLocked}
        >
          👤 Login as Student
        </button>

        <button
          style={{
            ...btnStyle("#111827"),
            opacity: isCaptchaValid && !isLocked ? 1 : 0.6,
            cursor: isCaptchaValid && !isLocked ? "pointer" : "not-allowed"
          }}
          onClick={() => handleLogin("teacher")}
          disabled={!isCaptchaValid || isLocked}
        >
          👨‍🏫 Login as Teacher
        </button>

        <button
          style={{
            ...btnStyle("#e5e7eb", "black", true)
          }}
          onClick={() => navigate("/signup")}
          disabled={isLocked}
        >
          ✏️ Create Account
        </button>

        <div style={{
          marginTop: "20px",
          padding: "20px",
          background: "#f0f9ff",
          borderRadius: "12px",
          fontSize: "13px",
          color: "#374151",
          lineHeight: "1.6"
        }}>
          <strong>Demo Credentials</strong>
          <div style={{ marginTop: "10px", textAlign: "left" }}>
            <p style={{ margin: "0 0 6px 0" }}>
              <strong>Student:</strong> sindhu@gmail.com / Ss@123456
            </p>
            <p style={{ margin: "0 0 6px 0" }}>
              <strong>Teacher:</strong> sneha@gmail.com / Ss@12345
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginTop: "12px" }}>
            <button
              type="button"
              onClick={() => handleFillDemo("student")}
              style={{
                ...btnStyle("#0f766e"),
                width: "100%",
                minWidth: "0",
                marginTop: "0"
              }}
            >
              Use Student Demo
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo("teacher")}
              style={{
                ...btnStyle("#111827"),
                width: "100%",
                minWidth: "0",
                marginTop: "0"
              }}
            >
              Use Teacher Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "14px",
  fontWeight: "500",
  color: "#374151"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "2px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "14px",
  boxSizing: "border-box",
  transition: "border-color 0.3s ease"
};

const btnStyle = (bg, color = "white", isGhost = false) => ({
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  background: isGhost ? "transparent" : bg,
  color: isGhost ? "#374151" : color,
  border: isGhost ? "2px solid #d1d5db" : "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "15px",
  transition: "all 0.3s ease"
});

export default Login;