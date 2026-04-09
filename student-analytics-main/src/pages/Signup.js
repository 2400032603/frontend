import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Could not create account");
        return;
      }

      alert("Account created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Unable to create account, please try again.");
    }
  };

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSignup}>
        <input name="name" placeholder="Name" required onChange={handleChange} /><br/><br/>
        <input name="email" placeholder="Email" required onChange={handleChange} /><br/><br/>
        <input type="password" name="password" placeholder="Password" required onChange={handleChange} /><br/><br/>

        <select name="role" onChange={handleChange}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select><br/><br/>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;