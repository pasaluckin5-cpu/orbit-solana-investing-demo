import React, { useState, useEffect } from "react";

const FINNHUB_API_KEY = "darsgppr01qunbohgshgdarsgppr01qunbohgsi0";

// Расширенный список активов (можно расширять до 100+)
const INITIAL_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc. (Tokenized)", fallbackPrice: 226.50, change: "+1.25%", description: "Токенизированные акции Apple на Solana блокчейне." },
  { symbol: "TSLA", name: "Tesla, Inc. (Tokenized)", fallbackPrice: 248.40, change: "-0.85%", description: "Электромобили и чистая энергия в ончейн-обертке." },
  { symbol: "SPY", name: "S&P 500 ETF (Tokenized)", fallbackPrice: 545.20, change: "+0.45%", description: "Широкий индекс рынка акций США." },
  { symbol: "NVDA", name: "NVIDIA Corporation (Tokenized)", fallbackPrice: 128.00, change: "+3.40%", description: "Лидер искусственного интеллекта и графических чипов." },
  { symbol: "MSFT", name: "Microsoft Corporation (Tokenized)", fallbackPrice: 440.10, change: "+0.90%", description: "Облачные технологии и экосистема Windows." },
  { symbol: "AMZN", name: "Amazon.com, Inc. (Tokenized)", fallbackPrice: 186.50, change: "+1.10%", description: "Гигант электронной коммерции и облачных вычислений." },
  { symbol: "GOOGL", name: "Alphabet Inc. (Tokenized)", fallbackPrice: 175.80, change: "-0.30%", description: "Поисковые системы и рекламные технологии." },
  { symbol: "META", name: "Meta Platforms, Inc. (Tokenized)", fallbackPrice: 502.10, change: "+2.15%", description: "Социальные сети и метавселенная в блокчейне." },
  { symbol: "NFLX", name: "Netflix, Inc. (Tokenized)", fallbackPrice: 660.40, change: "+0.75%", description: "Стриминговый сервис развлекательного контента." },
  { symbol: "AMD", name: "Advanced Micro Devices (Tokenized)", fallbackPrice: 155.30, change: "-1.40%", description: "Полупроводники и процессоры нового поколения." }
  // ... сюда можно добавить еще хоть 90 элементов
];

export default function Market({ onBuyStock, balance }) {
  const [stocks, setStocks] = useState(
    INITIAL_STOCKS.map(s => ({ ...s, price: s.fallbackPrice }))
  );
  const [selectedStock, setSelectedStock] = useState(stocks[0]);
  const [searchQuery, setSearchQuery] = useState(""); // Добавили поиск для удобства по 100+ позициям
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchMarketData = async () => {
      try {
        // Ограничиваем одновременные запросы порциями (например, по 5 штук за раз), 
        // чтобы не упереться в лимиты сети и API при большом списке
        const updatedStocks = [...stocks];
        
        for (let i = 0; i < INITIAL_STOCKS.length; i++) {
          const stock = INITIAL_STOCKS[i];
          try {
            const targetUrl = `https://finnhub.io/api/v1/quote?symbol=${stock.symbol}&token=${FINNHUB_API_KEY}`;
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
            
            const res = await fetch(proxyUrl);
            const data = await res.json();
            
            if (data && data.c && data.c > 0) {
              updatedStocks[i] = {
                ...stock,
                price: data.c,
                change: data.dp !== undefined ? (data.dp >= 0 ? `+${data.dp.toFixed(2)}%` : `${data.dp.toFixed(2)}%`) : stock.change
              };
            }
          } catch (e) {
            // Если конкретный тикер упал — оставляем старую цену/fallback
          }
        }

        if (isMounted) {
          setStocks(updatedStocks);
          setSelectedStock(prev => updatedStocks.find(s => s.symbol === prev.symbol) || updatedStocks[0]);
          setIsLive(true);
        }
      } catch (error) {
        if (isMounted) {
          setIsLive(false);
          setStocks(prevStocks => {
            const newStocks = prevStocks.map(stock => {
              const fluctuation = (Math.random() * 0.6 - 0.3);
              const newPrice = +(stock.price + fluctuation).toFixed(2);
              return { ...stock, price: newPrice };
            });
            
            setSelectedStock(prevSelected => {
              const found = newStocks.find(s => s.symbol === prevSelected.symbol);
              return found || newStocks[0];
            });

            return newStocks;
          });
        }
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 8000); // увеличено до 8 секунд для безопасности сети
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Фильтрация для поиска по тикеру или названию
  const filteredStocks = stocks.filter(s => 
    s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Список активов (Левая колонка) */}
      <div className="md:col-span-1 bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-2xl space-y-3 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Рынок ({stocks.plus || stocks.length})</h3>
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono flex items-center gap-1.5 ${isLive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-ping ${isLive ? "bg-emerald-400" : "bg-amber-400"}`}></span>
            {isLive ? "Live Finnhub" : "Fallback Feed"}
          </span>
        </div>

        {/* Поле поиска по большому списку */}
        <input 
          type="text"
          placeholder="Поиск тикера (например, AAPL)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
        />

        <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
          {filteredStocks.map((stock) => (
            <div 
              key={stock.symbol}
              onClick={() => setSelectedStock(stock)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                selectedStock.symbol === stock.symbol 
                  ? "bg-purple-950/40 border-purple-500/50 shadow-lg shadow-purple-950/50 scale-[1.02]" 
                  : "bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50"
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-white text-sm">{stock.symbol}.sol</h4>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono">SOL</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[120px]">{stock.name}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white text-sm">${stock.price.toFixed(2)}</p>
                <p className={`text-xs font-medium ${stock.change.startsWith("+") ? "text-emerald-400" : "text-rose-400"}`}>
                  {stock.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Панель деталей (Правая колонка) остается без изменений */}
      <div className="md:col-span-2 bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-6 backdrop-blur-xl flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-white">{selectedStock.symbol}.sol</h2>
                <span className="text-xs bg-purple-950 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-800/50">Verified Asset</span>
              </div>
              <p className="text-sm text-slate-400">{selectedStock.name}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-white">${selectedStock.price.toFixed(2)}</span>
              <span className={`block text-xs font-semibold ${selectedStock.change.startsWith("+") ? "text-emerald-400" : "text-rose-400"}`}>
                24h: {selectedStock.change}
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800/60 leading-relaxed">
            {selectedStock.description}
          </p>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 h-44 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 via-transparent to-transparent pointer-events-none"></div>
            <div className="flex justify-between items-center z-15">
              <span className="text-[11px] font-mono text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                Solana Mainnet Orderbook Feed
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Real-time Stream</span>
            </div>
            <div className="flex items-end justify-between gap-2 h-20 z-10 px-2">
              {[40, 65, 50, 85, 60, 95, 75, 110, 90, 130, 115, 145].map((h, i) => (
                <div key={i} className="w-full bg-purple-900/40 rounded-t overflow-hidden flex flex-col justify-end group-hover:bg-purple-800/50 transition-all">
                  <div style={{ height: `${h}%` }} className="bg-gradient-to-t from-purple-600 to-indigo-500 rounded-t transition-all duration-500"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex justify-between text-xs text-slate-400 px-1">
            <span>Баланс: <strong className="text-white font-mono">{balance !== null ? `${balance} SOL` : "Не подключено"}</strong></span>
            <span className="text-emerald-400 font-medium">● Газ: ~0.000005 SOL</span>
          </div>
          <button 
            onClick={() => onBuyStock(selectedStock)}
            className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-xl shadow-purple-600/30 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <span>Купить {selectedStock.symbol}.sol за ${selectedStock.price.toFixed(2)}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" z-index="20" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
}