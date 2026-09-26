import React from "react";

const STOCKS = [
  { symbol: "AAPL.sol", name: "Apple Inc. (Tokenized)", price: "185.50 USDC", change: "+2.4%" },
  { symbol: "TSLA.sol", name: "Tesla, Inc. (Tokenized)", price: "240.20 USDC", change: "-1.1%" },
  { symbol: "SPY.sol", name: "S&P 500 ETF (Tokenized)", price: "510.00 USDC", change: "+0.8%" },
];

export default function Market({ onSelectStock }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
      <h3 className="text-lg font-semibold text-slate-200">Доступные активы (Токенизированные акции)</h3>
      <div className="space-y-3">
        {STOCKS.map((stock) => (
          <div 
            key={stock.symbol}
            className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800/80 rounded-lg hover:border-purple-500/50 transition cursor-pointer"
            onClick={() => onSelectStock && onSelectStock(stock)}
          >
            <div>
              <h4 className="font-medium text-white">{stock.symbol}</h4>
              <p className="text-xs text-slate-400">{stock.name}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white">{stock.price}</p>
              <p className={`text-xs ${stock.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                {stock.change}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}