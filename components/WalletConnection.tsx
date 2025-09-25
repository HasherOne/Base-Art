
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../styles/commonStyles';
import Icon from './Icon';
import { useWallet } from '../hooks/useWallet';

interface WalletConnectionProps {
  onWalletConnected?: (walletInfo: any) => void;
}

const SUPPORTED_WALLETS = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: 'wallet',
    color: colors.primary,
    description: 'Connect using MetaMask browser extension',
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: 'card',
    color: '#0052FF',
    description: 'Connect using Coinbase Wallet',
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: 'link',
    color: '#3B99FC',
    description: 'Connect using WalletConnect protocol',
  },
];

export default function WalletConnection({ onWalletConnected }: WalletConnectionProps) {
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const {
    walletInfo,
    isConnected,
    isConnecting,
    connectionError,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  } = useWallet();

  console.log('WalletConnection rendered, connected:', isConnected, 'wallet:', walletInfo);

  const handleConnectWallet = async (walletId: string) => {
    console.log('Connecting to wallet:', walletId);
    setConnectingWallet(walletId);

    try {
      const result = await connectWallet(walletId);
      if (result) {
        onWalletConnected?.(result);
        Alert.alert(
          'Wallet Connected!',
          `Successfully connected to ${result.provider}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      Alert.alert(
        'Connection Failed',
        connectionError || 'Failed to connect to wallet. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setConnectingWallet(null);
    }
  };

  const handleDisconnectWallet = async () => {
    console.log('Disconnecting wallet');
    Alert.alert(
      'Disconnect Wallet',
      'Are you sure you want to disconnect your wallet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            await disconnectWallet();
            Alert.alert(
              'Wallet Disconnected',
              'Your wallet has been disconnected successfully.',
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };

  const handleRefreshBalance = async () => {
    console.log('Refreshing balance');
    await refreshBalance();
  };

  const openWalletInfo = async () => {
    if (!walletInfo) return;
    
    console.log('Opening wallet info');
    Alert.alert(
      'Wallet Information',
      `Address: ${walletInfo.address}\nBalance: ${walletInfo.balance}\nNetwork: ${walletInfo.network}`,
      [
        { text: 'Refresh Balance', onPress: handleRefreshBalance },
        { text: 'Disconnect', style: 'destructive', onPress: handleDisconnectWallet },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  if (isConnected && walletInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Connected Wallet</Text>
        
        <TouchableOpacity style={styles.connectedWallet} onPress={openWalletInfo}>
          <View style={styles.walletHeader}>
            <View style={styles.walletIcon}>
              <Icon name="checkmark-circle" size={20} color={colors.success} />
            </View>
            <View style={styles.walletInfo}>
              <Text style={styles.walletProvider}>{walletInfo.provider}</Text>
              <Text style={styles.walletAddress}>
                {walletInfo.address.slice(0, 6)}...{walletInfo.address.slice(-4)}
              </Text>
            </View>
            <View style={styles.walletBalance}>
              <Text style={styles.balanceText}>{walletInfo.balance}</Text>
              <Text style={styles.networkText}>{walletInfo.network}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.refreshButton]}
            onPress={handleRefreshBalance}
          >
            <Icon name="refresh" size={16} color={colors.primary} />
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.disconnectButton]}
            onPress={handleDisconnectWallet}
          >
            <Icon name="log-out" size={16} color={colors.error} />
            <Text style={styles.disconnectButtonText}>Disconnect</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.securityNote}>
          <Icon name="shield-checkmark" size={16} color={colors.success} />
          <Text style={styles.securityText}>
            Your wallet is securely connected. Tap the wallet card above for more options.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect Your Wallet</Text>
      <Text style={styles.subtitle}>
        Choose a wallet to connect to the Base blockchain and start trading digital art.
      </Text>

      {connectionError && (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={16} color={colors.error} />
          <Text style={styles.errorText}>{connectionError}</Text>
        </View>
      )}

      <View style={styles.walletList}>
        {SUPPORTED_WALLETS.map((wallet) => (
          <TouchableOpacity
            key={wallet.id}
            style={[
              styles.walletOption,
              (connectingWallet === wallet.id || isConnecting) && styles.walletOptionConnecting
            ]}
            onPress={() => handleConnectWallet(wallet.id)}
            disabled={isConnecting || connectingWallet !== null}
          >
            <View style={[styles.walletIconContainer, { backgroundColor: wallet.color + '20' }]}>
              <Icon name={wallet.icon as any} size={24} color={wallet.color} />
            </View>
            <View style={styles.walletDetails}>
              <Text style={styles.walletName}>{wallet.name}</Text>
              <Text style={styles.walletDescription}>{wallet.description}</Text>
            </View>
            {connectingWallet === wallet.id ? (
              <View style={styles.loadingIndicator}>
                <Text style={styles.connectingText}>Connecting...</Text>
              </View>
            ) : (
              <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.securityNote}>
        <Icon name="shield-checkmark" size={16} color={colors.success} />
        <Text style={styles.securityText}>
          Your wallet connection is secure and encrypted. We never store your private keys.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error + '10',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginLeft: spacing.sm,
    flex: 1,
  },
  walletList: {
    marginBottom: spacing.lg,
  },
  walletOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  walletOptionConnecting: {
    opacity: 0.7,
  },
  walletIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  walletDetails: {
    flex: 1,
  },
  walletName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  walletDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  loadingIndicator: {
    paddingHorizontal: spacing.sm,
  },
  connectingText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  connectedWallet: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  walletInfo: {
    flex: 1,
  },
  walletProvider: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  walletAddress: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  walletBalance: {
    alignItems: 'flex-end',
  },
  balanceText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  networkText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  refreshButton: {
    backgroundColor: colors.primary + '20',
    marginRight: spacing.sm,
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  disconnectButton: {
    backgroundColor: colors.error + '20',
    marginLeft: spacing.sm,
  },
  disconnectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
    marginLeft: spacing.xs,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.success + '10',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  securityText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: 16,
  },
});
