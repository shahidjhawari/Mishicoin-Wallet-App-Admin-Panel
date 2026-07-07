import React, { useEffect, useState, useCallback } from "react";
import api from "../api";

const CATEGORY_STYLES = {
  Deposit: "text-mint",
  Withdrawal: "text-danger",
  Earning: "text-coin",
};

const STATUS_STYLES = {
  Pending: "bg-coin/10 text-coin border-coin/30",
  Approved: "bg-mint/10 text-mint border-mint/30",
  Rejected: "bg-danger/10 text-danger border-danger/30",
  Completed: "bg-mint/10 text-mint border-mint/30",
};

const formatAmount = (amount) => {
  const sign = amount < 0 ? "-" : "+";
  return `${sign}$${Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
};

export default function HistoryTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usernameFilter, setUsernameFilter] = useState("");

  const fetchHistory = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await api.get("/admin/wallet-history");
      setTransactions(data.transactions);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load transaction history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filtered = usernameFilter
    ? transactions.filter((t) =>
        (t.user?.username || "").toLowerCase().includes(usernameFilter.toLowerCase())
      )
    : transactions;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl">All Transaction History</h1>
          <p className="text-sm text-slate-400 mt-1">
            {loading ? "Loading..." : `${filtered.length} records — deposits, withdrawals & earnings`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Filter by username..."
            value={usernameFilter}
            onChange={(e) => setUsernameFilter(e.target.value)}
            className="bg-panel border border-line rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-coin transition-colors w-48"
          />
          <button
            onClick={fetchHistory}
            className="text-sm border border-line rounded-lg px-3 py-2 hover:border-coin hover:text-coin transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 text-danger text-sm bg-danger/10 border border-danger/30 rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      <div className="bg-panel border border-line rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-line">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    Loading transaction history...
                  </td>
                </tr>
              )}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    No transactions found.
                  </td>
                </tr>
              )}

              {!loading &&
                filtered.map((t) => (
                  <tr key={`${t.category}-${t.id}`} className="border-b border-line/60 hover:bg-ink/40">
                    <td className="px-4 py-3">
                      <div>{t.user?.username || "—"}</div>
                      <div className="text-xs text-slate-500">{t.user?.email}</div>
                    </td>
                    <td className={`px-4 py-3 font-medium ${CATEGORY_STYLES[t.category] || ""}`}>
                      {t.type}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{t.description}</td>
                    <td
                      className={`px-4 py-3 font-semibold ${
                        t.amount < 0 ? "text-danger" : "text-mint"
                      }`}
                    >
                      {formatAmount(t.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs border rounded-full px-2 py-1 ${
                          STATUS_STYLES[t.status] || "bg-line/30 text-slate-300 border-line"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                      {new Date(t.date).toLocaleString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
