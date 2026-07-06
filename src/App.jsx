import React, { useEffect, useState } from "react";
import api from "./api";
import Dashboard from "./components/Dashboard";

// No login screen — the panel signs itself in on load using the admin
// credentials in .env (VITE_ADMIN_USERNAME / VITE_ADMIN_PASSWORD) and then
// goes straight to the dashboard. Make sure that user has role: "admin" in
// MongoDB (see backend README).
export default function App() {
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const autoLogin = async () => {
      const username = import.meta.env.VITE_ADMIN_USERNAME;
      const password = import.meta.env.VITE_ADMIN_PASSWORD;

      if (!username || !password) {
        setError(
          "VITE_ADMIN_USERNAME / VITE_ADMIN_PASSWORD are not set in .env — the panel has no credentials to sign in with."
        );
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.post("/auth/login", { username, password });

        if (data.user.role !== "admin") {
          setError("The configured account does not have admin access.");
          setLoading(false);
          return;
        }

        localStorage.setItem("mishicoin_admin_token", data.token);
        setAdmin(data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Auto sign-in failed. Check the API and credentials.");
      } finally {
        setLoading(false);
      }
    };

    autoLogin();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <p className="text-slate-400 text-sm">Loading Mishicoin Admin…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <p className="text-danger text-sm bg-danger/10 border border-danger/30 rounded-lg px-4 py-3">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return <Dashboard admin={admin} />;
}
