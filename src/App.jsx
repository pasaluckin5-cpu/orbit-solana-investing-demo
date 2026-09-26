import React, { useState } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

const RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';
const connection = new Connection(RPC_ENDPOINT, 'confirmed');
export default function App() (
  const [walletAddress, setWalletAddress] = useState(null);
  const [solBalance, setSolBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const connectWallet = async () => { try { setError(null); const provider = window?.solana; if (!provider?.isPhantom) { alert('Пожалуйста, установите расширение Phantom Wallet!'); window.open('https://phantom.app/', '_blank'); return; } const response = await provider.connect(); const address = response.publicKey.toString(); setWalletAddress(address); fetchWalletData(address); } catch (err) { console.error(err); setError('Ошибка подключения кошелька'); } };
const disconnectWallet = async () => { try { const provider = window?.solana; if (provider) { await provider.disconnect(); } setWalletAddress(null); setSolBalance(null); setTransactions([]); } catch (err) { console.error(err); } };
const fetchWalletData = async (addressStr) => { setLoading(true); setError(null); try { const pubKey = new PublicKey(addressStr); const balance = await connection.getBalance(pubKey); setSolBalance(balance / LAMPORTS_PER_SOL);
  const signatures = await connection.getSignaturesForAddress(pubKey, { limit: 5 });
  setTransactions(signatures);
} catch (err) {
  console.error(err);
  setError('Не удалось загрузить данные из сети Solana.');
} finally {
  setLoading(false);
}
};
return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '40px auto', padding: '20px', background: '#121212', color: '#fff', borderRadius: '12px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#14F195' }}>Solana Wallet Dashboard</h1>
        <div>
          {!walletAddress ? (
            <button onClick={connectWallet} style={{ background: '#9945FF', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Подключить Phantom
            </button>
          ) : (
            <button onClick={disconnectWallet} style={{ background: '#333', color: '#fff', border: '1px solid #555', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
              Отключиться
            </button>
          )}
        </div>
      </header>
      <main style={{ marginTop: '30px' }}>
    {error && <div style={{ background: '#FF3366', color: '#fff', padding: '10px', borderRadius: '6px', marginBottom: '20px' }}>{error}</div>}

    {!walletAddress ? (
      <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
        <h2>Подключите кошелек, чтобы увидеть реальные данные блокчейна</h2>
      </div>
    ) : (
      <div>
        <div style={{ background: '#1E1E1E', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#aaa' }}>Информация о кошельке</h3>
          <p style={{ wordBreak: 'break-all', margin: '5px 0' }}><strong>Адрес:</strong> {walletAddress}</p>
          <p style={{ margin: '5px 0', fontSize: '20px' }}>
            <strong>Баланс:</strong> {solBalance !== null ? `${solBalance.toFixed(4)} SOL` : 'Загрузка...'}
          </p>
          <div style={{ marginTop: '15px' }}>
            <a href={`https://solscan.io/account/${walletAddress}`} target="_blank" rel="noreferrer" style={{ color: '#14F195', textDecoration: 'none' }}>
              🔍 Посмотреть на Solscan →
            </a>
          </div>
        </div>

        <div style={{ background: '#1E1E1E', padding: '20px', borderRadius: '10px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#aaa' }}>Последние транзакции</h3>
          {loading ? (
            <p>Загрузка истории...</p>
          ) : transactions.length === 0 ? (
            <p>Транзакций не найдено</p>
          ) : (
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {transactions.map((tx, index) => (
                <li key={index} style={{ marginBottom: '10px' }}>
                  <a href={`https://solscan.io/tx/${tx.signature}`} target="_blank" rel="noreferrer" style={{ color: '#14F195', textDecoration: 'none', wordBreak: 'break-all' }}>
                    {tx.signature.slice(0, 20)}...
                   </a>
                </li>
               ))}
              </ul>
            )}
          </div>
        </div>
      )}
   </main>
  </div>
 );

