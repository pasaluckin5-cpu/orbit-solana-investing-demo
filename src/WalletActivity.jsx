import React from "react";

export default function WalletActivity({ wallet }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-3 text-slate-300">История транзакций</h3>
      <p className="text-sm text-slate-400">
        Последние операции для кошелька <span className="text-slate-200">{wallet}</span> пока не загружены или отсутствуют.
      </p>
    </div>
  );
}