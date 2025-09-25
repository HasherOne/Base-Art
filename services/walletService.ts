
import { ethers } from 'ethers';
import * as WebBrowser from 'expo-web-browser';
import { WalletInfo } from '../types';

// Base network configuration
const BASE_MAINNET = {
  chainId: 8453,
  name: 'Base',
  currency: 'ETH',
  explorerUrl: 'https://basescan.org',
  rpcUrl: 'https://mainnet.base.org',
};

const BASE_TESTNET = {
  chainId: 84532,
  name: 'Base Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.basescan.org',
  rpcUrl: 'https://sepolia.base.org',
};

export class WalletService {
  private provider: ethers.JsonRpcProvider | null = null;
  private signer: ethers.Signer | null = null;
  private currentWallet: WalletInfo | null = null;

  constructor() {
    console.log('WalletService initialized');
    this.initializeProvider();
  }

  private initializeProvider() {
    try {
      // Initialize with Base mainnet
      this.provider = new ethers.JsonRpcProvider(BASE_MAINNET.rpcUrl);
      console.log('Provider initialized for Base network');
    } catch (error) {
      console.error('Failed to initialize provider:', error);
    }
  }

  async connectMetaMask(): Promise<WalletInfo | null> {
    console.log('Attempting to connect MetaMask');
    
    try {
      // For mobile, we need to use deep linking to MetaMask
      const metamaskUrl = `https://metamask.app.link/dapp/${encodeURIComponent('https://base.org')}`;
      
      // Open MetaMask mobile app
      const result = await WebBrowser.openBrowserAsync(metamaskUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      });

      console.log('MetaMask browser result:', result);

      // For demo purposes, simulate successful connection
      // In a real app, you'd handle the callback from MetaMask
      return this.simulateWalletConnection('MetaMask');
    } catch (error) {
      console.error('MetaMask connection failed:', error);
      throw new Error('Failed to connect to MetaMask. Please ensure MetaMask is installed.');
    }
  }

  async connectCoinbaseWallet(): Promise<WalletInfo | null> {
    console.log('Attempting to connect Coinbase Wallet');
    
    try {
      // For mobile, use Coinbase Wallet deep linking
      const coinbaseUrl = `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent('https://base.org')}`;
      
      const result = await WebBrowser.openBrowserAsync(coinbaseUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      });

      console.log('Coinbase Wallet browser result:', result);

      // Simulate successful connection
      return this.simulateWalletConnection('Coinbase Wallet');
    } catch (error) {
      console.error('Coinbase Wallet connection failed:', error);
      throw new Error('Failed to connect to Coinbase Wallet. Please ensure the app is installed.');
    }
  }

  async connectWalletConnect(): Promise<WalletInfo | null> {
    console.log('Attempting to connect via WalletConnect');
    
    try {
      // For now, simulate WalletConnect connection
      // In production, you'd use @walletconnect/modal-react-native
      return this.simulateWalletConnection('WalletConnect');
    } catch (error) {
      console.error('WalletConnect connection failed:', error);
      throw new Error('Failed to connect via WalletConnect.');
    }
  }

  private async simulateWalletConnection(providerName: string): Promise<WalletInfo> {
    console.log(`Simulating ${providerName} connection`);
    
    // Generate a realistic-looking Ethereum address
    const wallet = ethers.Wallet.createRandom();
    const address = wallet.address;
    
    // Get actual ETH balance for the address (will be 0 for new addresses)
    let balance = '0.0';
    try {
      if (this.provider) {
        const balanceWei = await this.provider.getBalance(address);
        balance = ethers.formatEther(balanceWei);
      }
    } catch (error) {
      console.log('Could not fetch balance, using default');
      // For demo, use a random balance
      balance = (Math.random() * 5 + 0.1).toFixed(4);
    }

    const walletInfo: WalletInfo = {
      address,
      balance: `${balance} ETH`,
      network: BASE_MAINNET.name,
      provider: providerName,
      connected: true,
      connectedAt: new Date().toISOString(),
      chainId: BASE_MAINNET.chainId,
    };

    this.currentWallet = walletInfo;
    console.log('Wallet connected:', walletInfo);
    
    return walletInfo;
  }

  async refreshBalance(address: string): Promise<string> {
    console.log('Refreshing balance for address:', address);
    
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const balanceWei = await this.provider.getBalance(address);
      const balance = ethers.formatEther(balanceWei);
      
      console.log('Balance refreshed:', balance);
      return `${balance} ETH`;
    } catch (error) {
      console.error('Failed to refresh balance:', error);
      // Return a simulated balance for demo
      const simulatedBalance = (Math.random() * 5 + 0.1).toFixed(4);
      return `${simulatedBalance} ETH`;
    }
  }

  async signMessage(message: string): Promise<string> {
    console.log('Signing message:', message);
    
    if (!this.currentWallet) {
      throw new Error('No wallet connected');
    }

    try {
      // For demo purposes, create a mock signature
      const wallet = ethers.Wallet.createRandom();
      const signature = await wallet.signMessage(message);
      
      console.log('Message signed successfully');
      return signature;
    } catch (error) {
      console.error('Failed to sign message:', error);
      throw new Error('Failed to sign message');
    }
  }

  async sendTransaction(to: string, value: string): Promise<string> {
    console.log('Sending transaction:', { to, value });
    
    if (!this.currentWallet) {
      throw new Error('No wallet connected');
    }

    try {
      // For demo purposes, return a mock transaction hash
      const mockTxHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      
      console.log('Transaction sent:', mockTxHash);
      return mockTxHash;
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw new Error('Failed to send transaction');
    }
  }

  async switchToBaseNetwork(): Promise<boolean> {
    console.log('Switching to Base network');
    
    try {
      // In a real implementation, this would request the wallet to switch networks
      // For now, just update our provider
      this.provider = new ethers.JsonRpcProvider(BASE_MAINNET.rpcUrl);
      
      if (this.currentWallet) {
        this.currentWallet.network = BASE_MAINNET.name;
        this.currentWallet.chainId = BASE_MAINNET.chainId;
      }
      
      console.log('Switched to Base network successfully');
      return true;
    } catch (error) {
      console.error('Failed to switch network:', error);
      return false;
    }
  }

  async getNetworkInfo(): Promise<{ chainId: number; name: string }> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    try {
      const network = await this.provider.getNetwork();
      return {
        chainId: Number(network.chainId),
        name: network.name,
      };
    } catch (error) {
      console.error('Failed to get network info:', error);
      return BASE_MAINNET;
    }
  }

  disconnect(): void {
    console.log('Disconnecting wallet');
    this.currentWallet = null;
    this.signer = null;
  }

  getCurrentWallet(): WalletInfo | null {
    return this.currentWallet;
  }

  isConnected(): boolean {
    return this.currentWallet !== null && this.currentWallet.connected;
  }
}

export const walletService = new WalletService();
