
import { useState, useEffect } from 'react';
import { useAsyncStorage } from './useAsyncStorage';
import { WalletInfo } from '../types';

export function useWallet() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const { 
    storedValue: walletInfo, 
    setValue: setWalletInfo, 
    loading: walletLoading 
  } = useAsyncStorage<WalletInfo | null>('connectedWallet', null);

  console.log('useWallet hook - wallet info:', walletInfo);

  const connectWallet = async (providerId: string): Promise<WalletInfo | null> => {
    console.log('Connecting wallet with provider:', providerId);
    setIsConnecting(true);
    setConnectionError(null);

    try {
      // Simulate wallet connection process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful connection
      const mockWalletInfo: WalletInfo = {
        address: `0x${Math.random().toString(16).substr(2, 40)}`,
        balance: (Math.random() * 10 + 1).toFixed(2) + ' ETH',
        network: 'Base Mainnet',
        provider: getProviderName(providerId),
        connected: true,
        connectedAt: new Date().toISOString(),
      };

      await setWalletInfo(mockWalletInfo);
      console.log('Wallet connected successfully:', mockWalletInfo);
      return mockWalletInfo;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setConnectionError('Failed to connect wallet. Please try again.');
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async (): Promise<void> => {
    console.log('Disconnecting wallet');
    try {
      await setWalletInfo(null);
      setConnectionError(null);
      console.log('Wallet disconnected successfully');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      setConnectionError('Failed to disconnect wallet.');
    }
  };

  const refreshBalance = async (): Promise<void> => {
    if (!walletInfo) return;

    console.log('Refreshing wallet balance');
    try {
      // Simulate balance refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedWalletInfo: WalletInfo = {
        ...walletInfo,
        balance: (Math.random() * 10 + 1).toFixed(2) + ' ETH',
      };

      await setWalletInfo(updatedWalletInfo);
      console.log('Balance refreshed:', updatedWalletInfo.balance);
    } catch (error) {
      console.error('Failed to refresh balance:', error);
      setConnectionError('Failed to refresh balance.');
    }
  };

  const isConnected = !!walletInfo?.connected;

  return {
    walletInfo,
    isConnected,
    isConnecting,
    connectionError,
    walletLoading,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  };
}

function getProviderName(providerId: string): string {
  const providers: Record<string, string> = {
    metamask: 'MetaMask',
    coinbase: 'Coinbase Wallet',
    walletconnect: 'WalletConnect',
  };
  return providers[providerId] || 'Unknown Provider';
}
