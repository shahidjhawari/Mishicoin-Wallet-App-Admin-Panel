import React, { useEffect, useState, useCallback } from "react";
import api from "../api";

const PAYMENT_LABELS = {
  EasyPaisa: "EasyPaisa",
  JazzCash: "JazzCash",
  BankTransfer: "Bank Transfer",
  Other: "Other",
};

export default function WithdrawalsTable() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");

  const fetchWithdrawals = useCallback(async () => {
    setError("");
    try {
      const { data } = await api.get("/admin/pending-withdrawals");
      setWithdrawals(data.withdrawals);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load pending withdrawals.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  const handleDecision = async (id, action) => {
    setActionId(id);
    setError("");
    try {
      await api.put(`/admin/${action}-withdrawal/${id}`);
      setWithdrawals((prev) => prev.filter((w) => w._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} this withdrawal.`);
    } finally {
      setActionId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl">Pending Withdrawal Requests</h1>
          <p className="text-sm text-slate-400 mt-1">
            {loading ? "Loading..." : `${withdrawals.length} awaiting review`}
          </p>
        </div>
        <button
          onClick={fetchWithdrawals}
          className="text-sm border border-line rounded-lg px-3 py-2 hover:border-coin hover:text-coin transition-colors"
        >
          Refresh
        </button>
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
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Account Name</th>
                <th className="px-4 py-3">Account / Mobile Number</th>
                <th className="px-4 py-3">Payment Method</th>
                <th className="px-4 py-3">Requested</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                    Loading pending withdrawals...
                  </td>
                </tr>
              )}

              {!loading && withdrawals.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                    No pending withdrawal requests right now.
                  </td>
                </tr>
              )}

              {!loading &&
                withdrawals.map((w) => (
                  <tr key={w._id} className="border-b border-line/60 hover:bg-ink/40">
                    <td className="px-4 py-3">
                      <div>{w.user?.username || "—"}</div>
                      <div className="text-xs text-slate-500">{w.user?.email}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-coin">
                      {Number(w.amount).toLocaleString()} coins
                    </td>
                    <td className="px-4 py-3 text-slate-300">{w.accountName}</td>
                    <td className="px-4 py-3 text-slate-300">{w.accountNumber}</td>
                    <td className="px-4 py-3 text-slate-300">
                      {PAYMENT_LABELS[w.paymentMethod] || w.paymentMethod}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {new Date(w.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDecision(w._id, "approve")}
                        disabled={actionId === w._id}
                        className="bg-mint/10 text-mint border border-mint/40 rounded-lg px-3 py-1.5 text-xs font-semibold mr-2 hover:bg-mint/20 transition-colors disabled:opacity-50"
                      >
                        {actionId === w._id ? "..." : "Approve"}
                      </button>
                      <button
                        onClick={() => handleDecision(w._id, "reject")}
                        disabled={actionId === w._id}
                        className="bg-danger/10 text-danger border border-danger/40 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-danger/20 transition-colors disabled:opacity-50"
                      >
                        {actionId === w._id ? "..." : "Reject"}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-3">
        Rejecting a withdrawal automatically refunds the reserved amount back to the user's wallet.
      </p>
    </div>
  );
}
