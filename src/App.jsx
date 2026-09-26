import React, { useState } from "react";

export default function App() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [rpcStatus] = useState("Connected");

  const connectWallet = () => {
    // Демо-подключение для проверки интерфейса
    setWallet("DemoWallet11111111111111111111111111111");
    setBalance(1.45);
  };

  const disconnectWallet = () => {
    setWallet(null);
    setBalance(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold tracking-tight">Solana Wallet Dashboard</h1>
          <div>
            {wallet ? (
              <button 
                onClick={disconnectWallet}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Отключить кошелек
              </button>
            ) : (
              <button 
                onClick={connectWallet}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Подключить кошелек
              </button>
            )}
          </div>
        </header>

        <main className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-2 text-slate-300">Состояние кошелька</h2>
            <div className="space-y-2 text-sm text-slate-400">
              <p><strong>Адрес:</strong> <span className="text-slate-200">{wallet ? wallet : "Не подключен"}</span></p>
              <p><strong>Баланс:</strong> <span className="text-slate-200">{balance !== null ? `${balance} SOL` : "—"}</span></p>
              <p><strong>Статус RPC:</strong> <span className="text-green-400">{rpcStatus}</span></p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}