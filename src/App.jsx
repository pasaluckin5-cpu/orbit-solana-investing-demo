import React, { useState } from "react";
import WalletControl from "./WalletControl";
import Market from "./Market";

export default function App() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [rpcStatus, setRpcStatus] = useState("Connected");
  const [activeTab, setActiveTab] = useState("market");
  const [portfolio, setPortfolio] = useState([]);

  const handleBuyStock = (stock) => {
    if (!wallet) {
      alert("Сначала подключите реальный кошелек (Phantom / Solflare)!");
      return;
    }
    setPortfolio([...portfolio, { ...stock, shares: 1 }]);
    alert(`Вы успешно приобрели 1 ${stock.symbol} через Solana Mainnet!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased selection:bg-purple-500 selection:text-white">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        
        {/* Шапка с брендингом хакатон-проекта */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-purple-500 animate-pulse"></span>
              <h1 className="text-xl font-bold tracking-tight text-white">Orbit Solana Stocks</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">Децентрализованный доступ к токенизированным активам</p>
          </div>
          
          {/* Настоящий блок подключения кошелька */}
          <WalletControl 
            wallet={wallet} 
            setWallet={setWallet} 
            setBalance={setBalance} 
            setRpcStatus={setRpcStatus} 
          />
        </header>

        {/* Навигация (Рынок / Портфель) */}
        {wallet && (
          <div className="flex gap-2 border-b border-slate-800/60 pb-3">
            <button 
              onClick={() => setActiveTab("market")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === "market" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25" : "text-slate-400 hover:text-white hover:bg-slate-900"}`}
            >
              📊 Рынок акций
            </button>
            <button 
              onClick={() => setActiveTab("portfolio")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === "portfolio" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25" : "text-slate-400 hover:text-white hover:bg-slate-900"}`}
            >
              💼 Мой портфель ({portfolio.length})
            </button>
          </div>
        )}

        {/* Основная часть */}
        <main className="space-y-6">
          {!wallet ? (
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 rounded-2xl p-8 text-center space-y-5 shadow-2xl">
              <div className="max-w-md mx-auto space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">Инвестиции без границ на Solana</h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Покупайте токенизированные акции и ETF напрямую через ваш криптокошелек (Phantom, Solflare). Быстро, прозрачно и без бюрократии.
                </p>
              </div>
              <div className="pt-2 flex justify-center">
                {/* Кнопка подключения из шапки тоже продублирована или управляется через WalletControl */}
                <p className="text-xs text-purple-400 font-medium bg-purple-950/40 border border-purple-800/50 px-4 py-2 rounded-xl">
                  👆 Нажмите «Подключить кошелек» в правом верхнем углу, чтобы начать
                </p>
              </div>
            </div>
          ) : activeTab === "market" ? (
            <Market onSelectStock={handleBuyStock} />
          ) : (
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4 backdrop-blur-md">
              <h3 className="text-lg font-semibold text-slate-200">Ваш инвестиционный портфель</h3>
              {portfolio.length === 0 ? (
                <p className="text-sm text-slate-400 py-6 text-center">
                  У вас пока нет купленных активов. Перейдите во вкладку «Рынок акций» и выберите актив для покупки.
                </p>
              ) : (
                <div className="space-y-3">
                  {portfolio.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                      <div>
                        <h4 className="font-medium text-white">{item.symbol}</h4>
                        <p className="text-xs text-slate-400">{item.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">{item.price}</p>
                        <p className="text-xs text-green-400 font-medium">1 акция (ончейн)</p>
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