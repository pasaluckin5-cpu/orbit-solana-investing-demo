import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowDownLeft, ArrowDownToLine, ArrowUpRight, BarChart3, BriefcaseBusiness,
  Check, ChevronDown, CircleHelp, Clock3, Home, Menu, Plus, Search, ShieldCheck,
  Sparkles, Wallet, X,
} from 'lucide-react';
import WalletControl from './WalletControl.jsx';
import { supabase } from './supabase.js';

const assets = [
  { ticker: 'AAPL', name: 'Apple', category: 'Технологии', price: 227.52, change: 1.24, tint: 'silver', symbol: 'A' },
  { ticker: 'NVDA', name: 'NVIDIA', category: 'Полупроводники', price: 131.28, change: 2.83, tint: 'green', symbol: 'N' },
  { ticker: 'SPY', name: 'S&P 500 ETF', category: 'Индексный фонд', price: 568.62, change: 0.68, tint: 'blue', symbol: 'S' },
  { ticker: 'TSLA', name: 'Tesla', category: 'Автомобили', price: 341.10, change: -0.92, tint: 'red', symbol: 'T' },
  { ticker: 'MSFT', name: 'Microsoft', category: 'Технологии', price: 513.21, change: 0.47, tint: 'blue', symbol: 'M' },
  { ticker: 'AMZN', name: 'Amazon', category: 'Розничная торговля', price: 226.48, change: -0.31, tint: 'orange', symbol: 'a' },
];

const initialHoldings = [
  { ticker: 'AAPL', quantity: 2.4, value: 546.05, pnl: 5.2 },
  { ticker: 'NVDA', quantity: 5, value: 656.40, pnl: 8.7 },
  { ticker: 'SPY', quantity: 1.2, value: 682.34, pnl: 3.1 },
  { ticker: 'TSLA', quantity: 2.8, value: 955.71, pnl: -1.8 },
];

const money = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

function AssetIcon({ asset, size = '' }) {
  return <span className={`asset-icon ${asset.tint} ${size}`}>{asset.symbol}</span>;
}

function App() {
  const [holdings, setHoldings] = useState(initialHoldings);
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState('50');
  const [period, setPeriod] = useState('1М');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const [activeTab, setActiveTab] = useState('Главная');
  const [walletAddress, setWalletAddress] = useState('');
  const [portfolioOwner, setPortfolioOwner] = useState('');
  const [portfolioLoaded, setPortfolioLoaded] = useState(false);
  const total = useMemo(() => holdings.reduce((sum, item) => sum + item.value, 0), [holdings]) + 142.31;
  const filteredAssets = assets.filter((asset) => `${asset.name} ${asset.ticker}`.toLowerCase().includes(search.toLowerCase()));

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  }

  const acceptAuthenticatedWallet = useCallback((value) => {
    setWalletAddress(value);
    setPortfolioLoaded(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadPortfolio() {
      if (!supabase || !walletAddress) return;
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) { setPortfolioLoaded(true); return; }
      const { data, error } = await supabase.from('wallet_portfolios')
        .select('owner_id, wallet_address, holdings')
        .eq('owner_id', user.id).eq('wallet_address', walletAddress).maybeSingle();
      if (cancelled) return;
      if (error) notify('Не удалось загрузить портфель из Supabase');
      if (data?.holdings && Array.isArray(data.holdings)) setHoldings(data.holdings);
      setPortfolioOwner(user.id);
      setPortfolioLoaded(true);
    }
    loadPortfolio();
    return () => { cancelled = true; };
  }, [walletAddress]);

  useEffect(() => {
    if (!supabase || !portfolioLoaded || !portfolioOwner || !walletAddress) return;
    const timeout = window.setTimeout(async () => {
      const { error } = await supabase.from('wallet_portfolios').upsert({
        owner_id: portfolioOwner,
        wallet_address: walletAddress,
        holdings,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'owner_id,wallet_address' });
      if (error) notify('Не удалось сохранить портфель в Supabase');
    }, 450);
    return () => window.clearTimeout(timeout);
  }, [holdings, portfolioLoaded, portfolioOwner, walletAddress]);

  function buy() {
    const usd = Number(amount);
    if (!usd || usd < 1) {
      notify('Укажите сумму от $1');
      return;
    }
    const addedShares = usd / selected.price;
    setHoldings((current) => {
      const existing = current.find((item) => item.ticker === selected.ticker);
      if (existing) return current.map((item) => item.ticker === selected.ticker
        ? { ...item, quantity: item.quantity + addedShares, value: item.value + usd }
        : item);
      return [...current, { ticker: selected.ticker, quantity: addedShares, value: usd, pnl: 0 }];
    });
    setSelected(null);
    notify(`Демо-покупка ${selected.ticker} добавлена в портфель`);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Orbit — главная"><span className="brand-mark">◒</span>orbit</a>
        <nav className="desktop-nav" aria-label="Основная навигация">
          {['Главная', 'Рынок', 'Портфель'].map((tab) => <button key={tab} className={activeTab === tab ? 'nav-link selected' : 'nav-link'} onClick={() => setActiveTab(tab)}>{tab}</button>)}
        </nav>
        <div className="top-actions"><span className="network-pill"><i /> Solana · Mainnet</span><WalletControl notify={notify} onAuthenticatedAddress={acceptAuthenticatedWallet} /><button className="mobile-menu" aria-label="Меню"><Menu /></button></div>
      </header>

      <main id="top">
        <div className="page-heading"><div><div className="eyebrow">ПОНЕДЕЛЬНИК, 25 СЕНТЯБРЯ</div><h1>Инвестиции — проще.</h1><p>Ваши глобальные активы, в одном месте.</p></div><button className="help-button" onClick={() => notify('Это демонстрационная версия Orbit')}><CircleHelp size={16} /> Помощь</button></div>

        <div className="dashboard-grid">
          <section className="main-column">
            <section className="balance-card">
              <div className="balance-top"><div><div className="balance-caption">Общая стоимость портфеля <span className="demo-tag">DEMO</span></div><div className="balance-value">{money(total)}</div><div className="balance-gain"><ArrowUpRight size={15} /> $126.40 <span>(4.66%) за месяц</span></div></div><div className="period-switcher" aria-label="Период графика">{['1Д', '1Н', '1М', '1Г', 'ВСЁ'].map((item) => <button key={item} className={period === item ? 'active' : ''} onClick={() => setPeriod(item)}>{item}</button>)}</div></div>
              <div className="chart-wrap"><svg viewBox="0 0 700 150" preserveAspectRatio="none" role="img" aria-label={`Изменение портфеля за период ${period}`}><defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#baf76a" stopOpacity=".25" /><stop offset="1" stopColor="#baf76a" stopOpacity="0" /></linearGradient></defs><path className="chart-area" d="M0 120 C35 109 45 125 78 99 S125 106 151 81 S187 98 222 70 S254 82 285 58 S322 74 357 51 S395 60 424 42 S463 60 492 36 S527 48 554 25 S590 42 617 20 S667 25 700 8 L700 150 L0 150Z" /><path className="chart-line" d="M0 120 C35 109 45 125 78 99 S125 106 151 81 S187 98 222 70 S254 82 285 58 S322 74 357 51 S395 60 424 42 S463 60 492 36 S527 48 554 25 S590 42 617 20 S667 25 700 8" /></svg></div>
            </section>

            <div className="quick-actions"><button className="quick-action primary-action" onClick={() => notify('Демо-режим: пополнение пока отключено')}><Plus size={18} /> Пополнить</button><button className="quick-action" onClick={() => notify('Демо-режим: вывод пока отключён')}><ArrowUpRight size={17} /> Вывести</button><span className="balance-hint"><ShieldCheck size={14} /> Безопасность прежде всего</span></div>

            <section className="market-section"><div className="section-title-row"><div><div className="eyebrow">ИЗБРАННОЕ</div><h2>Популярные активы</h2></div><label className="search-box"><Search size={15} /><input aria-label="Поиск активов" placeholder="Найти актив" value={search} onChange={(event) => setSearch(event.target.value)} /></label></div>
              <div className="asset-grid">{filteredAssets.map((asset) => <button className="asset-card" key={asset.ticker} onClick={() => { setSelected(asset); setAmount('50'); }}><div className="asset-card-head"><AssetIcon asset={asset} /><span className="asset-type">{asset.ticker === 'SPY' ? 'ETF' : 'АКЦИЯ'}</span></div><strong className="asset-name">{asset.name}</strong><span className="asset-subtitle">{asset.ticker} · {asset.category}</span><div className="asset-price-row"><strong>{money(asset.price)}</strong><span className={asset.change >= 0 ? 'positive' : 'negative'}>{asset.change >= 0 ? '+' : ''}{asset.change}%</span></div></button>)}</div>
            </section>
          </section>

          <aside className="side-column">
            <section className="welcome-card"><div className="welcome-icon"><Sparkles size={17} /></div><div><h3>Начните с малого</h3><p>Изучайте интерфейс в демо-режиме — без реальных средств и рисков.</p></div></section>
            <section className="panel portfolio-panel"><div className="panel-title"><div><div className="eyebrow">ДЕМО-ДАННЫЕ</div><h2>Пример портфеля</h2></div><button className="icon-button" aria-label="Параметры портфеля" onClick={() => notify('Портфель в демо-режиме')}><ChevronDown size={16} /></button></div>
              <div className="holding-list">{holdings.map((holding) => { const asset = assets.find((item) => item.ticker === holding.ticker); return <div className="holding-row" key={holding.ticker}><AssetIcon asset={asset || { ticker: holding.ticker, tint: 'silver', symbol: holding.ticker[0] }} /><div className="holding-name"><strong>{asset?.name || holding.ticker}</strong><span>{holding.quantity.toFixed(2)} доли · {holding.ticker}</span></div><div className="holding-value"><strong>{money(holding.value)}</strong><span className={holding.pnl >= 0 ? 'positive' : 'negative'}>{holding.pnl >= 0 ? '+' : ''}{holding.pnl}%</span></div></div>; })}</div>
              <button className="text-button" onClick={() => setActiveTab('Портфель')}>Открыть портфель <ArrowUpRight size={14} /></button>
            </section>
            <section className="panel activity-panel"><div className="panel-title"><div><div className="eyebrow">ДЕМО-ИСТОРИЯ</div><h2>Активность</h2></div><Clock3 size={17} className="muted-icon" /></div><div className="activity-row"><span className="activity-icon"><ArrowDownLeft size={15} /></span><div className="activity-text"><strong>Покупка AAPL</strong><span>Сегодня, 10:42</span></div><div className="activity-amount">−$45.50<span>0.2 доли</span></div></div><div className="activity-row"><span className="activity-icon"><ArrowDownToLine size={15} /></span><div className="activity-text"><strong>Пополнение USDC</strong><span>Вчера, 16:18</span></div><div className="activity-amount">+$200.00<span>Зачислено</span></div></div></section>
            <div className="solana-note"><span><BarChart3 size={16} /></span><p><strong>На базе Solana</strong><br />Быстрые расчёты и низкие комиссии сети.</p></div>
          </aside>
        </div>
      </main>

      <footer>Демо-приложение: цены и портфель вымышлены, сделки не исполняются. Токенизированные активы могут быть ограничены в отдельных регионах. Условия владения определяются эмитентом. Это не инвестиционная рекомендация.</footer>
      <nav className="mobile-nav">{[[Home, 'Главная'], [Search, 'Рынок'], [BriefcaseBusiness, 'Портфель'], [Wallet, 'Кошелёк']].map(([Icon, label]) => <button key={label} className={activeTab === label ? 'active' : ''} onClick={() => setActiveTab(label)}><Icon size={19} /><span>{label}</span></button>)}</nav>

      {selected && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section className="buy-modal" role="dialog" aria-modal="true" aria-labelledby="buy-heading"><div className="modal-heading"><div><div className="eyebrow">ДЕМО-СДЕЛКА</div><h2 id="buy-heading">Купить актив</h2></div><button className="icon-button close-button" aria-label="Закрыть" onClick={() => setSelected(null)}><X size={18} /></button></div><div className="modal-asset"><AssetIcon asset={selected} /><div><strong>{selected.name}</strong><span>{selected.ticker} · {money(selected.price)}</span></div></div><label className="field-label" htmlFor="purchase-amount">Сумма покупки</label><div className="amount-input"><span>$</span><input id="purchase-amount" type="number" min="1" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} /><span>USDC</span></div><div className="amount-presets">{[25, 50, 100, 250].map((value) => <button key={value} onClick={() => setAmount(String(value))}>${value}</button>)}</div><div className="estimate-row"><span>Примерная доля</span><strong>{((Number(amount) || 0) / selected.price).toFixed(4)} {selected.ticker}</strong></div><div className="estimate-row"><span>Сеть</span><strong>Solana · Demo</strong></div><p className="modal-disclaimer">Это симуляция: средства не списываются, токены не выпускаются, ценная бумага не приобретается.</p><button className="confirm-button" onClick={buy}><Check size={16} /> Продолжить в демо</button></section></div>}
      <div className={toast ? 'toast visible' : 'toast'} role="status">{toast}</div>
    </div>
  );
}

export default App;
