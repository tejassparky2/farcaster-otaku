import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [farcasterMiniApp()], // ONLY Farcaster connector
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
  },
});

export const FARCASTER_OTAKU_ABI = [
  {
    type: 'function',
    name: 'mint',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'ipfsHash', type: 'string' },
      { name: 'fid', type: 'uint256' },
      { name: 'pfpUrl', type: 'string' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'payable',
  },
];
