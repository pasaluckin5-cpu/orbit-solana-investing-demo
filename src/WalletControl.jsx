import React from "react";

export default function WalletControl({ wallet, setWallet, setBalance, setRpcStatus }) {
  
  const connectRealWallet = async () => {
    try {
      const provider = window.solana;
      if (!provider || !provider.isPhantom) {
        alert("Кошелек Phantom не найден! Установите расширение с официального сайта.");
        window.open("https://phantom.app/", "_blank");
        return;
      }

      const response = await provider.connect();
      const publicKeyStr = response.publicKey.toString();
      
      setWallet(publicKeyStr);
      setRpcStatus("Mainnet Connected");

      // Запрос реального баланса кошелька через публичный RPC Solana
      try {
        const res = await fetch("https://api.mainnet-beta.solana.com", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getBalance",
            params: [publicKeyStr]
          })
        });
        const data = await res.json();
        if (data.result && typeof data.result.value === "number") {
          // Переводим лампорты в SOL (1 SOL = 1,000,000,000 лампортов)
          const solBalance = (data.result.value / 1e9).toFixed(4);
          setBalance(solBalance);
        } else {
          setBalance(1.50); // резервное значение для демо
        }
      } catch (e) {
        setBalance(1.50);
      }

    } catch (err) {
      console.error("Ошибка подключения:", err);
    }
  };

  const disconnectRealWallet = async () => {
    try {
      if (window.solana) {
        await window.solana.disconnect();
      }
      setWallet(null);
      setBalance(null);
      setRpcStatus("Disconnected");
    } catch (err) {
      console.error("Ошибка отключения:", err);
    }
  };

  return (
    <div>
      {wallet ? (
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl shadow-lg">
          <div className="text-left">
            <p className="text-xs text-slate-400">Кошелек:</p>
            <p className="text-xs font-mono text-purple-400">
              {wallet.slice(0, 4)}...{wallet.slice(-4)}
            </p>
          </div>
          <button 
            onClick={disconnectRealWallet}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-medium transition"
          >
            Выйти
          </button>
        </div>
      ) : (
        <button 
          onClick={connectRealWallet}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-purple-600/25 transition-all transform hover:scale-[1.02]"
        >
          Подключить кошелек
        </button>
      )}
    </div>
  );
}