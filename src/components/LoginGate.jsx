import React, { useState } from "react";
import api from "../api";

// Simple admin login screen. On success it stores the JWT and lifts the
// authenticated user up to App.jsx via onLogin.
export default function LoginGate({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });

      if (data.user.role !== "admin") {
        setError("This account does not have admin access.");
        setLoading(false);
        return;
      }

      localStorage.setItem("mishicoin_admin_token", data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign in. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 rounded-full bg-coin flex items-center justify-center font-display font-bold text-ink">
            M
          </div>
          <span className="font-display text-xl text-white tracking-tight">
            Mishicoin <span className="text-coin">Admin</span>
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-panel border border-line rounded-2xl p-6 shadow-xl"
        >
          <h1 className="font-display text-lg text-white mb-1">Ledger sign-in</h1>
          <p className="text-sm text-slate-400 mb-6">
            Review deposits and settle wallet balances.
          </p>

          <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 bg-ink border border-line rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-coin transition-colors"
            placeholder="admin@mishicoin.com"
          />

          <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 bg-ink border border-line rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-coin transition-colors"
            placeholder="••••••••"
          />

          {error && (
            <p className="text-danger text-sm mb-4 bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-coin hover:bg-coinSoft transition-colors text-ink font-semibold rounded-lg py-2.5 text-sm disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
