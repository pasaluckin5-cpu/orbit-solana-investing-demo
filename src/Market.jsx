import React, { useState } from "react";

const STOCKS = [
  { symbol: "AAPL.sol", name: "Apple Inc. (Tokenized)", price: 185.50, change: "+2.4%", description: "Акции технологического гиганта Apple, токенизированные на блокчейне Solana." },
  { symbol: "TSLA.sol", name: "Tesla, Inc. (Tokenized)", price: 240.20, change: "-1.1%", description: "Инновационные электромобили и энергетика в вашем ончейн-портфеле." },
  { symbol: "SPY.sol", name: "S&P 500 ETF (Tokenized)", price: 510.00, change: "+0.8%", description: "Широкий рынок акций США в одном защищенном DeFi-активе." },
];

export default function Market({ onBuyStock }) {
  const [selectedStock, setSelectedStock] = useState(STOCKS[0]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Список активов (слева) */}
      <div className="md:col-span-1 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-3 backdrop-blur-md">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Доступные активы</h3>
        {STOCKS.map((stock) => (
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
              <p className="font-medium text-white text-sm">${stock.price}</p>
              <p className={`text-xs ${stock.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                {stock.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Детальный просмотр и покупка (справа) */}
      <div className="md:col-span-2 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6 backdrop-blur-md flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedStock.symbol}</h2>
              <p className="text-sm text-slate-400">{selectedStock.name}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-white">${selectedStock.price}</span>
              <span className={`block text-xs font-medium ${selectedStock.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                За 24 часа: {selectedStock.change}
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-300 bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
            {selectedStock.description}
          </p>

          {/* Имидж-блок графика */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 h-48 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent"></div>
            <div className="text-center space-y-1">
              <p className="text-xs font-mono text-purple-400 uppercase tracking-widest">Ончейн-котировки Solana Mainnet</p>
              <div className="flex items-end justify-center gap-1.5 h-24 pt-4">
                <div className="w-3 bg-purple-600/40 h-10 rounded-t"></div>
                <div className="w-3 bg-purple-600/60 h-16 rounded-t"></div>
                <div className="w-3 bg-purple-600/50 h-12 rounded-t"></div>
                <div className="w-3 bg-purple-600/80 h-20 rounded-t"></div>
                <div className="w-3 bg-purple-500 h-28 rounded-t"></div>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => onBuyStock(selectedStock)}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-purple-600/25 transition-all transform hover:scale-[1.01]"
        >
          Купить 1 токен {selectedStock.symbol} за ${selectedStock.price}
        </button>
      </div>
    </div>
  );
}