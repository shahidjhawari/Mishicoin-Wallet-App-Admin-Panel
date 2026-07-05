import React, { useState } from "react";
import LoginGate from "./components/LoginGate";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [admin, setAdmin] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("mishicoin_admin_token");
    setAdmin(null);
  };

  if (!admin) {
    return <LoginGate onLogin={setAdmin} />;
  }

  return <Dashboard admin={admin} onLogout={handleLogout} />;
}
