import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/authApi";

import "../styles/Login.css"; // folosește același stil ca Login

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await authApi.post("/register", { username, password });
      alert("Înregistrare reușită!");
      navigate("/dashboard");
    } catch (err) {
      alert("Eroare la înregistrare: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <h2 className="login-title">Create an account</h2>
          <p className="login-subtitle">Register to plan your journeys with us.</p>

          <form onSubmit={handleRegister}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <i className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"}`} />
              </span>
            </div>

            <button type="submit" className="login-button">Register</button>
          </form>
        </div>

        <div className="login-right">
          <div className="register_container">
            <h2>Already have an account?</h2>
            <p>Login and continue planning your next adventure.</p>
            <button className="register-button" onClick={() => navigate("/login")}>
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
