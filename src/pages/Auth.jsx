import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";

const Auth = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [mode, setMode] = useState("login"); 
  const { login, signup, appState } = useContext(AppContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (mode === "login") {
    const user = await login(form);
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  } else {
    const user = await signup(form);
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }
};

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="border p-4 shadow-sm" style={{ width: "100%", maxWidth: "420px", borderRadius: "10px" }}>
        
        
        {/* Title */}
        <h4 className="fw-bold text-center mb-1">
          {mode === "login" ? "Sign in" : "Create account"}
        </h4>
        <p className="text-muted text-center mb-4">
          {mode === "login"
            ? "Welcome back to EliteStore"
            : "Join EliteStore and start shopping today"}
        </p>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4 justify-content-center">
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${mode === "login" ? "active" : ""}`}
              onClick={() => setMode("login")}
            >
              Login
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${mode === "signup" ? "active" : ""}`}
              onClick={() => setMode("signup")}
            >
              Signup
            </button>
          </li>
        </ul>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="mb-3">
              <label className="form-label fw-semibold">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your full name"
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className={`btn w-100 fw-semibold ${
              mode === "login" ? "btn-dark" : "btn-warning text-dark"
            }`}
            disabled={appState.loading}
          >
            {appState.loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
