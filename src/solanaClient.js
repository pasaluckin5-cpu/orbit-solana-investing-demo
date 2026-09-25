import { createClient } from '@solana/kit';
import { solanaRpc } from '@solana/kit-plugin-rpc';
import { walletSigner } from '@solana/kit-plugin-wallet';

const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

// Wallet connection and balance reads only. Orbit does not sign or submit transactions yet.
export const solanaClient = createClient()
  .use(walletSigner({ chain: 'solana:mainnet' }))
  .use(solanaRpc({ rpcUrl }));
