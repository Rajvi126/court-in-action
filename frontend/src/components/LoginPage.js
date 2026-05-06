import React, { useState } from "react";
import "./LoginPage.css";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    setLoading(true);

    const endpoint = isRegister ? "register" : "login";

    try {
      const response = await fetch(`http://127.0.0.1:8000/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegister) {
          alert("Registered successfully! Please login.");
          setIsRegister(false);
        } else {
          localStorage.setItem("username", username);
          onLogin(username);
        }
      } else {
        alert(data.detail);
      }
    } catch (err) {
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">⚖️</div>

        <h1 className="login-title">Court In Action</h1>
        <p className="login-subtitle">AI Legal Judgment Analyzer</p>

        <div className="auth-toggle">
          <button
            className={!isRegister ? "active" : ""}
            onClick={() => setIsRegister(false)}
          >
            Login
          </button>

          <button
            className={isRegister ? "active" : ""}
            onClick={() => setIsRegister(true)}
          >
            Sign Up
          </button>
        </div>

        <label>Username</label>
        <input
          className="login-input"
          placeholder="e.g. rajvi"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Password</label>
        <input
          className="login-input"
          type="password"
          placeholder="Enter secure password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleAuth}>
          {loading
            ? "Processing..."
            : isRegister
            ? "Create Account"
            : "Sign in to Dashboard →"}
        </button>

        <p
          className="login-toggle-text"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "Already have an account? Login"
            : "New user? Sign up"}
        </p>
      </div>

      <p className="login-footer">
        AI-generated reports. Human verification recommended.
      </p>
    </div>
  );
}

export default LoginPage; 