import React, { useState, useEffect } from "react";

const INITIAL_STOCKS = [
  { symbol: "AAPL.sol", name: "Apple Inc. (Tokenized)", basePrice: 185.50, change: "+2.4%", description: "Токенизированные акции Apple на Solana." },
  { symbol: "TSLA.sol", name: "Tesla, Inc. (Tokenized)", basePrice: 240.20, change: "-1.1%", description: "Электромобили и чистая энергия в ончейне." },
  { symbol: "SPY.sol", name: "S&P 500 ETF (Tokenized)", basePrice: 510.00, change: "+0.8%", description: "Широкий рынок акций США (ETF)." },
];

export default function Market({ onBuyStock, balance }) {
  const [stocks, setStocks] = useState(INITIAL_STOCKS);
  const [selectedStock, setSelectedStock] = useState(INITIAL_STOCKS[0]);
  const [isLive, setIsLive] = useState(false);

  // Симуляция получения "живых" рыночных данных из бесплатных публичных API (например, CoinGecko для SOL или котировок)
  useEffect(() => {
    const fetchLivePrices = async () => {
      try {
        // Запрос к публичному API CoinGecko для получения реальной цены Solana (SOL)
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
        const data = await res.json();
        if (data && data.solana) {
          const solUsd = data.solana.usd;
          // Немного скорректируем цены акций для демонстрации живого рынка
          setStocks(prev => prev.map(s => ({
            ...s,
            price: +(s.basePrice + (solUsd % 5)).toFixed(2)
          })));
          setIsLive(true);
        }
      } catch (e) {
        // Если API недоступно, оставляем базовые цены
        setStocks(INITIAL_STOCKS.map(s => ({ ...s, price: s.basePrice })));
      }
    };

    fetchLivePrices();
    const interval = setInterval(fetchLivePrices, 15000); // обновление каждые 15 сек
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Список активов */}
      <div className="md:col-span-1 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-3 backdrop-blur-md">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Рынок активов</h3>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${isLive ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-yellow-500/20 text-yellow-400"}`}>
            {isLive ? "● Live RPC" : "Demo Mode"}
          </span>
        </div>

        {stocks.map((stock) => (
          <div 
            key={stock.symbol}
            onClick={() => setSelectedStock(stock)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${selectedStock.symbol === stock.symbol ? "bg-purple-950/40 border-purple-500/50 shadow-lg shadow-purple-950/50" : "bg-slate-950/40 border-slate-800/80 hover:border-slate-700"}`}
          >
            <div>
              <h4 className="font-semibold text-white text-sm">{stock.symbol}</h4>
              <p className="text-xs text-slate-400">{stock.name.split(" ")[0]}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-white text-sm">${stock.price || stock.basePrice}</p>
              <p className={`text-xs ${stock.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                {stock.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Детали и покупка */}
      <div className="md:col-span-2 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6 backdrop-blur-md flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedStock.symbol}</h2>
              <p className="text-sm text-slate-400">{selectedStock.name}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-white">${selectedStock.price || selectedStock.basePrice}</span>
              <span className={`block text-xs font-medium ${selectedStock.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                24h: {selectedStock.change}
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-300 bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
            {selectedStock.description}
          </p>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 h-48 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent"></div>
            <div className="text-center space-y-1">
              <p className="text-xs font-mono text-purple-400 uppercase tracking-widest">Solana Mainnet On-Chain Feed</p>
              <div className="flex items-end justify-center gap-1.5 h-24 pt-4">
                <div className="w-3 bg-purple-600/40 h-12 rounded-t"></div>
                <div className="w-3 bg-purple-600/60 h-18 rounded-t"></div>
                <div className="w-3 bg-purple-600/50 h-14 rounded-t"></div>
                <div className="w-3 bg-purple-600/80 h-22 rounded-t"></div>
                <div className="w-3 bg-purple-500 h-28 rounded-t"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400 px-1">
            <span>Ваш баланс: <strong className="text-white">{balance !== null ? `${balance} SOL` : "0 SOL"}</strong></span>
            <span>Сеть: Solana Mainnet</span>
          </div>
          <button 
            onClick={() => onBuyStock({ ...selectedStock, price: selectedStock.price || selectedStock.basePrice })}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-purple-600/25 transition-all transform hover:scale-[1.01]"
          >
            Купить актив за ${(selectedStock.price || selectedStock.basePrice)}
          </button>
        </div>
      </div>
    </div>
  );
}