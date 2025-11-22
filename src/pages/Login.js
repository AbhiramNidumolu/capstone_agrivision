// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("Student");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.endsWith("@vitapstudent.ac.in")) {
      alert("Please login using your campus email ID.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/users/login/`, {
        ...form,
        role,
      },
      { headers: { "Content-Type": "application/json" } });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      alert(`Welcome ${role}! Login successful.`);
      navigate("/dashboard");
    } catch (err) {
      // Show full backend error message including detail and full data (for debugging)
      alert("Login failed: " + (err.response?.data?.error ||
       JSON.stringify(err.response?.data) ||
       err.response?.data ||
       err.message));
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-image">
        <img src="/crops.png" alt="Crop Illustration" />
      </div>

      <div className="container signup-form">
        <h1>Login</h1>
        <div className="role-buttons">
          {["Student", "Staff", "Admin"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`role-btn ${role === r ? "active" : ""}`}
            >
              {r}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Campus Email (e.g., user@college.edu)"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don’t have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
