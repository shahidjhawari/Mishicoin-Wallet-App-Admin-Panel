import React, { useEffect, useState, useCallback } from "react";
import api, { API_BASE_URL } from "../api";

const PAYMENT_LABELS = {
  EasyPaisa: "EasyPaisa",
  JazzCash: "JazzCash",
  BankTransfer: "Bank Transfer",
  Other: "Other",
};

const resolveImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const host = API_BASE_URL.replace(/\/api$/, "");
  return `${host}${url}`;
};

export default function DepositsTable() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchDeposits = useCallback(async () => {
    setError("");
    try {
      const { data } = await api.get("/admin/pending-deposits");
      setDeposits(data.deposits);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load pending deposits.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeposits();
  }, [fetchDeposits]);

  const handleDecision = async (id, action) => {
    setActionId(id);
    setError("");
    try {
      await api.put(`/admin/${action}-deposit/${id}`);
      setDeposits((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} this deposit.`);
    } finally {
      setActionId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl">Pending Deposit Requests</h1>
          <p className="text-sm text-slate-400 mt-1">
            {loading ? "Loading..." : `${deposits.length} awaiting review`}
          </p>
        </div>
        <button
          onClick={fetchDeposits}
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
                <th className="px-4 py-3">User Email</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Mobile Number</th>
                <th className="px-4 py-3">Payment Method</th>
                <th className="px-4 py-3">Screenshot</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                    Loading pending deposits...
                  </td>
                </tr>
              )}

              {!loading && deposits.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                    No pending deposits right now. The ledger is clear.
                  </td>
                </tr>
              )}

              {!loading &&
                deposits.map((d) => (
                  <tr key={d._id} className="border-b border-line/60 hover:bg-ink/40">
                    <td className="px-4 py-3">{d.user?.email || "—"}</td>
                    <td className="px-4 py-3 font-semibold text-coin">
                      Rs {Number(d.amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{d.transactionId}</td>
                    <td className="px-4 py-3 text-slate-300">{d.mobileNumber}</td>
                    <td className="px-4 py-3 text-slate-300">
                      {PAYMENT_LABELS[d.paymentMethod] || d.paymentMethod}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setPreviewUrl(resolveImageUrl(d.screenshotUrl))}>
                        <img
                          src={resolveImageUrl(d.screenshotUrl)}
                          alt="Deposit screenshot"
                          className="w-12 h-12 object-cover rounded-lg border border-line hover:border-coin transition-colors"
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDecision(d._id, "approve")}
                        disabled={actionId === d._id}
                        className="bg-mint/10 text-mint border border-mint/40 rounded-lg px-3 py-1.5 text-xs font-semibold mr-2 hover:bg-mint/20 transition-colors disabled:opacity-50"
                      >
                        {actionId === d._id ? "..." : "Approve"}
                      </button>
                      <button
                        onClick={() => handleDecision(d._id, "reject")}
                        disabled={actionId === d._id}
                        className="bg-danger/10 text-danger border border-danger/40 rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-danger/20 transition-colors disabled:opacity-50"
                      >
                        {actionId === d._id ? "..." : "Reject"}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {previewUrl && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50"
          onClick={() => setPreviewUrl(null)}
        >
          <img
            src={previewUrl}
            alt="Screenshot preview"
            className="max-h-[85vh] rounded-xl border border-line"
          />
        </div>
      )}
    </div>
  );
}
