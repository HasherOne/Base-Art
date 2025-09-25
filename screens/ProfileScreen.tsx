
import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { commonStyles, colors, spacing, borderRadius, shadows } from '../styles/commonStyles';
import SimpleBottomSheet from '../components/BottomSheet';
import SettingsScreen from './SettingsScreen';
import Icon from '../components/Icon';
import { useWalletContext } from '../contexts/WalletContext';

const { width } = Dimensions.get('window');

// Mock data for owned artworks
const ownedArtworks = [
  {
    id: '1',
    title: 'Digital Dreams #001',
    image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400',
    price: '2.5 ETH',
    artist: 'CryptoArtist',
  },
  {
    id: '2',
    title: 'Neon Genesis',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    price: '1.8 ETH',
    artist: 'DigitalMaster',
  },
  {
    id: '3',
    title: 'Abstract Reality',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
    price: '3.2 ETH',
    artist: 'ModernCreator',
  },
];

// Mock data for recent activity
const recentActivity = [
  {
    id: '1',
    type: 'purchase',
    title: 'Purchased Digital Dreams #001',
    price: '2.5 ETH',
    time: '2 hours ago',
    icon: 'bag',
  },
  {
    id: '2',
    type: 'sale',
    title: 'Sold Cyber Punk Collection',
    price: '5.1 ETH',
    time: '1 day ago',
    icon: 'trending-up',
  },
  {
    id: '3',
    type: 'listing',
    title: 'Listed Abstract Reality',
    price: '3.2 ETH',
    time: '3 days ago',
    icon: 'pricetag',
  },
];

export default function ProfileScreen() {
  const [showSettings, setShowSettings] = useState(false);
  const { walletInfo, isConnected, refreshBalance } = useWalletContext();

  console.log('ProfileScreen rendered, wallet info:', walletInfo);

  const renderOwnedArtwork = (artwork: typeof ownedArtworks[0]) => (
    <TouchableOpacity key={artwork.id} style={styles.artworkCard}>
      <Image source={{ uri: artwork.image }} style={styles.artworkImage} />
      <View style={styles.artworkInfo}>
        <Text style={styles.artworkTitle}>{artwork.title}</Text>
        <Text style={styles.artworkArtist}>by {artwork.artist}</Text>
        <Text style={styles.artworkPrice}>{artwork.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderActivityItem = (activity: typeof recentActivity[0]) => (
    <View key={activity.id} style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: colors.primary + '20' }]}>
        <Icon name={activity.icon as any} size={16} color={colors.primary} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <Text style={styles.activityTime}>{activity.time}</Text>
      </View>
      <Text style={styles.activityPrice}>{activity.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={[colors.primary + '20', colors.background]}
          style={styles.profileHeader}
        >
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' }}
                style={styles.avatar}
              />
              <View style={styles.verifiedBadge}>
                <Icon name="checkmark" size={12} color={colors.background} />
              </View>
            </View>
            
            <Text style={styles.userName}>Digital Collector</Text>
            <Text style={styles.userHandle}>@collector_pro</Text>
            
            {isConnected && walletInfo && (
              <View style={styles.walletInfo}>
                <Text style={styles.walletAddress}>
                  {walletInfo.address.slice(0, 6)}...{walletInfo.address.slice(-4)}
                </Text>
                <TouchableOpacity onPress={refreshBalance} style={styles.balanceContainer}>
                  <Text style={styles.walletBalance}>{walletInfo.balance}</Text>
                  <Icon name="refresh" size={12} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setShowSettings(true)}
          >
            <Icon name="settings" size={20} color={colors.text} />
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Owned</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Created</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>24.5</Text>
            <Text style={styles.statLabel}>ETH Volume</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>156</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
        </View>

        {/* Owned Artworks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Owned Artworks</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.artworksList}
          >
            {ownedArtworks.map(renderOwnedArtwork)}
          </ScrollView>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            {recentActivity.map(renderActivityItem)}
          </View>
        </View>

        {/* Wallet Status */}
        {isConnected && walletInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wallet Status</Text>
            <View style={styles.walletStatusCard}>
              <View style={styles.walletStatusHeader}>
                <Icon name="wallet" size={20} color={colors.success} />
                <Text style={styles.walletStatusTitle}>Connected to {walletInfo.provider}</Text>
              </View>
              <Text style={styles.walletStatusNetwork}>Network: {walletInfo.network}</Text>
              <Text style={styles.walletStatusConnected}>
                Connected: {new Date(walletInfo.connectedAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <SimpleBottomSheet
        isVisible={showSettings}
        onClose={() => setShowSettings(false)}
      >
        <SettingsScreen onBack={() => setShowSettings(false)} />
      </SimpleBottomSheet>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  profileInfo: {
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.background,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userHandle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  walletInfo: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    minWidth: 200,
  },
  walletAddress: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'monospace',
    marginBottom: spacing.xs,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletBalance: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginRight: spacing.xs,
  },
  settingsButton: {
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  section: {
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  artworksList: {
    paddingRight: spacing.lg,
  },
  artworkCard: {
    width: 140,
    marginRight: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  artworkImage: {
    width: '100%',
    height: 140,
  },
  artworkInfo: {
    padding: spacing.md,
  },
  artworkTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  artworkArtist: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  artworkPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  activityList: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  activityPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  walletStatusCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  walletStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  walletStatusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: spacing.sm,
  },
  walletStatusNetwork: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  walletStatusConnected: {
    fontSize: 12,
    color: colors.textSecondary,
  },
};
