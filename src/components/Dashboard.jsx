import React, { useState } from "react";
import DepositsTable from "./DepositsTable";
import WithdrawalsTable from "./WithdrawalsTable";
import SettingsPanel from "./SettingsPanel";

const TABS = [
  { key: "deposits", label: "Deposits" },
  { key: "withdrawals", label: "Withdrawals" },
  { key: "settings", label: "Settings" },
];

export default function Dashboard({ admin }) {
  const [activeTab, setActiveTab] = useState("deposits");

  return (
    <div className="min-h-screen bg-ink text-white">
      {/* Header */}
      <header className="border-b border-line px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-coin flex items-center justify-center font-display font-bold text-ink text-sm">
            M
          </div>
          <span className="font-display text-lg tracking-tight">
            Mishicoin <span className="text-coin">Admin</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">{admin?.username}</span>
        </div>
      </header>

      {/* Tab bar */}
      <div className="border-b border-line px-6">
        <div className="max-w-6xl mx-auto flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-coin text-coin"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === "deposits" && <DepositsTable />}
        {activeTab === "withdrawals" && <WithdrawalsTable />}
        {activeTab === "settings" && <SettingsPanel />}
      </main>
    </div>
  );
}
