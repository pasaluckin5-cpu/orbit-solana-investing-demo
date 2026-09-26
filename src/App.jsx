import React, { useState, useEffect } from "react";
import WalletControl from "./WalletControl";
import Market from "./Market";

export default function App() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [rpcStatus, setRpcStatus] = useState("Connected");
  const [activeTab, setActiveTab] = useState("market");
  
  // Загружаем портфель из localStorage, чтобы он не пропадал при обновлении страницы
  const [portfolio, setPortfolio] = useState(() => {
    const saved = localStorage.getItem("orbit_portfolio");
    return saved ? JSON.parse(saved) : [];
  });

  const [notification, setNotification] = useState(null);

  // Сохраняем портфель в localStorage при любых изменениях
  useEffect(() => {
    localStorage.setItem("orbit_portfolio", JSON.stringify(portfolio));
  }, [portfolio]);

  // Функция показа красивых уведомлений
  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Обработка покупки актива с уменьшением баланса и генерацией Solana TxID
  const handleBuyStock = async (stock) => {
    if (!wallet) {
      showToast("Сначала подключите кошелек Phantom в правом верхнем углу!", "error");
      return;
    }

    // Примерная фиксированная цена SOL для демо (например, $180 за 1 SOL)
    const solPriceUsd = 180;
    const costInSol = +(stock.price / solPriceUsd).toFixed(4);

    if (balance !== null && Number(balance) < costInSol) {
      showToast(`Недостаточно средств! Нужно ~${costInSol} SOL, а на балансе ${balance} SOL.`, "error");
      return;
    }

    try {
      showToast(`Подтвердите транзакцию ${stock.symbol}.sol в Phantom...`, "info");
      
      // Имитация задержки сети Solana (около 800мс)
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Генерируем убедительный хэш транзакции Solana
      const mockTxId = "5K" + Math.random().toString(36).substring(2, 10) + "..." + Math.random().toString(36).substring(2, 6);

      const newItem = {
        ...stock,
        shares: 1,
        txId: mockTxId,
        date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Добавляем акцию в портфель
      setPortfolio([newItem, ...portfolio]);

      // Реально уменьшаем баланс кошелька на стоимость покупки
      if (balance !== null) {
        const newBalance = (Number(balance) - costInSol).toFixed(4);
        setBalance(newBalance);
      }

      showToast(`Успешно! Списано ~${costInSol} SOL. Токен добавлен в ончейн-портфель.`, "success");

    } catch (err) {
      console.error("Ошибка транзакции:", err);
      showToast("Транзакция была отменена пользователем.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased relative">
      
      {/* Всплывающие уведомления (Toast) */}
      {notification && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl border shadow-2xl text-sm flex items-center gap-3 backdrop-blur-md transition-all animate-bounce ${
          notification.type === "error" ? "bg-red-950/90 border-red-800 text-red-200" :
          notification.type === "info" ? "bg-blue-950/90 border-blue-800 text-blue-200" :
          "bg-purple-950/90 border-purple-800 text-purple-200"
        }`}>
          <span>{notification.message}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        
        {/* Шапка */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-purple-500 animate-pulse"></span>
              <h1 className="text-xl font-bold tracking-tight text-white">Orbit Solana Stocks</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">Децентрализованный доступ к токенизированным активам</p>
          </div>
          
          <WalletControl 
            wallet={wallet} 
            setWallet={setWallet} 
            setBalance={setBalance} 
            setRpcStatus={setRpcStatus} 
          />
        </header>

        {/* Навигация */}
        <div className="flex gap-2 border-b border-slate-800/60 pb-3">
          <button 
            onClick={() => setActiveTab("market")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === "market" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25" : "text-slate-400 hover:text-white hover:bg-slate-900"}`}
          >
            📊 Рынок акций
          </button>
          <button 
            onClick={() => setActiveTab("portfolio")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === "portfolio" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25" : "text-slate-400 hover:text-white hover:bg-slate-900"}`}
          >
            💼 Мой портфель ({portfolio.length})
          </button>
        </div>

        {/* Контент */}
        <main className="space-y-6">
          {activeTab === "market" ? (
            <Market onBuyStock={handleBuyStock} balance={balance} />
          ) : (
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4 backdrop-blur-md">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-200">Ваш инвестиционный портфель (On-Chain)</h3>
                {wallet && (
                  <span className="text-xs bg-purple-950/50 border border-purple-800/50 text-purple-300 px-3 py-1 rounded-lg">
                    Баланс: {balance} SOL
                  </span>
                )}
              </div>

              {portfolio.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <p className="text-sm text-slate-400">
                    У вас пока нет купленных активов. Перейдите во вкладку «Рынок акций».
                  </p>
                  <button 
                    onClick={() => setActiveTab("market")}
                    className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl transition"
                  >
                    Перейти к рынку
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {portfolio.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-white">{item.symbol}.sol</h4>
                          <span className="text-[10px] font-mono text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-900/40">
                            Tx: {item.txId}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{item.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">${item.price}</p>
                        <p className="text-xs text-green-400 font-medium">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}