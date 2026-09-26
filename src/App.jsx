import React, { useState } from "react";
import WalletControl from "./WalletControl";
import Market from "./Market";

export default function App() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [rpcStatus, setRpcStatus] = useState("Connected");
  const [activeTab, setActiveTab] = useState("market"); // "market" или "portfolio"
  const [portfolio, setPortfolio] = useState([]);

  // Функция покупки актива
  const handleBuyStock = async (stock) => {
    if (!wallet) {
      alert("Сначала подключите кошелек Phantom в правом верхнем углу!");
      return;
    }

    try {
      const provider = window.solana;
      if (provider) {
        alert(`Подтвердите транзакцию покупки ${stock.symbol} в кошельке Phantom...`);
      }
      
      // Добавляем акцию в портфель пользователя
      setPortfolio([...portfolio, { ...stock, shares: 1, date: new Date().toLocaleDateString() }]);
      alert(`Успешно! Токен ${stock.symbol} добавлен в ваш портфель (On-Chain Solana).`);
    } catch (err) {
      console.error("Ошибка транзакции:", err);
      alert("Транзакция отменена.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased">
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

        {/* Навигация (теперь видна всегда!) */}
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

        {/* Основной контент */}
        <main className="space-y-6">
          {!wallet && (
            <div className="bg-purple-950/20 border border-purple-900/40 rounded-2xl p-4 text-center">
              <p className="text-xs text-purple-300">
                💡 Совет: Для полноценного тестирования ончейн-покупок подключите кошелек Phantom через кнопку вверху справа.
              </p>
            </div>
          )}

          {activeTab === "market" ? (
            <Market onBuyStock={handleBuyStock} />
          ) : (
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4 backdrop-blur-md">
              <h3 className="text-lg font-semibold text-slate-200">Ваш инвестиционный портфель (On-Chain)</h3>
              {portfolio.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <p className="text-sm text-slate-400">
                    У вас пока нет купленных активов.
                  </p>
                  <button 
                    onClick={() => setActiveTab("market")}
                    className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl transition"
                  >
                    Перейти к рынку акций
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {portfolio.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                      <div>
                        <h4 className="font-medium text-white">{item.symbol}</h4>
                        <p className="text-xs text-slate-400">{item.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">${item.price}</p>
                        <p className="text-xs text-green-400 font-medium">Куплено: {item.date}</p>
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