
import { useState, useEffect } from 'react';
import { useAsyncStorage } from './useAsyncStorage';
import { WalletInfo } from '../types';
import { walletService } from '../services/walletService';

export function useWallet() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const { 
    storedValue: walletInfo, 
    setValue: setWalletInfo, 
    loading: walletLoading 
  } = useAsyncStorage<WalletInfo | null>('connectedWallet', null);

  console.log('useWallet hook - wallet info:', walletInfo);

  // Initialize wallet service with stored wallet info
  useEffect(() => {
    if (walletInfo && walletInfo.connected) {
      console.log('Restoring wallet connection from storage');
      // In a real app, you might want to verify the connection is still valid
    }
  }, [walletInfo]);

  const connectWallet = async (providerId: string): Promise<WalletInfo | null> => {
    console.log('Connecting wallet with provider:', providerId);
    setIsConnecting(true);
    setConnectionError(null);

    try {
      let result: WalletInfo | null = null;

      switch (providerId) {
        case 'metamask':
          result = await walletService.connectMetaMask();
          break;
        case 'coinbase':
          result = await walletService.connectCoinbaseWallet();
          break;
        case 'walletconnect':
          result = await walletService.connectWalletConnect();
          break;
        default:
          throw new Error(`Unsupported wallet provider: ${providerId}`);
      }

      if (result) {
        await setWalletInfo(result);
        console.log('Wallet connected successfully:', result);
        
        // Ensure we're on the Base network
        const networkSwitched = await walletService.switchToBaseNetwork();
        if (!networkSwitched) {
          console.warn('Failed to switch to Base network');
        }
      }

      return result;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet. Please try again.';
      setConnectionError(errorMessage);
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async (): Promise<void> => {
    console.log('Disconnecting wallet');
    try {
      walletService.disconnect();
      await setWalletInfo(null);
      setConnectionError(null);
      console.log('Wallet disconnected successfully');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      setConnectionError('Failed to disconnect wallet.');
    }
  };

  const refreshBalance = async (): Promise<void> => {
    if (!walletInfo || !walletInfo.address) {
      console.log('No wallet connected, cannot refresh balance');
      return;
    }

    console.log('Refreshing wallet balance');
    try {
      const newBalance = await walletService.refreshBalance(walletInfo.address);
      
      const updatedWalletInfo: WalletInfo = {
        ...walletInfo,
        balance: newBalance,
      };

      await setWalletInfo(updatedWalletInfo);
      console.log('Balance refreshed:', newBalance);
    } catch (error) {
      console.error('Failed to refresh balance:', error);
      setConnectionError('Failed to refresh balance.');
    }
  };

  const signMessage = async (message: string): Promise<string | null> => {
    if (!walletInfo) {
      setConnectionError('No wallet connected');
      return null;
    }

    try {
      const signature = await walletService.signMessage(message);
      console.log('Message signed successfully');
      return signature;
    } catch (error) {
      console.error('Failed to sign message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign message';
      setConnectionError(errorMessage);
      return null;
    }
  };

  const sendTransaction = async (to: string, value: string): Promise<string | null> => {
    if (!walletInfo) {
      setConnectionError('No wallet connected');
      return null;
    }

    try {
      const txHash = await walletService.sendTransaction(to, value);
      console.log('Transaction sent successfully:', txHash);
      
      // Refresh balance after transaction
      setTimeout(() => {
        refreshBalance();
      }, 2000);
      
      return txHash;
    } catch (error) {
      console.error('Failed to send transaction:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send transaction';
      setConnectionError(errorMessage);
      return null;
    }
  };

  const switchNetwork = async (): Promise<boolean> => {
    try {
      const success = await walletService.switchToBaseNetwork();
      if (success && walletInfo) {
        const updatedWalletInfo: WalletInfo = {
          ...walletInfo,
          network: 'Base',
          chainId: 8453,
        };
        await setWalletInfo(updatedWalletInfo);
      }
      return success;
    } catch (error) {
      console.error('Failed to switch network:', error);
      return false;
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
    signMessage,
    sendTransaction,
    switchNetwork,
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
