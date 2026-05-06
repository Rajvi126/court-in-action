import React, { useState } from "react";
import "./App.css"; 
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";

function App() {
  const [user, setUser] = useState(
    localStorage.getItem("username") || null
  );

  const handleLogin = (username) => {
    localStorage.setItem("username", username);
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUser(null);
  };

  return user ? (
    <Dashboard username={user} onLogout={handleLogout} />
  ) : (
    <LoginPage onLogin={handleLogin} />
  );
}

export default App; 