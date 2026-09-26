import React, { useState } from "react";
import WalletControl from "./WalletControl";
import WalletActivity from "./WalletActivity";

export default function App() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [rpcStatus, setRpcStatus] = useState("Connected");

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold tracking-tight">Solana Wallet Dashboard</h1>
          <WalletControl 
            wallet={wallet} 
            setWallet={setWallet} 
            setBalance={setBalance} 
            setRpcStatus={setRpcStatus} 
          />
        </header>

        <main className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-2 text-slate-300">Состояние кошелька</h2>
            <div className="space-y-2 text-sm text-slate-400">
              <p><strong>Адрес:</strong> {wallet ? wallet : "Не подключен"}</p>
              <p><strong>Баланс:</strong> {balance !== null ? `${balance} SOL` : "—"}</p>
              <p><strong>Статус RPC:</strong> <span className="text-green-400">{rpcStatus}</span></p>
            </div>
          </div>

          {wallet && <WalletActivity wallet={wallet} />}
        </main>
      </div>
    </div>
  );
}