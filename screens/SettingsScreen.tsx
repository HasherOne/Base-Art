
import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { commonStyles, colors, spacing, borderRadius } from '../styles/commonStyles';
import Icon from '../components/Icon';
import SimpleBottomSheet from '../components/BottomSheet';
import WalletConnection from '../components/WalletConnection';
import EmailSubscription from '../components/EmailSubscription';

interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [showWalletSheet, setShowWalletSheet] = useState(false);
  const [showEmailSheet, setShowEmailSheet] = useState(false);

  console.log('SettingsScreen rendered');

  const settingsOptions = [
    {
      id: 'wallet',
      title: 'Crypto Wallet',
      description: 'Connect your wallet to trade on Base blockchain',
      icon: 'wallet',
      color: colors.primary,
      onPress: () => {
        console.log('Wallet settings pressed');
        setShowWalletSheet(true);
      },
    },
    {
      id: 'notifications',
      title: 'Email Notifications',
      description: 'Subscribe to get updates about new artworks and auctions',
      icon: 'mail',
      color: colors.accent,
      onPress: () => {
        console.log('Email notifications pressed');
        setShowEmailSheet(true);
      },
    },
    {
      id: 'profile',
      title: 'Profile Settings',
      description: 'Update your profile information and preferences',
      icon: 'person',
      color: colors.success,
      onPress: () => {
        console.log('Profile settings pressed');
        // TODO: Implement profile settings
      },
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      description: 'Manage your account security and privacy settings',
      icon: 'shield-checkmark',
      color: colors.warning,
      onPress: () => {
        console.log('Security settings pressed');
        // TODO: Implement security settings
      },
    },
    {
      id: 'help',
      title: 'Help & Support',
      description: 'Get help with using the app and contact support',
      icon: 'help-circle',
      color: colors.info,
      onPress: () => {
        console.log('Help & support pressed');
        // TODO: Implement help & support
      },
    },
  ];

  const renderSettingOption = (option: typeof settingsOptions[0]) => (
    <TouchableOpacity
      key={option.id}
      style={[
        commonStyles.card,
        commonStyles.mb_sm,
        { flexDirection: 'row', alignItems: 'center' }
      ]}
      onPress={option.onPress}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: borderRadius.md,
          backgroundColor: option.color + '20',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing.md,
        }}
      >
        <Icon name={option.icon as any} size={24} color={option.color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[commonStyles.text, commonStyles.textBold, { fontSize: 16 }]}>
          {option.title}
        </Text>
        <Text style={[commonStyles.textSecondary, { fontSize: 12, marginTop: 2 }]}>
          {option.description}
        </Text>
      </View>
      <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={[commonStyles.spaceBetween, commonStyles.px_md, commonStyles.py_md]}>
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
            console.log('Back button pressed');
            onBack();
          }}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={[commonStyles.subtitle, { fontSize: 20 }]}>
          Settings
        </Text>
        
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={[commonStyles.px_md, commonStyles.pb_xl]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[commonStyles.textSecondary, commonStyles.mb_md, { fontSize: 12 }]}>
          ACCOUNT & WALLET
        </Text>
        
        {settingsOptions.slice(0, 2).map(renderSettingOption)}
        
        <Text style={[commonStyles.textSecondary, commonStyles.mb_md, commonStyles.mt_lg, { fontSize: 12 }]}>
          GENERAL
        </Text>
        
        {settingsOptions.slice(2).map(renderSettingOption)}

        <View style={[commonStyles.card, commonStyles.mt_lg]}>
          <Text style={[commonStyles.textSecondary, { fontSize: 12, textAlign: 'center' }]}>
            Version 1.0.0 • Built on Base Blockchain
          </Text>
        </View>
      </ScrollView>

      {/* Wallet Connection Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={showWalletSheet}
        onClose={() => setShowWalletSheet(false)}
      >
        <WalletConnection
          onWalletConnected={(walletInfo) => {
            console.log('Wallet connected in settings:', walletInfo);
            setShowWalletSheet(false);
          }}
        />
      </SimpleBottomSheet>

      {/* Email Subscription Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={showEmailSheet}
        onClose={() => setShowEmailSheet(false)}
      >
        <EmailSubscription
          onSubscriptionComplete={(email, preferences) => {
            console.log('Email subscription completed in settings:', email, preferences);
            setShowEmailSheet(false);
          }}
        />
      </SimpleBottomSheet>
    </View>
  );
}
