
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  TextInput,
  ScrollView,
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
    color: '#F6851B',
    description: 'Connect using MetaMask mobile app',
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: 'card',
    color: '#0052FF',
    description: 'Connect using Coinbase Wallet app',
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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [messageToSign, setMessageToSign] = useState('');
  const [transactionTo, setTransactionTo] = useState('');
  const [transactionValue, setTransactionValue] = useState('');
  
  const {
    walletInfo,
    isConnected,
    isConnecting,
    connectionError,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    signMessage,
    sendTransaction,
    switchNetwork,
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
          'Wallet Connected! 🎉',
          `Successfully connected to ${result.provider}\n\nAddress: ${result.address.slice(0, 6)}...${result.address.slice(-4)}\nNetwork: ${result.network}`,
          [{ text: 'Great!' }]
        );
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      Alert.alert(
        'Connection Failed',
        connectionError || 'Failed to connect to wallet. Please ensure the wallet app is installed and try again.',
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
      'Are you sure you want to disconnect your wallet? You will need to reconnect to use the app.',
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
    Alert.alert(
      'Balance Updated',
      'Your wallet balance has been refreshed.',
      [{ text: 'OK' }]
    );
  };

  const handleSignMessage = async () => {
    if (!messageToSign.trim()) {
      Alert.alert('Error', 'Please enter a message to sign');
      return;
    }

    try {
      const signature = await signMessage(messageToSign);
      if (signature) {
        Alert.alert(
          'Message Signed',
          `Message: "${messageToSign}"\n\nSignature: ${signature.slice(0, 20)}...`,
          [{ text: 'OK' }]
        );
        setMessageToSign('');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sign message');
    }
  };

  const handleSendTransaction = async () => {
    if (!transactionTo.trim() || !transactionValue.trim()) {
      Alert.alert('Error', 'Please enter both recipient address and amount');
      return;
    }

    Alert.alert(
      'Confirm Transaction',
      `Send ${transactionValue} ETH to ${transactionTo.slice(0, 6)}...${transactionTo.slice(-4)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: async () => {
            try {
              const txHash = await sendTransaction(transactionTo, transactionValue);
              if (txHash) {
                Alert.alert(
                  'Transaction Sent',
                  `Transaction Hash: ${txHash.slice(0, 20)}...\n\nYou can view it on the Base explorer.`,
                  [{ text: 'OK' }]
                );
                setTransactionTo('');
                setTransactionValue('');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to send transaction');
            }
          }
        }
      ]
    );
  };

  const handleSwitchNetwork = async () => {
    const success = await switchNetwork();
    Alert.alert(
      success ? 'Network Switched' : 'Switch Failed',
      success 
        ? 'Successfully switched to Base network'
        : 'Failed to switch network. Please try manually in your wallet.',
      [{ text: 'OK' }]
    );
  };

  const openWalletInfo = async () => {
    if (!walletInfo) return;
    
    console.log('Opening wallet info');
    Alert.alert(
      'Wallet Information',
      `Provider: ${walletInfo.provider}\nAddress: ${walletInfo.address}\nBalance: ${walletInfo.balance}\nNetwork: ${walletInfo.network}\nChain ID: ${walletInfo.chainId}`,
      [
        { text: 'Refresh Balance', onPress: handleRefreshBalance },
        { text: 'Switch to Base', onPress: handleSwitchNetwork },
        { text: 'Disconnect', style: 'destructive', onPress: handleDisconnectWallet },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  if (isConnected && walletInfo) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
              {walletInfo.ensName && (
                <Text style={styles.ensName}>{walletInfo.ensName}</Text>
              )}
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
            style={[styles.actionButton, styles.networkButton]}
            onPress={handleSwitchNetwork}
          >
            <Icon name="swap-horizontal" size={16} color={colors.warning} />
            <Text style={styles.networkButtonText}>Base Network</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.advancedToggle}
          onPress={() => setShowAdvanced(!showAdvanced)}
        >
          <Text style={styles.advancedToggleText}>Advanced Features</Text>
          <Icon 
            name={showAdvanced ? "chevron-up" : "chevron-down"} 
            size={16} 
            color={colors.textSecondary} 
          />
        </TouchableOpacity>

        {showAdvanced && (
          <View style={styles.advancedSection}>
            <View style={styles.signMessageSection}>
              <Text style={styles.sectionTitle}>Sign Message</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter message to sign"
                value={messageToSign}
                onChangeText={setMessageToSign}
                multiline
              />
              <TouchableOpacity
                style={[styles.actionButton, styles.signButton]}
                onPress={handleSignMessage}
                disabled={!messageToSign.trim()}
              >
                <Icon name="create" size={16} color={colors.primary} />
                <Text style={styles.signButtonText}>Sign Message</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.transactionSection}>
              <Text style={styles.sectionTitle}>Send Transaction</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Recipient address (0x...)"
                value={transactionTo}
                onChangeText={setTransactionTo}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Amount in ETH"
                value={transactionValue}
                onChangeText={setTransactionValue}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={[styles.actionButton, styles.sendButton]}
                onPress={handleSendTransaction}
                disabled={!transactionTo.trim() || !transactionValue.trim()}
              >
                <Icon name="send" size={16} color={colors.success} />
                <Text style={styles.sendButtonText}>Send Transaction</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.actionButton, styles.disconnectButton]}
          onPress={handleDisconnectWallet}
        >
          <Icon name="log-out" size={16} color={colors.error} />
          <Text style={styles.disconnectButtonText}>Disconnect Wallet</Text>
        </TouchableOpacity>

        <View style={styles.securityNote}>
          <Icon name="shield-checkmark" size={16} color={colors.success} />
          <Text style={styles.securityText}>
            Your wallet is securely connected to the Base blockchain. All transactions are processed through your wallet app.
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Connect Your Wallet</Text>
      <Text style={styles.subtitle}>
        Connect your crypto wallet to start trading digital art on the Base blockchain. Your wallet stays secure - we never store your private keys.
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

      <View style={styles.networkInfo}>
        <Icon name="information-circle" size={16} color={colors.primary} />
        <Text style={styles.networkInfoText}>
          This app works on the Base network. If your wallet is on a different network, you&apos;ll be prompted to switch.
        </Text>
      </View>

      <View style={styles.securityNote}>
        <Icon name="shield-checkmark" size={16} color={colors.success} />
        <Text style={styles.securityText}>
          Your wallet connection is secure and encrypted. We never store your private keys or have access to your funds.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
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
  ensName: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 2,
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
    marginBottom: spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.xs,
  },
  refreshButton: {
    backgroundColor: colors.primary + '20',
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  networkButton: {
    backgroundColor: colors.warning + '20',
  },
  networkButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.warning,
    marginLeft: spacing.xs,
  },
  disconnectButton: {
    backgroundColor: colors.error + '20',
    marginTop: spacing.md,
  },
  disconnectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
    marginLeft: spacing.xs,
  },
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  advancedToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  advancedSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  signMessageSection: {
    marginBottom: spacing.lg,
  },
  transactionSection: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  textInput: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  signButton: {
    backgroundColor: colors.primary + '20',
  },
  signButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  sendButton: {
    backgroundColor: colors.success + '20',
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
    marginLeft: spacing.xs,
  },
  networkInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primary + '10',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  networkInfoText: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: 16,
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
