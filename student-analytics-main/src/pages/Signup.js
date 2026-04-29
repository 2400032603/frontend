import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student"
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔹 Password Strength
  const calculatePasswordStrength = (password) => {
    if (!password) return "";
    if (password.length < 6) return "weak";
    if (password.length < 10) return "medium";
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return "strong";
    return "medium";
  };

  // 🔹 Validation
  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    else if (form.name.length < 3)
      newErrors.name = "Minimum 3 characters";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) newErrors.email = "Email required";
    else if (!emailRegex.test(form.email))
      newErrors.email = "Invalid email";

    if (!form.password) newErrors.password = "Password required";
    else if (form.password.length < 6)
      newErrors.password = "Min 6 characters";

    if (!form.confirmPassword)
      newErrors.confirmPassword = "Confirm password";
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    if (errors[name]) setErrors({ ...errors, [name]: "" });

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  // 🔹 Signup API
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const { confirmPassword, ...signupData } = form;

      const res = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(signupData)
      });

      let data;

      // ✅ Safe JSON parsing
      try {
        data = await res.json();
      } catch {
        data = { message: "Invalid server response" };
      }

      if (!res.ok) {
        setErrors({
          submit: data.message || data.error || "Signup failed"
        });
        setIsSubmitting(false);
        return;
      }

      // ✅ Success
      alert("Account created successfully!");

      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student"
      });

      setPasswordStrength("");

      setTimeout(() => navigate("/"), 500);

    } catch (err) {
      console.error(err);

      setErrors({
        submit: !navigator.onLine
          ? "No internet connection"
          : "Backend not running on http://localhost:4000"
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2>Create Account</h2>

        {errors.submit && <p style={{ color: "red" }}>{errors.submit}</p>}

        <form onSubmit={handleSignup}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          <p style={error}>{errors.name}</p>

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <p style={error}>{errors.email}</p>

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <p style={error}>{errors.password}</p>

          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <p style={error}>{errors.confirmPassword}</p>

          <select name="role" value={form.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          <br /><br />

          <button disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>
        </form>

        <br />

        <button onClick={() => navigate("/")}>
          Already have account? Login
        </button>
      </div>
    </div>
  );
}

// 🔹 Simple styles
const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#0f766e"
};

const card = {
  background: "white",
  padding: "30px",
  borderRadius: "10px",
  width: "300px"
};

const error = {
  color: "red",
  fontSize: "12px"
};

export default Signup;