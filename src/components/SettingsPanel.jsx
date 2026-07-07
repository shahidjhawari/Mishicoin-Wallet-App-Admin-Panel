import React, { useEffect, useState } from "react";
import api from "../api";

const FIELD_GROUPS = [
  {
    title: "Mining (Daily Earning)",
    fields: [
      { key: "miningSessionHours", label: "Session length (hours)", step: "1" },
      { key: "miningRatePerHour", label: "Earned per hour ($)", step: "0.01" },
    ],
  },
  {
    title: "Watch Ad Earning",
    fields: [
      { key: "adRewardAmount", label: "Reward per ad watched ($)", step: "0.01" },
      { key: "adDailyLimit", label: "Max ads per day", step: "1" },
    ],
  },
  {
    title: "Referral Earning (3 levels)",
    fields: [
      { key: "referralLevel1Bonus", label: "Level 1 bonus ($) — direct invite", step: "0.01" },
      { key: "referralLevel2Bonus", label: "Level 2 bonus ($)", step: "0.01" },
      { key: "referralLevel3Bonus", label: "Level 3 bonus ($)", step: "0.01" },
    ],
  },
  {
    title: "Withdrawals",
    fields: [{ key: "minWithdrawalAmount", label: "Minimum withdrawal ($)", step: "0.01" }],
  },
];

export default function SettingsPanel() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/admin/settings");
        setForm(data.settings);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSavedMessage("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSavedMessage("");
    try {
      const { data } = await api.put("/admin/settings", form);
      setForm(data.settings);
      setSavedMessage("Settings saved. New rates apply immediately.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-slate-400 text-sm">Loading settings...</p>;
  }

  if (!form) {
    return (
      <div className="text-danger text-sm bg-danger/10 border border-danger/30 rounded-lg px-4 py-2">
        {error || "Unable to load settings."}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl">Earning Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Control mining, ad, referral and withdrawal amounts for the whole app — changes apply immediately, no redeploy needed.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {FIELD_GROUPS.map((group) => (
          <div key={group.title} className="bg-panel border border-line rounded-2xl p-5">
            <h2 className="font-display text-sm text-coin uppercase tracking-wide mb-4">
              {group.title}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {group.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs text-slate-400 mb-1">{field.label}</label>
                  <input
                    type="number"
                    step={field.step}
                    value={form[field.key] ?? ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full bg-ink border border-line rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-coin transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {error && (
          <p className="text-danger text-sm bg-danger/10 border border-danger/30 rounded-lg px-4 py-2">
            {error}
          </p>
        )}
        {savedMessage && (
          <p className="text-mint text-sm bg-mint/10 border border-mint/30 rounded-lg px-4 py-2">
            {savedMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-coin hover:bg-coinSoft transition-colors text-ink font-semibold rounded-lg px-6 py-2.5 text-sm disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
