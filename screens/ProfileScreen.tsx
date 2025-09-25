
import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { commonStyles, colors, spacing, borderRadius, shadows } from '../styles/commonStyles';
import Icon from '../components/Icon';
import { LinearGradient } from 'expo-linear-gradient';
import SimpleBottomSheet from '../components/BottomSheet';
import SettingsScreen from './SettingsScreen';

const { width } = Dimensions.get('window');

// Mock user data
const userData = {
  name: 'Alex Chen',
  username: '@alexchen',
  bio: 'Digital artist exploring the intersection of technology and creativity on Base blockchain.',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  verified: true,
  followers: 1234,
  following: 567,
  walletAddress: '0x1234...5678',
  balance: '12.5 ETH',
};

// Mock owned artworks
const ownedArtworks = [
  {
    id: '1',
    title: 'Cosmic Journey',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=300&h=300&fit=crop',
    price: '2.1 ETH',
    status: 'owned',
  },
  {
    id: '2',
    title: 'Digital Realm',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop',
    price: '1.8 ETH',
    status: 'listed',
  },
  {
    id: '3',
    title: 'Abstract Vision',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop',
    price: '3.2 ETH',
    status: 'owned',
  },
];

// Mock activity data
const recentActivity = [
  {
    id: '1',
    type: 'purchase',
    title: 'Purchased "Cosmic Journey"',
    price: '2.1 ETH',
    time: '2 hours ago',
    icon: 'bag',
  },
  {
    id: '2',
    type: 'sale',
    title: 'Sold "Neon Dreams"',
    price: '1.5 ETH',
    time: '1 day ago',
    icon: 'trending-up',
  },
  {
    id: '3',
    type: 'listing',
    title: 'Listed "Digital Realm"',
    price: '1.8 ETH',
    time: '3 days ago',
    icon: 'pricetag',
  },
];

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'owned' | 'activity'>('owned');
  const [showWalletSheet, setShowWalletSheet] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  console.log('ProfileScreen rendered');

  const renderOwnedArtwork = (artwork: typeof ownedArtworks[0]) => (
    <TouchableOpacity
      key={artwork.id}
      style={{
        width: (width - spacing.md * 3) / 2,
        marginBottom: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        ...shadows.sm,
      }}
      onPress={() => console.log('Owned artwork pressed:', artwork.title)}
    >
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: artwork.image }}
          style={{
            width: '100%',
            height: (width - spacing.md * 3) / 2,
            backgroundColor: colors.backgroundAlt,
          }}
          resizeMode="cover"
        />
        <View
          style={{
            position: 'absolute',
            top: spacing.sm,
            right: spacing.sm,
            backgroundColor: artwork.status === 'listed' ? colors.success : colors.primary,
            borderRadius: borderRadius.sm,
            paddingHorizontal: spacing.xs,
            paddingVertical: 2,
          }}
        >
          <Text style={{ color: colors.background, fontSize: 10, fontWeight: '600' }}>
            {artwork.status === 'listed' ? 'LISTED' : 'OWNED'}
          </Text>
        </View>
      </View>
      <View style={{ padding: spacing.sm }}>
        <Text
          style={[commonStyles.text, commonStyles.textBold, { fontSize: 14 }]}
          numberOfLines={1}
        >
          {artwork.title}
        </Text>
        <Text style={[commonStyles.text, { fontSize: 12, color: colors.textSecondary }]}>
          {artwork.price}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderActivityItem = (activity: typeof recentActivity[0]) => (
    <View
      key={activity.id}
      style={[
        commonStyles.card,
        commonStyles.mb_sm,
        { flexDirection: 'row', alignItems: 'center' }
      ]}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: borderRadius.full,
          backgroundColor: colors.backgroundAlt,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing.md,
        }}
      >
        <Icon name={activity.icon as any} size={20} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[commonStyles.text, commonStyles.textBold, { fontSize: 14 }]}>
          {activity.title}
        </Text>
        <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
          {activity.time}
        </Text>
      </View>
      <Text style={[commonStyles.text, commonStyles.textBold]}>
        {activity.price}
      </Text>
    </View>
  );

  if (showSettings) {
    return (
      <SettingsScreen onBack={() => setShowSettings(false)} />
    );
  }

  return (
    <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[commonStyles.spaceBetween, commonStyles.px_md, commonStyles.py_md]}>
        <Text style={[commonStyles.subtitle, { fontSize: 24 }]}>
          Profile
        </Text>
        <TouchableOpacity
          style={{
            width: 44,
            height: 44,
            borderRadius: borderRadius.full,
            backgroundColor: colors.backgroundAlt,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            console.log('Settings pressed');
            setShowSettings(true);
          }}
        >
          <Icon name="settings" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={[commonStyles.px_md, commonStyles.mb_lg]}>
        <View style={[commonStyles.row, commonStyles.mb_md]}>
          <Image
            source={{ uri: userData.avatar }}
            style={{
              width: 80,
              height: 80,
              borderRadius: borderRadius.full,
              marginRight: spacing.md,
              backgroundColor: colors.backgroundAlt,
            }}
            resizeMode="cover"
          />
          <View style={{ flex: 1 }}>
            <View style={[commonStyles.row, commonStyles.mb_xs]}>
              <Text style={[commonStyles.heading, { fontSize: 20 }]}>
                {userData.name}
              </Text>
              {userData.verified && (
                <Icon
                  name="checkmark-circle"
                  size={20}
                  color={colors.success}
                  style={{ marginLeft: spacing.xs }}
                />
              )}
            </View>
            <Text style={[commonStyles.textSecondary, commonStyles.mb_sm]}>
              {userData.username}
            </Text>
            <View style={commonStyles.row}>
              <Text style={[commonStyles.text, commonStyles.textBold]}>
                {userData.followers}
              </Text>
              <Text style={[commonStyles.textSecondary, { marginRight: spacing.md }]}>
                {' '}followers
              </Text>
              <Text style={[commonStyles.text, commonStyles.textBold]}>
                {userData.following}
              </Text>
              <Text style={commonStyles.textSecondary}>
                {' '}following
              </Text>
            </View>
          </View>
        </View>
        <Text style={[commonStyles.text, commonStyles.mb_md]}>
          {userData.bio}
        </Text>
      </View>

      {/* Wallet Card */}
      <View style={[commonStyles.mx_md, commonStyles.mb_lg]}>
        <TouchableOpacity
          onPress={() => {
            setShowWalletSheet(true);
            console.log('Wallet card pressed');
          }}
        >
          <LinearGradient
            colors={[colors.primary, colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
            }}
          >
            <View style={[commonStyles.spaceBetween, commonStyles.mb_md]}>
              <Text style={{
                color: colors.background,
                fontSize: 16,
                fontWeight: '600',
              }}>
                Base Wallet
              </Text>
              <Icon name="wallet" size={24} color={colors.background} />
            </View>
            <Text style={{
              color: colors.background,
              fontSize: 28,
              fontWeight: '800',
              marginBottom: spacing.xs,
            }}>
              {userData.balance}
            </Text>
            <Text style={{
              color: colors.background,
              opacity: 0.8,
              fontSize: 14,
            }}>
              {userData.walletAddress}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={[commonStyles.px_md, commonStyles.mb_lg]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={[
              commonStyles.card,
              {
                flex: 1,
                marginRight: spacing.sm,
                alignItems: 'center',
                paddingVertical: spacing.md,
              }
            ]}
            onPress={() => {
              console.log('Connect wallet pressed');
              setShowSettings(true);
            }}
          >
            <Icon name="wallet" size={24} color={colors.primary} style={{ marginBottom: spacing.xs }} />
            <Text style={[commonStyles.text, { fontSize: 12, fontWeight: '600' }]}>
              Connect Wallet
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              commonStyles.card,
              {
                flex: 1,
                marginLeft: spacing.sm,
                alignItems: 'center',
                paddingVertical: spacing.md,
              }
            ]}
            onPress={() => {
              console.log('Email notifications pressed');
              setShowSettings(true);
            }}
          >
            <Icon name="mail" size={24} color={colors.accent} style={{ marginBottom: spacing.xs }} />
            <Text style={[commonStyles.text, { fontSize: 12, fontWeight: '600' }]}>
              Email Alerts
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={[commonStyles.px_md, commonStyles.mb_md]}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colors.backgroundAlt,
            borderRadius: borderRadius.md,
            padding: 4,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: spacing.sm,
              borderRadius: borderRadius.sm,
              backgroundColor: activeTab === 'owned' ? colors.surface : 'transparent',
              alignItems: 'center',
              ...shadows.sm,
            }}
            onPress={() => {
              setActiveTab('owned');
              console.log('Owned tab selected');
            }}
          >
            <Text
              style={{
                color: activeTab === 'owned' ? colors.text : colors.textSecondary,
                fontWeight: activeTab === 'owned' ? '600' : '400',
              }}
            >
              Owned ({ownedArtworks.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: spacing.sm,
              borderRadius: borderRadius.sm,
              backgroundColor: activeTab === 'activity' ? colors.surface : 'transparent',
              alignItems: 'center',
              ...shadows.sm,
            }}
            onPress={() => {
              setActiveTab('activity');
              console.log('Activity tab selected');
            }}
          >
            <Text
              style={{
                color: activeTab === 'activity' ? colors.text : colors.textSecondary,
                fontWeight: activeTab === 'activity' ? '600' : '400',
              }}
            >
              Activity
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Content */}
      <View style={[commonStyles.px_md, commonStyles.mb_xl]}>
        {activeTab === 'owned' ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {ownedArtworks.map(renderOwnedArtwork)}
          </View>
        ) : (
          <View>
            {recentActivity.map(renderActivityItem)}
          </View>
        )}
      </View>

      {/* Wallet Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={showWalletSheet}
        onClose={() => setShowWalletSheet(false)}
      >
        <View style={{ padding: spacing.lg }}>
          <Text style={[commonStyles.subtitle, commonStyles.mb_lg]}>
            Wallet Details
          </Text>
          
          <View style={[commonStyles.card, commonStyles.mb_md]}>
            <Text style={[commonStyles.textSecondary, commonStyles.mb_xs]}>
              Balance
            </Text>
            <Text style={[commonStyles.heading, { fontSize: 24 }]}>
              {userData.balance}
            </Text>
          </View>
          
          <View style={[commonStyles.card, commonStyles.mb_lg]}>
            <Text style={[commonStyles.textSecondary, commonStyles.mb_xs]}>
              Wallet Address
            </Text>
            <Text style={[commonStyles.text, { fontFamily: 'monospace' }]}>
              {userData.walletAddress}
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={[
                {
                  flex: 1,
                  backgroundColor: colors.backgroundAlt,
                  paddingVertical: spacing.md,
                  borderRadius: borderRadius.md,
                  alignItems: 'center',
                  marginRight: spacing.sm,
                }
              ]}
              onPress={() => console.log('Receive pressed')}
            >
              <Text style={[commonStyles.text, commonStyles.textBold]}>
                Receive
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                {
                  flex: 1,
                  backgroundColor: colors.primary,
                  paddingVertical: spacing.md,
                  borderRadius: borderRadius.md,
                  alignItems: 'center',
                  marginLeft: spacing.sm,
                }
              ]}
              onPress={() => console.log('Send pressed')}
            >
              <Text style={{ color: colors.background, fontWeight: '600' }}>
                Send
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SimpleBottomSheet>
    </ScrollView>
  );
}
