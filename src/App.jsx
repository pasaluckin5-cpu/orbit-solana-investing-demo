import React, { useState } from "react";
import Market from "./Market";

export default function App() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [activeTab, setActiveTab] = useState("market"); // "market" или "portfolio"
  const [portfolio, setPortfolio] = useState([]);

  const connectWallet = () => {
    setWallet("DemoWallet11111111111111111111111111111");
    setBalance(145.50); // в USDC / SOL эквиваленте
  };

  const disconnectWallet = () => {
    setWallet(null);
    setBalance(null);
    setPortfolio([]);
  };

  const handleBuyStock = (stock) => {
    if (!wallet) {
      alert("Сначала подключите кошелек!");
      return;
    }
    // Добавляем акцию в портфель пользователя
    setPortfolio([...portfolio, { ...stock, shares: 1 }]);
    alert(`Вы успешно приобрели 1 ${stock.symbol}!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Шапка */}
        <header className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-purple-400">Orbit Solana Stocks</h1>
            <p className="text-xs text-slate-400">Децентрализованный доступ к мировым активам</p>
          </div>
          <div>
            {wallet ? (
              <div className="flex items-center gap-3">
                <span className="text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
                  {balance} USDC
                </span>
                <button 
                  onClick={disconnectWallet}
                  className="bg-red-600/80 hover:bg-red-600 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <button 
                onClick={connectWallet}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition shadow-lg shadow-purple-600/20"
              >
                Подключить кошелек
              </button>
            )}
          </div>
        </header>

        {/* Навигация по вкладкам */}
        {wallet && (
          <div className="flex gap-2 border-b border-slate-800 pb-2">
            <button 
              onClick={() => setActiveTab("market")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === "market" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"}`}
            >
              Рынок акций
            </button>
            <button 
              onClick={() => setActiveTab("portfolio")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === "portfolio" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"}`}
            >
              Мой портфель ({portfolio.length})
            </button>
          </div>
        )}

        {/* Основной контент */}
        <main className="space-y-6">
          {!wallet ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-4">
              <h2 className="text-xl font-semibold text-white">Добро пожаловать в Orbit</h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Инвестируйте в токенизированные акции США и ETF с помощью Solana и USDC без лишних комиссий и бюрократии.
              </p>
              <button 
                onClick={connectWallet}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-2.5 rounded-xl text-sm font-medium transition shadow-lg shadow-purple-600/20"
              >
                Начать работу
              </button>
            </div>
          ) : activeTab === "market" ? (
            <Market onSelectStock={handleBuyStock} />
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
              <h3 className="text-lg font-semibold text-slate-200">Ваш инвестиционный портфель</h3>
              {portfolio.length === 0 ? (
                ο (
                  <p className="text-sm text-slate-400">У вас пока нет купленных активов. Перейдите на вкладку «Рынок акций», чтобы совершить первую сделку.</p>
                )
              ) : (
                <div className="space-y-3">
                  {portfolio.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-slate-950/50 border border-slate-800 rounded-lg">
                      <div>
                        <h4 className="font-medium text-white">{item.symbol}</h4>
                        <p className="text-xs text-slate-400">{item.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">{item.price}</p>
                        <p className="text-xs text-green-400">Количество: {item.shares}</p>
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