
import React, { createContext, useContext, useEffect, useState } from 'react';
import { WalletContextType, WalletInfo } from '../types';
import { useWallet } from '../hooks/useWallet';

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const walletHook = useWallet();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize wallet context
    console.log('WalletProvider initialized');
    setIsInitialized(true);
  }, []);

  const contextValue: WalletContextType = {
    walletInfo: walletHook.walletInfo,
    isConnected: walletHook.isConnected,
    isConnecting: walletHook.isConnecting,
    connectionError: walletHook.connectionError,
    connectWallet: walletHook.connectWallet,
    disconnectWallet: walletHook.disconnectWallet,
    refreshBalance: walletHook.refreshBalance,
    signMessage: walletHook.signMessage,
    sendTransaction: walletHook.sendTransaction,
  };

  if (!isInitialized) {
    return null; // or a loading spinner
  }

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext(): WalletContextType {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
}
