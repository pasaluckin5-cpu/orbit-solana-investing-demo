import { useEffect, useMemo, useState } from 'react';
import { supabase } from './supabase.js';
import { address } from '@solana/kit';
import { useClient, useRequest } from '@solana/react';
import {
  useConnect,
  useConnectedWallet,
  useDisconnect,
  useWalletStatus,
  useWallets,
} from '@solana/kit-plugin-wallet/react';
import { ChevronDown, ExternalLink, LoaderCircle, LogOut, Wallet } from 'lucide-react';

function shortAddress(value) {
  return `${value.slice(0, 4)}…${value.slice(-4)}`;
}

export default function WalletControl({ notify, onAuthenticatedAddress }) {
  const client = useClient();
  const status = useWalletStatus(client);
  const connected = useConnectedWallet(client);
  const wallets = useWallets(client);
  const connect = useConnect(client);
  const disconnect = useDisconnect(client);
  const [open, setOpen] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState('');
  const [signedInAddress, setSignedInAddress] = useState('');

  useEffect(() => {
    const { data: { subscription } } = supabase?.auth.onAuthStateChange((_event, session) => {
      const wallet = session?.user?.identities?.find((identity) => identity.provider === 'web3')?.identity_data?.sub || '';
      setSignedInAddress(wallet);
      if (wallet) onAuthenticatedAddress?.(wallet);
    }) || { data: { subscription: null } };
    return () => subscription?.unsubscribe();
  }, [onAuthenticatedAddress]);

  const balanceSource = useMemo(
    () => connected ? client.rpc.getBalance(address(connected.account.address)) : null,
    [client, connected?.account.address],
  );
  const { data: balance, status: balanceStatus, refresh } = useRequest(balanceSource);

  async function selectWallet(wallet) {
    try {
      await connect.dispatchAsync(wallet);
      setOpen(false);
    } catch {
      // The hook exposes the wallet's error below; no transaction is requested here.
    }
  }

  async function disconnectWallet() {
    try {
      await disconnect.dispatchAsync();
      setOpen(false);
      notify('Кошелёк отключён');
    } catch {
      // Keep the menu open so the user can see the error from the wallet adapter.
    }
  }

  async function signInForSync() {
    if (!supabase || !window.solana) {
      setAuthError('Для постоянного хранения подключите Supabase и кошелёк Phantom.');
      return;
    }
    setAuthBusy(true);
    setAuthError('');
    const { data, error } = await supabase.auth.signInWithWeb3({
      chain: 'solana',
      wallet: window.solana,
      statement: 'Войти в Orbit и сохранить демо-портфель в Supabase.',
    });
    setAuthBusy(false);
    if (error) { setAuthError(error.message); return; }
    const identity = data.user?.identities?.find((item) => item.provider === 'web3');
    const wallet = identity?.identity_data?.sub || addressValue || '';
    setSignedInAddress(wallet);
    if (wallet) onAuthenticatedAddress?.(wallet);
    notify('Кошелёк подтверждён для сохранения');
  }

  const addressValue = connected?.account.address;
  const isBusy = status === 'connecting' || status === 'disconnecting' || status === 'reconnecting' || connect.isRunning;

  return (
    <div className="wallet-control">
      <button className="wallet-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-haspopup="dialog" disabled={status === 'pending'}>
        {isBusy ? <LoaderCircle size={15} className="spin" /> : <Wallet size={15} />}
        {status === 'pending' ? 'Подключаем…' : addressValue ? shortAddress(addressValue) : 'Подключить кошелёк'}
        <ChevronDown size={13} />
      </button>
      {open && <section className="wallet-popover" role="dialog" aria-label="Solana кошелёк">
        {connected ? <>
          <div className="wallet-popover-heading"><span className="wallet-status-dot" />Подключён · Mainnet</div>
          <div className="connected-address"><small>Публичный адрес</small><strong title={addressValue}>{shortAddress(addressValue)}</strong><button onClick={async () => { await navigator.clipboard.writeText(addressValue); notify('Адрес скопирован'); }} aria-label="Скопировать адрес">⧉</button></div>
          <div className="wallet-balance"><span>Баланс SOL</span><strong>{balanceStatus === 'fetching' ? 'Загрузка…' : balanceStatus === 'error' ? 'Не удалось получить' : `${(Number(balance?.value ?? 0) / 1_000_000_000).toFixed(4)} SOL`}</strong></div>
          {balanceStatus === 'error' && <button className="wallet-retry" onClick={() => refresh()}>Повторить запрос</button>}
          <p className="wallet-privacy">Orbit читает публичный адрес и баланс через Solana RPC. Подпись запрашивается только при включении постоянного сохранения; приватный ключ остаётся в кошельке. Транзакции приложение не отправляет.</p>
          {signedInAddress ? <p className="wallet-privacy">Постоянное сохранение включено для подтверждённого кошелька.</p> : <button className="wallet-retry" onClick={signInForSync} disabled={authBusy}>{authBusy ? 'Подтвердите вход в кошельке…' : 'Включить постоянное сохранение'}</button>}
          {authError && <p className="wallet-error" role="alert">{authError}</p>}
          <button className="wallet-disconnect" onClick={disconnectWallet} disabled={disconnect.isRunning}><LogOut size={14} /> Отключить</button>
        </> : <>
          <div className="wallet-popover-heading">Выберите кошелёк</div>
          <p className="wallet-privacy">Подключите совместимый с Solana Wallet Standard кошелёк. Orbit не попросит seed-фразу или приватный ключ.</p>
          {wallets.length ? <div className="wallet-options">{wallets.map((wallet) => <button key={wallet.name} onClick={() => selectWallet(wallet)} disabled={isBusy}><span className="wallet-option-icon">{wallet.icon ? <img src={wallet.icon} alt="" /> : <Wallet size={16} />}</span><span>{wallet.name}</span><ExternalLink size={13} /></button>)}</div> : <div className="wallet-empty">Кошелёк не найден. Установите Phantom или откройте сайт во встроенном браузере кошелька.<div className="wallet-links"><a href="https://phantom.com/download" target="_blank" rel="noreferrer">Phantom <ExternalLink size={12} /></a><a href="https://solflare.com/download" target="_blank" rel="noreferrer">Solflare <ExternalLink size={12} /></a></div></div>}
          {connect.error && <p className="wallet-error" role="alert">Не удалось подключиться. Проверьте запрос в приложении кошелька и попробуйте снова.</p>}
        </>}
      </section>}
    </div>
  );
}
