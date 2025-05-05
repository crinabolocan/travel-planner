import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/authApi";
// import AOS from "aos";
// import "aos/dist/aos.css";

import "../styles/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authApi.post("/login", { username, password });
      localStorage.setItem("token", response.data.token);
      alert("Login reușit!");
      navigate("/dashboard");
    } catch (error) {
      alert("Login eșuat");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <h2 className="login-title">Welcome Back!</h2>
          <p className="login-subtitle">Login to continue your journey.</p>

          <form onSubmit={handleLogin}>
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

            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
            </div>

            <button type="submit" className="login-button">Login</button>
          </form>
        </div>

        <div className="login-right">
          <div className="register_container">
            <h2>Start your journey now</h2>
            <p>If you don’t have an account yet, sign up and explore the world.</p>
            <button className="register-button" onClick={() => navigate("/register")}>Register</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
